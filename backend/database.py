from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict, Any
from models import *
import os
from datetime import datetime

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class DatabaseManager:
    def __init__(self):
        self.players = db.players
        self.equipment = db.equipment
        self.consumables = db.consumables
        self.shadows = db.shadows
        self.skills = db.skills
        self.quests = db.quests
        self.dungeons = db.dungeons
        self.dungeon_attempts = db.dungeon_attempts
        self.story_chapters = db.story_chapters
        self.guild_members = db.guild_members
        self.rankings = db.rankings

    # Player operations
    async def create_player(self, player_data: PlayerCreate) -> Player:
        player = Player(name=player_data.name)
        await self.players.insert_one(player.dict())
        
        # Initialize default equipment and skills
        await self.initialize_player_data(player.id)
        
        return player

    async def get_player(self, player_id: str) -> Optional[Player]:
        player_doc = await self.players.find_one({"id": player_id})
        return Player(**player_doc) if player_doc else None

    async def update_player(self, player_id: str, updates: PlayerUpdate) -> Optional[Player]:
        update_data = {k: v for k, v in updates.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.players.update_one(
            {"id": player_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await self.get_player(player_id)
        return None

    async def initialize_player_data(self, player_id: str):
        # Create default equipment
        default_equipment = [
            {
                "name": "Rusty Sword",
                "type": "weapon",
                "category": "sword",
                "rarity": ItemRarity.COMMON,
                "attack": 20,
                "player_id": player_id,
                "equipped": True
            },
            {
                "name": "Basic Armor",
                "type": "armor",
                "category": "chest",
                "rarity": ItemRarity.COMMON,
                "defense": 15,
                "player_id": player_id,
                "equipped": True
            }
        ]
        
        for item in default_equipment:
            equipment = Equipment(**item)
            await self.equipment.insert_one(equipment.dict())

        # Create default skills
        default_skills = [
            {
                "name": "Basic Attack",
                "description": "A simple melee attack",
                "unlocked": True,
                "player_id": player_id
            },
            {
                "name": "Shadow Extraction",
                "description": "Extract shadows from defeated enemies",
                "unlocked": False,
                "player_id": player_id
            }
        ]
        
        for skill_data in default_skills:
            skill = Skill(**skill_data)
            await self.skills.insert_one(skill.dict())

        # Create default quests
        default_quests = [
            {
                "title": "First Steps",
                "description": "Complete your first dungeon",
                "type": QuestType.STORY,
                "target": 1,
                "reward": "500 XP, Basic Equipment",
                "player_id": player_id
            },
            {
                "title": "Daily Training",
                "description": "Complete 100 push-ups, 100 sit-ups, and 10km run",
                "type": QuestType.DAILY,
                "target": 3,
                "reward": "1000 XP, +2 Strength",
                "player_id": player_id
            }
        ]
        
        for quest_data in default_quests:
            quest = Quest(**quest_data)
            await self.quests.insert_one(quest.dict())

    # Equipment operations
    async def get_player_equipment(self, player_id: str) -> List[Equipment]:
        equipment_docs = await self.equipment.find({"player_id": player_id}).to_list(1000)
        return [Equipment(**doc) for doc in equipment_docs]

    async def create_equipment(self, player_id: str, equipment_data: EquipmentCreate) -> Equipment:
        equipment = Equipment(**equipment_data.dict(), player_id=player_id)
        await self.equipment.insert_one(equipment.dict())
        return equipment

    async def equip_item(self, player_id: str, item_id: str) -> bool:
        # First, get the item to equip
        item_doc = await self.equipment.find_one({"id": item_id, "player_id": player_id})
        if not item_doc:
            return False
        
        item = Equipment(**item_doc)
        
        # Unequip other items of the same type
        await self.equipment.update_many(
            {"player_id": player_id, "type": item.type},
            {"$set": {"equipped": False}}
        )
        
        # Equip the selected item
        await self.equipment.update_one(
            {"id": item_id},
            {"$set": {"equipped": True}}
        )
        
        return True

    # Shadow operations
    async def get_player_shadows(self, player_id: str) -> List[Shadow]:
        shadow_docs = await self.shadows.find({"player_id": player_id}).to_list(1000)
        return [Shadow(**doc) for doc in shadow_docs]

    async def create_shadow(self, player_id: str, shadow_data: ShadowCreate) -> Shadow:
        shadow = Shadow(**shadow_data.dict(), player_id=player_id)
        await self.shadows.insert_one(shadow.dict())
        return shadow

    async def get_shadow(self, shadow_id: str) -> Optional[Shadow]:
        shadow_doc = await self.shadows.find_one({"id": shadow_id})
        return Shadow(**shadow_doc) if shadow_doc else None

    # Quest operations
    async def get_player_quests(self, player_id: str) -> List[Quest]:
        quest_docs = await self.quests.find({"player_id": player_id}).to_list(1000)
        return [Quest(**doc) for doc in quest_docs]

    async def update_quest_progress(self, quest_id: str, progress: int) -> Optional[Quest]:
        quest_doc = await self.quests.find_one({"id": quest_id})
        if not quest_doc:
            return None
        
        quest = Quest(**quest_doc)
        new_progress = min(progress, quest.target)
        completed = new_progress >= quest.target
        
        await self.quests.update_one(
            {"id": quest_id},
            {"$set": {"progress": new_progress, "completed": completed, "updated_at": datetime.utcnow()}}
        )
        
        return await self.get_quest(quest_id)

    async def get_quest(self, quest_id: str) -> Optional[Quest]:
        quest_doc = await self.quests.find_one({"id": quest_id})
        return Quest(**quest_doc) if quest_doc else None

    # Dungeon operations
    async def get_dungeons(self) -> List[Dungeon]:
        dungeon_docs = await self.dungeons.find().to_list(1000)
        return [Dungeon(**doc) for doc in dungeon_docs]

    async def get_dungeon(self, dungeon_id: str) -> Optional[Dungeon]:
        dungeon_doc = await self.dungeons.find_one({"id": dungeon_id})
        return Dungeon(**dungeon_doc) if dungeon_doc else None

    async def create_dungeon_attempt(self, player_id: str, dungeon_id: str) -> DungeonAttempt:
        attempt = DungeonAttempt(player_id=player_id, dungeon_id=dungeon_id)
        await self.dungeon_attempts.insert_one(attempt.dict())
        return attempt

    async def get_player_dungeon_attempts(self, player_id: str) -> List[DungeonAttempt]:
        attempt_docs = await self.dungeon_attempts.find({"player_id": player_id}).to_list(1000)
        return [DungeonAttempt(**doc) for doc in attempt_docs]

    # Story operations
    async def get_player_story_chapters(self, player_id: str) -> List[StoryChapter]:
        chapter_docs = await self.story_chapters.find({"player_id": player_id}).sort("chapter_number").to_list(1000)
        return [StoryChapter(**doc) for doc in chapter_docs]

    async def unlock_story_chapter(self, player_id: str, chapter_number: int) -> bool:
        result = await self.story_chapters.update_one(
            {"player_id": player_id, "chapter_number": chapter_number},
            {"$set": {"unlocked": True}}
        )
        return result.modified_count > 0

    async def complete_story_chapter(self, player_id: str, chapter_number: int) -> bool:
        result = await self.story_chapters.update_one(
            {"player_id": player_id, "chapter_number": chapter_number},
            {"$set": {"completed": True}}
        )
        return result.modified_count > 0

    # Initialize game data
    async def initialize_game_data(self):
        # Create default dungeons
        default_dungeons = [
            {
                "name": "Double Dungeon",
                "difficulty": HunterRank.D,
                "recommended_level": 5,
                "monsters": ["Stone Statues", "Stone Soldiers"],
                "rewards": ["System Awakening", "Basic Equipment"],
                "description": "The dungeon where everything changed..."
            },
            {
                "name": "Instant Dungeon",
                "difficulty": HunterRank.C,
                "recommended_level": 15,
                "monsters": ["Goblins", "Hobgoblins", "Goblin Shaman"],
                "rewards": ["Experience Points", "Skill Books"],
                "description": "A mysterious dungeon that appears instantly"
            },
            {
                "name": "Red Gate",
                "difficulty": HunterRank.A,
                "recommended_level": 35,
                "monsters": ["Ice Elves", "Ice Bears", "Ice Monarch"],
                "rewards": ["Ice Crystals", "Cold Resistance Gear"],
                "description": "A dangerous red gate that traps hunters inside"
            },
            {
                "name": "Demon Castle",
                "difficulty": HunterRank.S,
                "recommended_level": 45,
                "monsters": ["Demon Soldiers", "Demon General", "Demon King"],
                "rewards": ["Demon King's Equipment", "Shadow Essence"],
                "description": "The castle of the Demon King, filled with powerful demons"
            }
        ]
        
        for dungeon_data in default_dungeons:
            # Check if dungeon already exists
            existing = await self.dungeons.find_one({"name": dungeon_data["name"]})
            if not existing:
                dungeon = Dungeon(**dungeon_data)
                await self.dungeons.insert_one(dungeon.dict())

database = DatabaseManager()