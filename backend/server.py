from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random
import asyncio

# Import our models and database
from models import *
from database import database
from game_logic import game_logic
from story_content import get_story_chapters, get_chapter_by_number

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Solo Leveling API", description="API for the Solo Leveling RPG Game")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Daily Quest Models
class DailyQuestStatus(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    date: str
    pushups: int = 0
    situps: int = 0
    running_km: float = 0.0
    completed: bool = False
    failed: bool = False
    penalty_served: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DailyQuestUpdate(BaseModel):
    pushups: Optional[int] = None
    situps: Optional[int] = None
    running_km: Optional[float] = None

class PenaltyZoneSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    duration_minutes: int = 120  # 2 hours
    survived: bool = False
    damage_taken: int = 0
    centipedes_killed: int = 0

# Combat and Shadow Extraction Models
class CombatResult(BaseModel):
    success: bool
    exp_gained: int
    damage_taken: int
    items_dropped: List[str] = []
    shadows_available: List[Dict[str, Any]] = []

class ShadowExtractionAttempt(BaseModel):
    enemy_name: str
    success_rate: float
    mana_cost: int

# Basic API endpoints
@api_router.get("/")
async def root():
    return {"message": "Welcome to Solo Leveling RPG API - The Shadow Monarch Awaits..."}

@api_router.get("/health")
async def health_check():
    return {"status": "alive", "message": "System is operational"}

# Initialize game data on startup
@app.on_event("startup")
async def startup_event():
    await database.initialize_game_data()
    logger.info("Game data initialized successfully")

# Player Management Endpoints
@api_router.post("/players", response_model=Player)
async def create_player(player_data: PlayerCreate):
    """Create a new player with initial setup"""
    try:
        player = await database.create_player(player_data)
        
        # Initialize story chapters for the player
        story_chapters = get_story_chapters()
        for i, chapter_data in enumerate(story_chapters):
            chapter = StoryChapter(
                chapter_number=chapter_data["chapter_number"],
                title=chapter_data["title"],
                description=chapter_data["description"],
                content=chapter_data["content"],
                unlocked=(i == 0),
                player_id=player.id
            )
            await db.story_chapters.insert_one(chapter.dict())
            
        return player
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: str):
    """Get player information"""
    player = await database.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@api_router.put("/players/{player_id}", response_model=Player)
async def update_player(player_id: str, updates: PlayerUpdate):
    """Update player information"""
    player = await database.update_player(player_id, updates)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

# Daily Quest System - The Iconic Solo Leveling Feature!
@api_router.get("/players/{player_id}/daily-quest")
async def get_daily_quest(player_id: str):
    """Get today's daily quest status"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Check if daily quest exists for today
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc:
        # Create new daily quest for today
        daily_quest = DailyQuestStatus(player_id=player_id, date=today)
        await db.daily_quests.insert_one(daily_quest.dict())
        daily_quest_doc = daily_quest.dict()
    
    # Add the penalty zone threat message
    quest_data = {
        **daily_quest_doc,
        "title": "Preparation for Becoming Strong",
        "description": "Complete the daily training regimen. Failure will result in punishment.",
        "requirements": {
            "pushups": 100,
            "situps": 100,
            "running_km": 10.0
        },
        "penalty_warning": "⚠️ Failure to complete within 24 hours will transport you to the Penalty Zone for 2 hours!",
        "time_remaining": "23:45:30",  # Calculate actual remaining time
        "easter_egg": "💀 The System is always watching... 👁️"
    }
    
    return quest_data

@api_router.put("/players/{player_id}/daily-quest")
async def update_daily_quest(player_id: str, update: DailyQuestUpdate):
    """Update daily quest progress"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Find today's quest
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc:
        raise HTTPException(status_code=404, detail="No daily quest found for today")
    
    # Update progress
    update_data = {}
    if update.pushups is not None:
        update_data["pushups"] = min(update.pushups, 100)
    if update.situps is not None:
        update_data["situps"] = min(update.situps, 100)
    if update.running_km is not None:
        update_data["running_km"] = min(update.running_km, 10.0)
    
    # Check if quest is completed
    current_pushups = update_data.get("pushups", daily_quest_doc["pushups"])
    current_situps = update_data.get("situps", daily_quest_doc["situps"])
    current_running = update_data.get("running_km", daily_quest_doc["running_km"])
    
    if current_pushups >= 100 and current_situps >= 100 and current_running >= 10.0:
        update_data["completed"] = True
        
        # Award rewards
        player = await database.get_player(player_id)
        if player:
            # Level up logic
            level_info = await game_logic.level_up_player(player_id, 1000)
            
            # Add stat bonuses
            new_stats = player.stats
            new_stats.strength += 2
            new_stats.vitality += 1
            new_stats.agility += 1
            
            await database.update_player(player_id, PlayerUpdate(
                stats=new_stats,
                experience=player.experience + 1000
            ))
    
    await db.daily_quests.update_one(
        {"player_id": player_id, "date": today},
        {"$set": update_data}
    )
    
    # Return updated quest with motivational messages
    updated_quest = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    # Add Easter egg messages based on progress
    progress_messages = [
        "💪 Jin-Woo's determination burns bright!",
        "🔥 The System acknowledges your effort...",
        "⚡ Power flows through your muscles!",
        "🌟 You're becoming stronger than yesterday!",
        "👑 The Shadow Monarch's power awakens!"
    ]
    
    updated_quest["motivational_message"] = random.choice(progress_messages)
    return updated_quest

@api_router.post("/players/{player_id}/penalty-zone")
async def enter_penalty_zone(player_id: str):
    """Enter the dreaded penalty zone - Giant Centipede Desert!"""
    
    # Check if player has failed daily quest
    today = datetime.now().strftime("%Y-%m-%d")
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc or daily_quest_doc.get("completed", False):
        raise HTTPException(status_code=400, detail="No penalty required - quest completed or not found")
    
    # Create penalty zone session
    penalty_session = PenaltyZoneSession(player_id=player_id)
    await db.penalty_zones.insert_one(penalty_session.dict())
    
    return {
        "message": "⚠️ SYSTEM WARNING ⚠️",
        "description": "You have been transported to the Penalty Zone!",
        "location": "🏜️ Endless Desert of Giant Centipedes",
        "objective": "Survive for 2 hours while being hunted by massive centipedes",
        "danger_level": "EXTREME",
        "easter_egg": "🦂 The centipedes are the size of subway cars... Good luck! 💀",
        "survival_tip": "Keep moving. They can sense vibrations in the sand.",
        "session_id": penalty_session.id,
        "duration_minutes": 120
    }

@api_router.get("/players/{player_id}/penalty-zone/{session_id}")
async def get_penalty_zone_status(player_id: str, session_id: str):
    """Get current penalty zone survival status"""
    session_doc = await db.penalty_zones.find_one({
        "id": session_id,
        "player_id": player_id
    })
    
    if not session_doc:
        raise HTTPException(status_code=404, detail="Penalty zone session not found")
    
    session = PenaltyZoneSession(**session_doc)
    elapsed_minutes = (datetime.utcnow() - session.start_time).total_seconds() / 60
    remaining_minutes = max(0, 120 - elapsed_minutes)
    
    # Random centipede encounter messages
    encounter_messages = [
        "🦂 A massive centipede bursts from the sand behind you!",
        "👁️ You feel dozens of eyes watching from beneath the dunes...",
        "🏜️ The sand shifts ominously around your feet...",
        "⚡ Lightning crackles as a giant centipede charges!",
        "💀 The skeletal remains of previous victims litter the sand..."
    ]
    
    return {
        "session_id": session_id,
        "elapsed_minutes": int(elapsed_minutes),
        "remaining_minutes": int(remaining_minutes),
        "progress_percent": min(100, (elapsed_minutes / 120) * 100),
        "status": "SURVIVING" if remaining_minutes > 0 else "ESCAPED",
        "encounter_message": random.choice(encounter_messages) if remaining_minutes > 0 else "🎉 You have survived the Penalty Zone!",
        "centipedes_encountered": random.randint(3, 8),
        "damage_taken": random.randint(20, 50),
        "easter_egg": "🎮 This is harder than Dark Souls..." if remaining_minutes > 60 else "🏃‍♂️ Almost there! Don't give up!"
    }

# Shadow Extraction System - The Signature Solo Leveling Ability!
@api_router.post("/players/{player_id}/extract-shadow")
async def extract_shadow(player_id: str, extraction: ShadowExtractionAttempt):
    """Extract a shadow from a defeated enemy - Jin-Woo's unique power!"""
    
    player = await database.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Check mana cost
    if player.mp < extraction.mana_cost:
        return {
            "success": False,
            "message": "Insufficient MP for shadow extraction",
            "easter_egg": "💀 'I need more mana...' - Every RPG player ever"
        }
    
    # Calculate success based on player level and enemy
    base_success_rate = extraction.success_rate
    level_bonus = player.level * 0.02  # 2% per level
    final_success_rate = min(0.95, base_success_rate + level_bonus)
    
    success = random.random() < final_success_rate
    
    if success:
        # Create shadow based on enemy type
        shadow_types = {
            "Goblin": {"type": "Warrior", "rarity": ItemRarity.COMMON, "base_stats": 100},
            "Hobgoblin": {"type": "Knight", "rarity": ItemRarity.RARE, "base_stats": 200},
            "Ice Elf": {"type": "Archer", "rarity": ItemRarity.EPIC, "base_stats": 400},
            "Demon Soldier": {"type": "Elite Warrior", "rarity": ItemRarity.LEGENDARY, "base_stats": 800},
            "Dragon": {"type": "Ancient Beast", "rarity": ItemRarity.MYTHIC, "base_stats": 1500}
        }
        
        enemy_data = shadow_types.get(extraction.enemy_name, shadow_types["Goblin"])
        
        # Create the shadow
        shadow_data = ShadowCreate(
            name=f"Shadow {extraction.enemy_name}",
            type=enemy_data["type"],
            rarity=enemy_data["rarity"],
            stats={
                "attack": enemy_data["base_stats"] + random.randint(-50, 50),
                "defense": enemy_data["base_stats"] // 2 + random.randint(-25, 25),
                "hp": enemy_data["base_stats"] * 5,
                "mp": enemy_data["base_stats"] // 2
            },
            skills=[f"{extraction.enemy_name} Strike", "Shadow Form", "Loyalty"]
        )
        
        shadow = await database.create_shadow(player_id, shadow_data)
        
        # Deduct mana
        await database.update_player(player_id, PlayerUpdate(mp=player.mp - extraction.mana_cost))
        
        # Epic success messages with Easter eggs
        success_messages = [
            f"🌟 ARISE! {extraction.enemy_name} has joined your shadow army!",
            f"⚡ The darkness bends to your will! Shadow {extraction.enemy_name} awakens!",
            f"👑 'You shall serve me for eternity!' - Shadow {extraction.enemy_name} extracted!",
            f"🔮 The power of the Shadow Monarch flows through you!",
            f"💀 Death is not the end, but a new beginning as your shadow!"
        ]
        
        return {
            "success": True,
            "message": random.choice(success_messages),
            "shadow": shadow.dict(),
            "easter_egg": "🎭 'Arise' is the coolest spell in any manhwa! 👑",
            "army_count": len(await database.get_player_shadows(player_id)),
            "special_effect": "Dark energy swirls around the fallen enemy as their shadow rises to serve you..."
        }
    else:
        failure_messages = [
            f"💔 Shadow extraction failed... {extraction.enemy_name}'s soul resists your call",
            f"⚡ The shadow slips through your grasp like smoke...",
            f"🌑 Not all souls can be claimed by the Shadow Monarch",
            f"💨 The enemy's will is too strong to be bound as a shadow"
        ]
        
        return {
            "success": False,
            "message": random.choice(failure_messages),
            "easter_egg": "😢 Even Jin-Woo failed sometimes... Try again!",
            "tip": "Higher level increases success rate. Keep grinding!"
        }

@api_router.get("/players/{player_id}/shadows", response_model=List[Shadow])
async def get_player_shadows(player_id: str):
    """Get all shadows in player's army"""
    shadows = await database.get_player_shadows(player_id)
    return shadows

@api_router.put("/players/{player_id}/shadows/{shadow_id}/upgrade")
async def upgrade_shadow(player_id: str, shadow_id: str):
    """Upgrade a shadow soldier - Make them stronger!"""
    
    shadow = await database.get_shadow(shadow_id)
    if not shadow or shadow.player_id != player_id:
        raise HTTPException(status_code=404, detail="Shadow not found")
    
    # Upgrade logic
    upgrade_cost = shadow.level * 1000
    player = await database.get_player(player_id)
    
    if player.experience < upgrade_cost:
        return {
            "success": False,
            "message": f"Need {upgrade_cost} XP to upgrade {shadow.name}",
            "easter_egg": "💰 'Upgrading shadows ain't cheap!' - Jin-Woo probably"
        }
    
    # Perform upgrade
    new_level = shadow.level + 1
    stat_increase = int(shadow.level * 0.1 * 100)  # 10% increase per level
    
    new_stats = {
        "attack": shadow.stats["attack"] + stat_increase,
        "defense": shadow.stats["defense"] + stat_increase // 2,
        "hp": shadow.stats["hp"] + stat_increase * 2,
        "mp": shadow.stats["mp"] + stat_increase // 2
    }
    
    # Update shadow in database
    await db.shadows.update_one(
        {"id": shadow_id},
        {"$set": {"level": new_level, "stats": new_stats}}
    )
    
    # Deduct experience
    await database.update_player(player_id, PlayerUpdate(experience=player.experience - upgrade_cost))
    
    upgrade_messages = [
        f"⚡ {shadow.name} grows stronger! Level {new_level} achieved!",
        f"🌟 Your shadow warrior evolves! New power level: {sum(new_stats.values())}",
        f"👑 The Shadow Monarch's blessing enhances {shadow.name}!",
        f"🔥 {shadow.name} has transcended their limits!"
    ]
    
    return {
        "success": True,
        "message": random.choice(upgrade_messages),
        "new_level": new_level,
        "new_stats": new_stats,
        "easter_egg": "📈 Numbers go up! Dopamine goes brrr! 🧠⚡"
    }

# Instant Dungeons - Personal Training Grounds!
@api_router.get("/players/{player_id}/instant-dungeons")
async def get_instant_dungeons(player_id: str):
    """Get available instant dungeons for training"""
    
    player = await database.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Generate level-appropriate instant dungeons
    instant_dungeons = [
        {
            "id": "training_grounds",
            "name": "🏟️ Training Grounds",
            "description": "Perfect for beginners. Weak goblins and slimes await.",
            "min_level": 1,
            "max_level": 10,
            "entry_cost": 0,
            "rewards": ["XP", "Basic Equipment", "Goblin Shadows"],
            "easter_egg": "🎮 Tutorial dungeon - even your grandma could clear this!"
        },
        {
            "id": "shadow_realm",
            "name": "🌑 Shadow Realm",
            "description": "Where shadows come to train. Mysterious and dangerous.",
            "min_level": 15,
            "max_level": 30,
            "entry_cost": 100,
            "rewards": ["Shadow Essence", "Dark Equipment", "Rare Shadows"],
            "easter_egg": "👻 'Welcome to the shadow realm, Jimbo!' - Yu-Gi-Oh vibes"
        },
        {
            "id": "monarchs_trial",
            "name": "👑 Monarch's Trial",
            "description": "The ultimate test. Only for those who dare to become kings.",
            "min_level": 40,
            "max_level": 50,
            "entry_cost": 1000,
            "rewards": ["Monarch Equipment", "Ancient Shadows", "Crown Fragments"],
            "easter_egg": "🏆 'Heavy is the head that wears the crown...' 👑"
        }
    ]
    
    # Filter dungeons based on player level
    available_dungeons = [
        d for d in instant_dungeons 
        if player.level >= d["min_level"]
    ]
    
    return {
        "available_dungeons": available_dungeons,
        "player_level": player.level,
        "recommendation": "Start with Training Grounds if you're new to instant dungeons!",
        "pro_tip": "💡 Instant dungeons respawn infinitely - perfect for grinding!"
    }

@api_router.post("/players/{player_id}/instant-dungeons/{dungeon_id}/enter")
async def enter_instant_dungeon(player_id: str, dungeon_id: str):
    """Enter an instant dungeon for training"""
    
    player = await database.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Simulate dungeon encounter
    combat_results = []
    total_exp = 0
    shadows_extracted = []
    
    # Different enemies based on dungeon
    dungeon_enemies = {
        "training_grounds": ["Goblin", "Slime", "Wolf"],
        "shadow_realm": ["Shadow Goblin", "Dark Wraith", "Void Walker"],
        "monarchs_trial": ["Elite Knight", "Ancient Dragon", "Demon Lord"]
    }
    
    enemies = dungeon_enemies.get(dungeon_id, ["Goblin"])
    num_encounters = random.randint(3, 7)
    
    for i in range(num_encounters):
        enemy = random.choice(enemies)
        
        # Combat simulation
        player_power = game_logic.calculate_combat_power(player, [])
        enemy_power = random.randint(50, 200) * (player.level // 5 + 1)
        
        victory = player_power > enemy_power * 0.7  # 70% success threshold
        
        if victory:
            exp_gained = random.randint(100, 300) * (player.level // 5 + 1)
            total_exp += exp_gained
            
            # Chance for shadow extraction
            if random.random() < 0.3:  # 30% chance
                shadows_extracted.append(enemy)
            
            combat_results.append({
                "encounter": i + 1,
                "enemy": enemy,
                "result": "Victory! ⚔️",
                "exp_gained": exp_gained,
                "shadow_available": enemy in shadows_extracted
            })
        else:
            combat_results.append({
                "encounter": i + 1,
                "enemy": enemy,
                "result": "Defeat... 💀",
                "exp_gained": 0,
                "shadow_available": False
            })
            break  # End dungeon on defeat
    
    # Level up player
    if total_exp > 0:
        level_info = await game_logic.level_up_player(player_id, total_exp)
    
    completion_messages = [
        "🎉 Instant dungeon cleared! Your training pays off!",
        "⚡ Victory! The Shadow Monarch's power grows!",
        "🏆 Another successful training session!",
        "💪 Jin-Woo would be proud of your progress!"
    ]
    
    return {
        "dungeon_cleared": len([r for r in combat_results if "Victory" in r["result"]]) > 0,
        "encounters": combat_results,
        "total_exp_gained": total_exp,
        "shadows_available_for_extraction": shadows_extracted,
        "level_up_info": level_info if total_exp > 0 else None,
        "completion_message": random.choice(completion_messages),
        "easter_egg": f"🎲 RNG was {'kind' if total_exp > 500 else 'cruel'} to you today!",
        "next_tip": "Don't forget to extract those shadows! 👻"
    }

# Enhanced Story System with Rich Narrative
@api_router.get("/players/{player_id}/story")
async def get_player_story_progress(player_id: str):
    """Get player's story progress with enhanced narrative"""
    
    chapters = await database.get_player_story_chapters(player_id)
    
    if not chapters:
        # Initialize story chapters if they don't exist
        story_chapters = get_story_chapters()
        for i, chapter_data in enumerate(story_chapters):
            chapter = StoryChapter(
                chapter_number=chapter_data["chapter_number"],
                title=chapter_data["title"],
                description=chapter_data["description"],
                content=chapter_data["content"],
                unlocked=(i == 0),
                player_id=player_id
            )
            await db.story_chapters.insert_one(chapter.dict())
        
        chapters = await database.get_player_story_chapters(player_id)
    
    # Add narrative enhancements
    enhanced_chapters = []
    for chapter in chapters:
        enhanced_chapter = {
            **chapter.dict(),
            "reading_time": f"{len(chapter.content) * 2} minutes",
            "difficulty": "📖 Narrative" if chapter.chapter_number <= 2 else "⚔️ Action-Packed",
            "emotional_impact": random.choice(["😢 Heartbreaking", "😤 Intense", "😱 Shocking", "🔥 Epic", "😊 Inspiring"]),
            "fan_rating": f"⭐ {random.uniform(4.5, 5.0):.1f}/5.0"
        }
        enhanced_chapters.append(enhanced_chapter)
    
    completed_count = len([c for c in chapters if c.completed])
    
    return {
        "chapters": enhanced_chapters,
        "progress": {
            "completed": completed_count,
            "total": len(chapters),
            "percentage": int((completed_count / len(chapters)) * 100) if chapters else 0
        },
        "current_arc": "🌟 Shadow Monarch Awakening Arc",
        "next_unlock": "Complete current chapter to unlock the next part of Jin-Woo's journey!",
        "easter_egg": "📚 'This is better than most anime!' - Every Solo Leveling fan",
        "fun_fact": "💡 Did you know? The Double Dungeon incident changed everything in the Solo Leveling universe!"
    }

@api_router.get("/story/chapters/{chapter_number}")
async def get_story_chapter_content(chapter_number: int):
    """Get rich story chapter content with enhanced narrative"""
    
    chapter_data = get_chapter_by_number(chapter_number)
    if not chapter_data:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Enhance the story content with narrative elements
    enhanced_content = []
    
    for content_piece in chapter_data["content"]:
        enhanced_piece = {**content_piece}
        
        # Add atmospheric descriptions
        if content_piece["type"] == "narrative":
            enhanced_piece["atmosphere"] = random.choice([
                "🌙 Dark and mysterious",
                "⚡ Tense and electrifying", 
                "🌟 Awe-inspiring",
                "💀 Ominous and foreboding",
                "🔥 Intense and dramatic"
            ])
            enhanced_piece["background_music"] = random.choice([
                "🎵 Epic orchestral theme",
                "🎶 Mysterious ambient sounds",
                "🎼 Intense battle music",
                "🎸 Emotional piano melody"
            ])
        
        # Add choice consequences preview
        if content_piece["type"] == "choice":
            for option in enhanced_piece["options"]:
                option["preview"] = f"This choice will affect your character development..."
                option["popularity"] = f"{random.randint(15, 45)}% of players chose this"
        
        enhanced_content.append(enhanced_piece)
    
    # Add chapter metadata
    chapter_meta = {
        "word_count": sum(len(c.get("text", "")) for c in chapter_data["content"]),
        "estimated_reading_time": f"{len(chapter_data['content']) * 3} minutes",
        "themes": ["Power", "Growth", "Determination", "Friendship", "Sacrifice"],
        "easter_eggs_count": random.randint(2, 5),
        "fan_favorite_moment": "The moment when Jin-Woo first hears 'The System has awakened'",
        "trivia": "🤓 This chapter is based on the early manhwa chapters where everything changed for Jin-Woo!"
    }
    
    return {
        "chapter": {
            **chapter_data,
            "content": enhanced_content,
            "metadata": chapter_meta
        },
        "navigation": {
            "previous_chapter": chapter_number - 1 if chapter_number > 1 else None,
            "next_chapter": chapter_number + 1 if chapter_number < 6 else None
        },
        "reader_engagement": {
            "likes": random.randint(5000, 15000),
            "comments": random.randint(200, 800),
            "shares": random.randint(50, 200)
        },
        "easter_egg": "🎭 'The weakest hunter becomes the strongest' - Classic shounen vibes! 💪"
    }

# Equipment Enhancement System - Upgrade Your Gear!
@api_router.get("/players/{player_id}/equipment", response_model=List[Equipment])
async def get_player_equipment(player_id: str):
    """Get all player equipment with enhancement info"""
    equipment = await database.get_player_equipment(player_id)
    
    # Add enhancement info to each item
    enhanced_equipment = []
    for item in equipment:
        item_dict = item.dict()
        item_dict["enhancement_level"] = getattr(item, "enhancement_level", 0)
        item_dict["max_enhancement"] = 10
        item_dict["enhancement_cost"] = (item_dict["enhancement_level"] + 1) * 1000
        item_dict["success_rate"] = max(10, 100 - (item_dict["enhancement_level"] * 10))
        enhanced_equipment.append(item_dict)
    
    return enhanced_equipment

@api_router.post("/players/{player_id}/equipment/{item_id}/enhance")
async def enhance_equipment(player_id: str, item_id: str):
    """Enhance equipment - Risk vs Reward!"""
    
    # Get equipment
    equipment_list = await database.get_player_equipment(player_id)
    item = next((e for e in equipment_list if e.id == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    enhancement_level = getattr(item, "enhancement_level", 0)
    
    if enhancement_level >= 10:
        return {
            "success": False,
            "message": "Equipment is already at maximum enhancement level!",
            "easter_egg": "✨ This gear is perfect! No more upgrades needed! 🌟"
        }
    
    # Calculate costs and success rate
    enhancement_cost = (enhancement_level + 1) * 1000
    success_rate = max(10, 100 - (enhancement_level * 10))
    
    player = await database.get_player(player_id)
    if player.experience < enhancement_cost:
        return {
            "success": False,
            "message": f"Need {enhancement_cost} XP to enhance this item",
            "easter_egg": "💸 'Enhancement is expensive!' - Every MMO player ever"
        }
    
    # Roll for success
    success = random.randint(1, 100) <= success_rate
    
    if success:
        # Successful enhancement
        new_level = enhancement_level + 1
        stat_boost = int((item.attack or item.defense or 10) * 0.15)  # 15% boost
        
        # Update item stats
        update_data = {"enhancement_level": new_level}
        if item.attack:
            update_data["attack"] = item.attack + stat_boost
        if item.defense:
            update_data["defense"] = item.defense + stat_boost
        
        await db.equipment.update_one(
            {"id": item_id},
            {"$set": update_data}
        )
        
        # Deduct experience
        await database.update_player(player_id, PlayerUpdate(experience=player.experience - enhancement_cost))
        
        success_messages = [
            f"✨ SUCCESS! {item.name} is now +{new_level}!",
            f"🌟 Enhancement successful! Your gear shines with new power!",
            f"⚡ {item.name} has been blessed by the Enhancement Gods!",
            f"🔥 Upgrade complete! Power level increased!"
        ]
        
        return {
            "success": True,
            "message": random.choice(success_messages),
            "new_enhancement_level": new_level,
            "stat_increase": stat_boost,
            "easter_egg": "🎉 'ENHANCEMENT SUCCESS!' *satisfying ding sound* 🔔",
            "sparkle_effect": "✨✨✨ Your equipment glows with enhanced power! ✨✨✨"
        }
    else:
        # Failed enhancement
        failure_messages = [
            f"💥 FAILURE! {item.name} enhancement failed!",
            f"😢 The enhancement gods were not kind today...",
            f"💔 So close! Better luck next time!",
            f"⚡ The power was too much for {item.name} to handle!"
        ]
        
        # In some games, failure downgrades or destroys items
        # Let's be nice and just consume resources
        await database.update_player(player_id, PlayerUpdate(experience=player.experience - enhancement_cost))
        
        return {
            "success": False,
            "message": random.choice(failure_messages),
            "consolation": "Don't worry! You didn't lose the item - that would be too cruel! 😅",
            "easter_egg": "💸 'My precious XP...' - Gollum voice",
            "encouragement": "🌟 Failure is just practice for success! Try again!"
        }

# Combat System for Dungeons
@api_router.post("/players/{player_id}/dungeons/{dungeon_id}/combat")
async def dungeon_combat(player_id: str, dungeon_id: str):
    """Engage in dungeon combat with enhanced battle system"""
    
    player = await database.get_player(player_id)
    dungeon = await database.get_dungeon(dungeon_id)
    
    if not player or not dungeon:
        raise HTTPException(status_code=404, detail="Player or dungeon not found")
    
    # Simulate epic combat
    combat_result = game_logic.simulate_dungeon_combat(player, dungeon)
    
    # Enhanced combat messages
    if combat_result["success"]:
        victory_messages = [
            f"🏆 VICTORY! You conquered the {dungeon.name}!",
            f"⚔️ The monsters fall before your might!",
            f"👑 Another dungeon bows to the Shadow Monarch!",
            f"🌟 Flawless Victory! Jin-Woo would be proud!"
        ]
        
        # Create dungeon attempt record
        attempt = await database.create_dungeon_attempt(player_id, dungeon_id)
        await db.dungeon_attempts.update_one(
            {"id": attempt.id},
            {"$set": {
                "cleared": True,
                "clear_time": combat_result["clear_time"],
                "rewards_gained": combat_result.get("equipment_drop", [])
            }}
        )
        
        # Award experience
        await game_logic.level_up_player(player_id, combat_result["exp_gained"])
        
        result = {
            "success": True,
            "message": random.choice(victory_messages),
            "exp_gained": combat_result["exp_gained"],
            "clear_time": f"{combat_result['clear_time'] // 60}m {combat_result['clear_time'] % 60}s",
            "equipment_dropped": combat_result.get("equipment_drop"),
            "easter_egg": "🎮 'GG EZ' - You, probably 😎",
            "battle_cry": "FOR THE SHADOW ARMY! ⚡👥⚡"
        }
        
        # Add loot if equipment dropped
        if combat_result.get("equipment_drop"):
            result["loot_message"] = "💎 Rare equipment obtained! Check your inventory!"
        
        return result
    else:
        defeat_messages = [
            f"💀 Defeat... The {dungeon.name} proved too challenging",
            f"😞 Not today... Retreat and grow stronger!",
            f"⚡ The dungeon's power overwhelmed you",
            f"🌙 Even shadows must retreat sometimes..."
        ]
        
        return {
            "success": False,
            "message": random.choice(defeat_messages),
            "damage_taken": combat_result["damage_taken"],
            "consolation_exp": combat_result["exp_gained"],
            "easter_egg": "💪 'What doesn't kill you makes you stronger!' - Friedrich Nietzsche",
            "encouragement": "🌟 Every defeat is a lesson! Train harder and try again!",
            "tip": "💡 Consider upgrading your equipment or leveling up before retrying"
        }

# Fun Easter Eggs and Secret Endpoints
@api_router.get("/easter-eggs/jin-woo-quotes")
async def get_jin_woo_quotes():
    """Secret endpoint with Jin-Woo's iconic quotes"""
    quotes = [
        "🗣️ 'The strong do whatever they want, and the weak just grit their teeth and accept it.'",
        "⚡ 'Arise.'",
        "👑 'I am the Shadow Monarch.'",
        "🌟 'I'll prove that even the weakest person can become strong.'",
        "🔥 'Those who have the power should be responsible for those who don't.'",
        "💀 'Death is not the end. It's the beginning of a new adventure.'",
        "⚔️ 'I don't run from my enemies. They run from me.'",
        "🌙 'In the deepest darkness, shadows are born.'"
    ]
    
    return {
        "quote": random.choice(quotes),
        "easter_egg": "🎭 Jin-Woo was basically the Batman of the hunter world! 🦇",
        "fun_fact": "💡 These quotes gave millions of fans goosebumps!",
        "author_note": "📚 Chugong really knew how to write epic dialogue!"
    }

@api_router.get("/easter-eggs/stats")
async def get_funny_stats():
    """Fun statistics about the game"""
    return {
        "total_shadows_extracted": random.randint(50000, 100000),
        "daily_quests_failed": random.randint(5000, 15000),
        "penalty_zone_survivors": random.randint(500, 2000),
        "equipment_enhancement_failures": random.randint(20000, 50000),
        "jin_woo_simps": "∞ (Everyone)",
        "easter_egg": "📊 'Statistics are like a bikini. What they reveal is suggestive, but what they conceal is vital.' - Aaron Levenstein",
        "hidden_truth": "🤫 The real treasure was the shadows we extracted along the way!"
    }

# Include the router in the main app
app.include_router(api_router)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Shutdown handler
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")

# Root endpoint for testing
@app.get("/")
async def root():
    return {
        "message": "🌟 Solo Leveling RPG API - Welcome to the Shadow Realm! 👑",
        "version": "2.0.0",
        "easter_egg": "🎮 'This isn't even my final form!' - API Server probably",
        "tip": "💡 Access the API documentation at /docs for all available endpoints!"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
