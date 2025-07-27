import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../context/AuthContext";
import { getRarityColor, getRarityGlow } from "../mock/mockData";
import { 
  Crown, 
  Sword, 
  Shield, 
  Zap, 
  Users, 
  Plus,
  Star,
  Target,
  Settings
} from "lucide-react";

const ShadowArmy = () => {
  const { player } = useAuth();
  const [selectedShadow, setSelectedShadow] = useState(null);
  const [armyFormation, setArmyFormation] = useState("offensive");

  const mockShadows = [
    { 
      id: "shadow_1", 
      name: "Igris", 
      type: "Knight", 
      level: 45, 
      rarity: "Mythic",
      stats: { attack: 890, defense: 650, hp: 3200, mp: 800 },
      skills: ["Flame Slash", "Shield Bash", "Intimidation"],
      loyalty: 100,
      experience: 45670,
      maxExperience: 50000
    },
    { 
      id: "shadow_2", 
      name: "Iron", 
      type: "Warrior", 
      level: 42, 
      rarity: "Legendary",
      stats: { attack: 720, defense: 580, hp: 2800, mp: 600 },
      skills: ["Berserker Rage", "Whirlwind", "Block"],
      loyalty: 95,
      experience: 42100,
      maxExperience: 45000
    },
    { 
      id: "shadow_3", 
      name: "Tank", 
      type: "Shield Bearer", 
      level: 38, 
      rarity: "Epic",
      stats: { attack: 450, defense: 890, hp: 4200, mp: 400 },
      skills: ["Taunt", "Shield Wall", "Protect"],
      loyalty: 88,
      experience: 38200,
      maxExperience: 42000
    },
    { 
      id: "shadow_4", 
      name: "Kaisel", 
      type: "Dragon", 
      level: 50, 
      rarity: "Mythic",
      stats: { attack: 1200, defense: 800, hp: 5000, mp: 1500 },
      skills: ["Dragon's Breath", "Flight", "Roar"],
      loyalty: 100,
      experience: 50000,
      maxExperience: 55000
    }
  ];

  const formations = [
    { id: "offensive", name: "Offensive", description: "Maximize damage output" },
    { id: "defensive", name: "Defensive", description: "Focus on protection" },
    { id: "balanced", name: "Balanced", description: "Equal offense and defense" }
  ];

  const ShadowCard = ({ shadow }) => (
    <Card 
      className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer ${getRarityGlow(shadow.rarity)}`}
      onClick={() => setSelectedShadow(shadow)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className={`text-white ${getRarityColor(shadow.rarity)}`}>
            {shadow.name}
          </CardTitle>
          <Badge variant="outline" className={getRarityColor(shadow.rarity)}>
            {shadow.rarity}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{shadow.type}</Badge>
          <Badge variant="outline">Level {shadow.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">ATK</span>
            <span className="text-red-400">{shadow.stats.attack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">DEF</span>
            <span className="text-blue-400">{shadow.stats.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">HP</span>
            <span className="text-green-400">{shadow.stats.hp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">MP</span>
            <span className="text-purple-400">{shadow.stats.mp}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Loyalty</span>
            <span className="text-yellow-400">{shadow.loyalty}%</span>
          </div>
          <Progress value={shadow.loyalty} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Experience</span>
            <span className="text-gray-300">{shadow.experience}/{shadow.maxExperience}</span>
          </div>
          <Progress value={(shadow.experience / shadow.maxExperience) * 100} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );

  const ShadowDetails = ({ shadow }) => (
    <Card className="bg-gray-800 border-gray-700 sticky top-0">
      <CardHeader>
        <CardTitle className={`text-white ${getRarityColor(shadow.rarity)}`}>
          {shadow.name}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{shadow.type}</Badge>
          <Badge variant="outline">Level {shadow.level}</Badge>
          <Badge variant="outline" className={getRarityColor(shadow.rarity)}>
            {shadow.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Combat Stats</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Attack</span>
                <span className="text-red-400">{shadow.stats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense</span>
                <span className="text-blue-400">{shadow.stats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health</span>
                <span className="text-green-400">{shadow.stats.hp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mana</span>
                <span className="text-purple-400">{shadow.stats.mp}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Progress</h4>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Loyalty</span>
                  <span className="text-yellow-400">{shadow.loyalty}%</span>
                </div>
                <Progress value={shadow.loyalty} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-gray-300">{Math.round((shadow.experience / shadow.maxExperience) * 100)}%</span>
                </div>
                <Progress value={(shadow.experience / shadow.maxExperience) * 100} className="h-1" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {shadow.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Star className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
          <Button variant="outline" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shadow Army</h1>
            <p className="text-purple-200">Command your eternal soldiers</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {player.shadowArmy.current}/{player.shadowArmy.capacity}
            </div>
            <div className="text-purple-200">Soldiers</div>
          </div>
        </div>
      </div>

      {/* Army Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Total Shadows</div>
                <div className="text-xl font-bold text-white">{mockShadows.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sword className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm text-gray-400">Total Attack</div>
                <div className="text-xl font-bold text-white">
                  {mockShadows.reduce((sum, shadow) => sum + shadow.stats.attack, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Total Defense</div>
                <div className="text-xl font-bold text-white">
                  {mockShadows.reduce((sum, shadow) => sum + shadow.stats.defense, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Avg Level</div>
                <div className="text-xl font-bold text-white">
                  {Math.round(mockShadows.reduce((sum, shadow) => sum + shadow.level, 0) / mockShadows.length)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formation Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Army Formation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formations.map((formation) => (
              <Button
                key={formation.id}
                variant={armyFormation === formation.id ? "default" : "outline"}
                className={`p-4 h-auto flex-col space-y-2 ${
                  armyFormation === formation.id ? "bg-purple-600" : ""
                }`}
                onClick={() => setArmyFormation(formation.id)}
              >
                <div className="font-semibold">{formation.name}</div>
                <div className="text-xs text-gray-400">{formation.description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadow Army Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockShadows.map((shadow) => (
              <ShadowCard key={shadow.id} shadow={shadow} />
            ))}
            
            {/* Add Shadow Slot */}
            <Card className="bg-gray-800 border-gray-700 border-dashed hover:border-purple-500 transition-all cursor-pointer">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Extract New Shadow</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shadow Details */}
        <div className="lg:col-span-1">
          {selectedShadow ? (
            <ShadowDetails shadow={selectedShadow} />
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a shadow to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShadowArmy;