from typing import Dict, List, Any, Optional
from models import *
from database import database
import random
import math

class GameLogic:
    def __init__(self):
        self.level_exp_requirements = {
            1: 1000,
            2: 2000,
            3: 3500,
            4: 5500,
            5: 8000,
            # Exponential growth
        }
    
    def calculate_level_requirement(self, level: int) -> int:
        """Calculate experience requirement for a given level"""
        if level <= 5:
            return self.level_exp_requirements.get(level, 1000)
        # Exponential formula for higher levels
        return int(1000 * (1.5 ** (level - 1)))
    
    def calculate_level_from_exp(self, total_exp: int) -> int:
        """Calculate level from total experience"""
        level = 1
        while total_exp >= self.calculate_level_requirement(level):
            total_exp -= self.calculate_level_requirement(level)
            level += 1
        return level
    
    def get_stat_bonus_for_level(self, level: int) -> int:
        """Get stat bonus points for leveling up"""
        if level <= 10:
            return 3
        elif level <= 25:
            return 4
        elif level <= 50:
            return 5
        else:
            return 6
    
    def calculate_combat_power(self, player: Player, equipment: List[Equipment]) -> int:
        """Calculate total combat power"""
        base_power = (
            player.stats.strength * 2 +
            player.stats.agility * 1.5 +
            player.stats.intelligence * 1.8 +
            player.stats.vitality * 1.2 +
            player.stats.sense * 1.0
        )
        
        equipment_power = 0
        for item in equipment:
            if item.equipped:
                if item.attack:
                    equipment_power += item.attack
                if item.defense:
                    equipment_power += item.defense * 0.8
        
        return int(base_power + equipment_power)
    
    def calculate_hp_mp(self, player: Player) -> Dict[str, int]:
        """Calculate HP and MP based on stats"""
        base_hp = 100
        base_mp = 50
        
        hp = base_hp + (player.stats.vitality * 20) + (player.level * 10)
        mp = base_mp + (player.stats.intelligence * 15) + (player.level * 5)
        
        return {
            "hp": hp,
            "mp": mp,
            "max_hp": hp,
            "max_mp": mp
        }
    
    def generate_random_equipment(self, player_level: int, rarity: ItemRarity = None) -> Dict[str, Any]:
        """Generate random equipment based on player level"""
        if not rarity:
            rarity_weights = {
                ItemRarity.COMMON: 50,
                ItemRarity.RARE: 30,
                ItemRarity.EPIC: 15,
                ItemRarity.LEGENDARY: 4,
                ItemRarity.MYTHIC: 1
            }
            rarity = random.choices(
                list(rarity_weights.keys()),
                weights=list(rarity_weights.values())
            )[0]
        
        item_types = {
            "weapon": {
                "categories": ["sword", "dagger", "bow", "staff"],
                "names": ["Blade", "Sword", "Dagger", "Bow", "Staff"],
                "stat": "attack"
            },
            "armor": {
                "categories": ["chest", "legs", "helmet", "boots"],
                "names": ["Armor", "Plate", "Helm", "Boots"],
                "stat": "defense"
            },
            "accessory": {
                "categories": ["ring", "necklace", "earring"],
                "names": ["Ring", "Necklace", "Earring"],
                "stat": "effect"
            }
        }
        
        item_type = random.choice(list(item_types.keys()))
        type_data = item_types[item_type]
        category = random.choice(type_data["categories"])
        base_name = random.choice(type_data["names"])
        
        rarity_multipliers = {
            ItemRarity.COMMON: 1.0,
            ItemRarity.RARE: 1.5,
            ItemRarity.EPIC: 2.0,
            ItemRarity.LEGENDARY: 3.0,
            ItemRarity.MYTHIC: 4.0
        }
        
        multiplier = rarity_multipliers[rarity]
        base_value = player_level * 5
        
        equipment_data = {
            "name": f"{rarity.value} {base_name}",
            "type": item_type,
            "category": category,
            "rarity": rarity,
            "durability": 100
        }
        
        if item_type == "weapon":
            equipment_data["attack"] = int(base_value * multiplier * random.uniform(0.8, 1.2))
        elif item_type == "armor":
            equipment_data["defense"] = int(base_value * multiplier * random.uniform(0.8, 1.2))
        else:  # accessory
            effects = [
                f"+{int(10 * multiplier)} HP",
                f"+{int(5 * multiplier)} MP",
                f"+{int(2 * multiplier)} Strength",
                f"+{int(2 * multiplier)} Agility",
                f"+{int(2 * multiplier)} Intelligence"
            ]
            equipment_data["effect"] = random.choice(effects)
        
        return equipment_data
    
    def simulate_dungeon_combat(self, player: Player, dungeon: Dungeon) -> Dict[str, Any]:
        """Simulate dungeon combat and return results"""
        player_power = self.calculate_combat_power(player, [])
        dungeon_difficulty = {
            HunterRank.E: 100,
            HunterRank.D: 300,
            HunterRank.C: 800,
            HunterRank.B: 2000,
            HunterRank.A: 5000,
            HunterRank.S: 12000
        }
        
        required_power = dungeon_difficulty[dungeon.difficulty]
        success_rate = min(player_power / required_power, 1.0)
        
        # Add some randomness
        success_rate *= random.uniform(0.8, 1.2)
        
        success = success_rate >= 0.7
        
        if success:
            # Calculate rewards
            exp_reward = dungeon_difficulty[dungeon.difficulty] // 10
            
            # Chance for equipment drop
            equipment_drop = None
            if random.random() < 0.3:  # 30% chance
                rarity_chances = {
                    ItemRarity.COMMON: 0.4,
                    ItemRarity.RARE: 0.3,
                    ItemRarity.EPIC: 0.2,
                    ItemRarity.LEGENDARY: 0.08,
                    ItemRarity.MYTHIC: 0.02
                }
                rarity = random.choices(
                    list(rarity_chances.keys()),
                    weights=list(rarity_chances.values())
                )[0]
                equipment_drop = self.generate_random_equipment(player.level, rarity)
            
            return {
                "success": True,
                "exp_gained": exp_reward,
                "equipment_drop": equipment_drop,
                "clear_time": random.randint(300, 1800),  # 5-30 minutes
                "damage_taken": random.randint(0, player.hp // 3)
            }
        else:
            return {
                "success": False,
                "exp_gained": dungeon_difficulty[dungeon.difficulty] // 50,  # Small consolation exp
                "equipment_drop": None,
                "clear_time": None,
                "damage_taken": random.randint(player.hp // 3, player.hp - 1)
            }
    
    def calculate_quest_rewards(self, quest: Quest) -> Dict[str, Any]:
        """Calculate rewards for completing a quest"""
        base_exp = {
            QuestType.DAILY: 1000,
            QuestType.WEEKLY: 5000,
            QuestType.MONTHLY: 20000,
            QuestType.STORY: 10000,
            QuestType.SPECIAL: 15000
        }
        
        rewards = {
            "exp": base_exp[quest.type],
            "items": [],
            "stats": {}
        }
        
        # Add random rewards based on quest type
        if quest.type == QuestType.DAILY:
            if random.random() < 0.3:
                rewards["stats"]["strength"] = 1
        elif quest.type == QuestType.WEEKLY:
            if random.random() < 0.5:
                rewards["items"].append("Health Potion")
        elif quest.type == QuestType.STORY:
            rewards["items"].append("Skill Point")
        
        return rewards
    
    def get_rank_from_level(self, level: int) -> HunterRank:
        """Determine hunter rank based on level"""
        if level < 10:
            return HunterRank.E
        elif level < 20:
            return HunterRank.D
        elif level < 30:
            return HunterRank.C
        elif level < 40:
            return HunterRank.B
        elif level < 50:
            return HunterRank.A
        else:
            return HunterRank.S
    
    async def level_up_player(self, player_id: str, exp_gained: int) -> Dict[str, Any]:
        """Level up a player and return level up information"""
        player = await database.get_player(player_id)
        if not player:
            return {"error": "Player not found"}
        
        new_exp = player.experience + exp_gained
        current_level = player.level
        new_level = self.calculate_level_from_exp(new_exp)
        
        level_up_info = {
            "leveled_up": new_level > current_level,
            "old_level": current_level,
            "new_level": new_level,
            "exp_gained": exp_gained,
            "stat_points_gained": 0,
            "new_rank": None
        }
        
        if new_level > current_level:
            # Calculate stat points gained
            stat_points = sum(self.get_stat_bonus_for_level(level) for level in range(current_level + 1, new_level + 1))
            level_up_info["stat_points_gained"] = stat_points
            
            # Check for rank up
            new_rank = self.get_rank_from_level(new_level)
            if new_rank != player.rank:
                level_up_info["new_rank"] = new_rank
            
            # Update player
            hp_mp = self.calculate_hp_mp(Player(
                **player.dict(),
                level=new_level,
                experience=new_exp
            ))
            
            updates = PlayerUpdate(
                level=new_level,
                experience=new_exp,
                experience_to_next=self.calculate_level_requirement(new_level + 1),
                rank=new_rank if new_rank != player.rank else player.rank
            )
            
            await database.update_player(player_id, updates)
        
        return level_up_info

game_logic = GameLogic()