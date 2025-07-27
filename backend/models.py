from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class HunterRank(str, Enum):
    E = "E"
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"

class ItemRarity(str, Enum):
    COMMON = "Common"
    RARE = "Rare"
    EPIC = "Epic"
    LEGENDARY = "Legendary"
    MYTHIC = "Mythic"

class QuestType(str, Enum):
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"
    STORY = "Story"
    SPECIAL = "Special"

class Stats(BaseModel):
    strength: int = 10
    agility: int = 10
    intelligence: int = 10
    vitality: int = 10
    sense: int = 10

class Guild(BaseModel):
    name: str
    position: str
    members: int

class ShadowArmy(BaseModel):
    capacity: int = 10
    current: int = 0
    shadows: List[str] = []

class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int = 1
    rank: HunterRank = HunterRank.E
    title: str = "Weakest Hunter"
    experience: int = 0
    experience_to_next: int = 1000
    stats: Stats = Stats()
    hp: int = 100
    max_hp: int = 100
    mp: int = 50
    max_mp: int = 50
    shadow_army: ShadowArmy = ShadowArmy()
    guild: Guild = Guild(name="No Guild", position="None", members=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Equipment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # weapon, armor, accessory
    category: str  # sword, chest, ring, etc.
    rarity: ItemRarity
    attack: Optional[int] = None
    defense: Optional[int] = None
    effect: Optional[str] = None
    durability: int = 100
    equipped: bool = False
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Consumable(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # potion, scroll, etc.
    effect: str
    quantity: int = 1
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Shadow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # Knight, Warrior, etc.
    level: int = 1
    rarity: ItemRarity
    stats: Dict[str, int] = {
        "attack": 100,
        "defense": 100,
        "hp": 1000,
        "mp": 500
    }
    skills: List[str] = []
    loyalty: int = 50
    experience: int = 0
    max_experience: int = 1000
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Skill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int = 1
    max_level: int = 5
    description: str
    unlocked: bool = False
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Quest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: QuestType
    progress: int = 0
    target: int = 1
    reward: str
    completed: bool = False
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Dungeon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    difficulty: HunterRank
    recommended_level: int
    monsters: List[str]
    rewards: List[str]
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DungeonAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    dungeon_id: str
    cleared: bool = False
    clear_time: Optional[int] = None  # in seconds
    rewards_gained: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StoryChapter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    chapter_number: int
    title: str
    description: str
    content: List[Dict[str, Any]]  # story pages with text and choices
    unlocked: bool = False
    completed: bool = False
    player_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GuildMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    guild_name: str
    position: str = "Member"
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class Ranking(BaseModel):
    player_id: str
    player_name: str
    level: int
    rank: HunterRank
    guild_name: str
    total_power: int
    position: int
    category: str  # hunter, guild, dungeon

# Create models for API requests
class PlayerCreate(BaseModel):
    name: str

class PlayerUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    rank: Optional[HunterRank] = None
    title: Optional[str] = None
    experience: Optional[int] = None
    stats: Optional[Stats] = None

class EquipmentCreate(BaseModel):
    name: str
    type: str
    category: str
    rarity: ItemRarity
    attack: Optional[int] = None
    defense: Optional[int] = None
    effect: Optional[str] = None

class QuestCreate(BaseModel):
    title: str
    description: str
    type: QuestType
    target: int
    reward: str

class QuestUpdate(BaseModel):
    progress: Optional[int] = None
    completed: Optional[bool] = None

class ShadowCreate(BaseModel):
    name: str
    type: str
    rarity: ItemRarity
    stats: Optional[Dict[str, int]] = None
    skills: Optional[List[str]] = None

class StoryChapterCreate(BaseModel):
    chapter_number: int
    title: str
    description: str
    content: List[Dict[str, Any]]