// Mock data for Solo Leveling game
export const mockPlayer = {
  id: "player_1",
  name: "Sung Jin-Woo",
  level: 47,
  rank: "S",
  title: "Shadow Monarch",
  experience: 89750,
  experienceToNext: 95000,
  stats: {
    strength: 156,
    agility: 142,
    intelligence: 98,
    vitality: 134,
    sense: 87
  },
  hp: 2680,
  maxHp: 2680,
  mp: 980,
  maxMp: 980,
  shadowArmy: {
    capacity: 50,
    current: 23,
    shadows: [
      { id: "shadow_1", name: "Igris", type: "Knight", level: 45, rarity: "Mythic" },
      { id: "shadow_2", name: "Iron", type: "Warrior", level: 42, rarity: "Legendary" },
      { id: "shadow_3", name: "Tank", type: "Shield Bearer", level: 38, rarity: "Epic" }
    ]
  },
  guild: {
    name: "Ahjin Guild",
    position: "Guild Master",
    members: 15
  }
};

export const mockInventory = {
  weapons: [
    { id: "weapon_1", name: "Demon King's Dagger", type: "Dagger", rarity: "Mythic", attack: 450, durability: 100, equipped: true },
    { id: "weapon_2", name: "Knight Killer", type: "Sword", rarity: "Legendary", attack: 320, durability: 85, equipped: false },
    { id: "weapon_3", name: "Shadow Blade", type: "Sword", rarity: "Epic", attack: 280, durability: 92, equipped: false }
  ],
  armor: [
    { id: "armor_1", name: "Demon King's Armor", type: "Chest", rarity: "Mythic", defense: 380, durability: 100, equipped: true },
    { id: "armor_2", name: "Knight's Plate", type: "Chest", rarity: "Legendary", defense: 250, durability: 78, equipped: false },
    { id: "armor_3", name: "Shadow Cloak", type: "Chest", rarity: "Epic", defense: 180, durability: 95, equipped: false }
  ],
  accessories: [
    { id: "acc_1", name: "Ring of Vitality", type: "Ring", rarity: "Epic", effect: "+50 HP", equipped: true },
    { id: "acc_2", name: "Stealth Necklace", type: "Necklace", rarity: "Rare", effect: "+10 Agility", equipped: false }
  ],
  consumables: [
    { id: "cons_1", name: "Health Potion", type: "Potion", quantity: 15, effect: "Restore 500 HP" },
    { id: "cons_2", name: "Mana Potion", type: "Potion", quantity: 8, effect: "Restore 200 MP" }
  ]
};

export const mockSkills = [
  { id: "skill_1", name: "Shadow Extraction", level: 5, maxLevel: 5, description: "Extract shadows from defeated enemies", unlocked: true },
  { id: "skill_2", name: "Shadow Exchange", level: 3, maxLevel: 5, description: "Switch positions with shadows", unlocked: true },
  { id: "skill_3", name: "Shadow Storage", level: 4, maxLevel: 5, description: "Store items in shadow dimension", unlocked: true },
  { id: "skill_4", name: "Ruler's Authority", level: 2, maxLevel: 5, description: "Telekinetic control over objects", unlocked: true },
  { id: "skill_5", name: "Dragon's Fear", level: 1, maxLevel: 5, description: "Intimidate enemies with killing intent", unlocked: false }
];

export const mockDungeons = [
  { 
    id: "dungeon_1", 
    name: "Demon Castle", 
    difficulty: "S", 
    recommendedLevel: 45, 
    monsters: ["Demon Soldiers", "Demon General", "Demon King"],
    rewards: ["Demon King's Equipment", "Shadow Essence", "Experience"],
    cleared: true,
    attempts: 3
  },
  { 
    id: "dungeon_2", 
    name: "Red Gate", 
    difficulty: "A", 
    recommendedLevel: 38, 
    monsters: ["Ice Elves", "Ice Bears", "Ice Monarch"],
    rewards: ["Ice Crystals", "Cold Resistance Gear", "Experience"],
    cleared: true,
    attempts: 2
  },
  { 
    id: "dungeon_3", 
    name: "Jeju Island", 
    difficulty: "S", 
    recommendedLevel: 50, 
    monsters: ["Ant Soldiers", "Ant Queen", "Ant King"],
    rewards: ["Ant King's Equipment", "Rare Materials", "Experience"],
    cleared: false,
    attempts: 0
  }
];

export const mockQuests = [
  {
    id: "quest_1",
    title: "Daily Training",
    description: "Complete 100 push-ups, 100 sit-ups, and 10km run",
    type: "Daily",
    progress: 2,
    target: 3,
    reward: "1000 XP, +2 Strength",
    completed: false
  },
  {
    id: "quest_2",
    title: "Dungeon Clear",
    description: "Clear 5 dungeons",
    type: "Weekly",
    progress: 3,
    target: 5,
    reward: "5000 XP, Random Equipment",
    completed: false
  },
  {
    id: "quest_3",
    title: "Shadow Collection",
    description: "Extract 10 new shadows",
    type: "Story",
    progress: 7,
    target: 10,
    reward: "Shadow Army Expansion",
    completed: false
  }
];

export const mockRankings = [
  { rank: 1, name: "Sung Jin-Woo", level: 47, guild: "Ahjin Guild", hunterRank: "S" },
  { rank: 2, name: "Cha Hae-In", level: 45, guild: "Hunters Guild", hunterRank: "S" },
  { rank: 3, name: "Baek Yoon-Ho", level: 43, guild: "White Tiger Guild", hunterRank: "S" },
  { rank: 4, name: "Choi Jong-In", level: 42, guild: "Hunters Guild", hunterRank: "S" },
  { rank: 5, name: "Ma Dong-Wook", level: 41, guild: "Hunters Guild", hunterRank: "S" }
];

export const mockGuildMembers = [
  { id: "member_1", name: "Sung Jin-Woo", level: 47, rank: "S", position: "Guild Master", online: true },
  { id: "member_2", name: "Yoo Jin-Ho", level: 25, rank: "D", position: "Vice Master", online: true },
  { id: "member_3", name: "Park Hee-Jin", level: 28, rank: "C", position: "Member", online: false },
  { id: "member_4", name: "Kim Sang-Shik", level: 32, rank: "B", position: "Member", online: true }
];

export const mockStoryChapters = [
  { 
    id: "chapter_1", 
    title: "The Weakest Hunter", 
    description: "Begin your journey as the weakest E-rank hunter",
    completed: true,
    unlocked: true
  },
  { 
    id: "chapter_2", 
    title: "The System", 
    description: "Discover the mysterious leveling system",
    completed: true,
    unlocked: true
  },
  { 
    id: "chapter_3", 
    title: "First Dungeon", 
    description: "Enter your first dungeon with newfound power",
    completed: true,
    unlocked: true
  },
  { 
    id: "chapter_4", 
    title: "The Shadow Army", 
    description: "Unlock the power to extract shadows",
    completed: true,
    unlocked: true
  },
  { 
    id: "chapter_5", 
    title: "Red Gate", 
    description: "Survive the dangerous red gate dungeon",
    completed: false,
    unlocked: true
  },
  { 
    id: "chapter_6", 
    title: "Demon Castle", 
    description: "Face the Demon King and claim his throne",
    completed: false,
    unlocked: false
  }
];

export const getRarityColor = (rarity) => {
  const colors = {
    Common: "text-gray-400",
    Rare: "text-blue-400",
    Epic: "text-purple-400",
    Legendary: "text-yellow-400",
    Mythic: "text-red-400"
  };
  return colors[rarity] || "text-gray-400";
};

export const getRarityGlow = (rarity) => {
  const glows = {
    Common: "shadow-gray-500/50",
    Rare: "shadow-blue-500/50",
    Epic: "shadow-purple-500/50",
    Legendary: "shadow-yellow-500/50",
    Mythic: "shadow-red-500/50"
  };
  return glows[rarity] || "shadow-gray-500/50";
};