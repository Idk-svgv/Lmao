import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockSkills } from "../mock/mockData";
import { 
  User, 
  Star, 
  Zap, 
  Shield, 
  Heart, 
  Brain, 
  Eye,
  TrendingUp,
  Crown,
  Plus
} from "lucide-react";

const Character = () => {
  const { player, updateStats, gainExperience } = useAuth();
  const [availableStatPoints, setAvailableStatPoints] = useState(15);

  const handleStatIncrease = (stat) => {
    if (availableStatPoints > 0) {
      updateStats({ [stat]: player.stats[stat] + 1 });
      setAvailableStatPoints(prev => prev - 1);
    }
  };

  const StatBar = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
      <Icon className={`w-6 h-6 ${color}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-medium">{label}</span>
          <span className="text-xl font-bold text-white">{value}</span>
        </div>
        <Progress value={Math.min((value / 200) * 100, 100)} className="h-2" />
      </div>
      <Button 
        size="sm" 
        onClick={() => handleStatIncrease(label.toLowerCase())}
        disabled={availableStatPoints <= 0}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Character Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
            <p className="text-xl text-purple-200">{player.title}</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {player.rank}-Rank Hunter
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Level {player.level}
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {player.guild.position}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          {/* Stat Points */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Available Stat Points: {availableStatPoints}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Primary Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatBar 
                  label="Strength" 
                  value={player.stats.strength} 
                  icon={Zap} 
                  color="text-red-400" 
                />
                <StatBar 
                  label="Agility" 
                  value={player.stats.agility} 
                  icon={TrendingUp} 
                  color="text-blue-400" 
                />
                <StatBar 
                  label="Intelligence" 
                  value={player.stats.intelligence} 
                  icon={Brain} 
                  color="text-purple-400" 
                />
                <StatBar 
                  label="Vitality" 
                  value={player.stats.vitality} 
                  icon={Heart} 
                  color="text-green-400" 
                />
                <StatBar 
                  label="Sense" 
                  value={player.stats.sense} 
                  icon={Eye} 
                  color="text-yellow-400" 
                />
              </CardContent>
            </Card>

            {/* Derived Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Combat Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                  <span className="text-gray-300">Health Points</span>
                  <span className="text-red-400 font-bold">{player.hp}/{player.maxHp}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                  <span className="text-gray-300">Mana Points</span>
                  <span className="text-blue-400 font-bold">{player.mp}/{player.maxMp}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                  <span className="text-gray-300">Attack Power</span>
                  <span className="text-red-400 font-bold">{player.stats.strength * 2.5}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                  <span className="text-gray-300">Defense</span>
                  <span className="text-blue-400 font-bold">{player.stats.vitality * 2}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                  <span className="text-gray-300">Magic Power</span>
                  <span className="text-purple-400 font-bold">{player.stats.intelligence * 3}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-purple-400" />
                Shadow Monarch Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSkills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-gray-900 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-semibold">{skill.name}</h3>
                      <Badge variant={skill.unlocked ? "default" : "secondary"}>
                        {skill.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Level</span>
                      <Progress value={(skill.level / skill.maxLevel) * 100} className="flex-1" />
                      <span className="text-xs text-gray-400">
                        {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abilities" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                Special Abilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Shadow Monarch</h3>
                  <p className="text-gray-300 text-sm">
                    Supreme ruler of all shadows. Can extract, store, and command shadow soldiers.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-900 to-orange-900 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Ruler's Authority</h3>
                  <p className="text-gray-300 text-sm">
                    Telekinetic control over objects and enemies. Can crush, lift, and manipulate matter.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-900 to-teal-900 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Stealth</h3>
                  <p className="text-gray-300 text-sm">
                    Become invisible to enemies for a short duration. Perfect for assassination.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Bloodlust</h3>
                  <p className="text-gray-300 text-sm">
                    Intimidate enemies with overwhelming killing intent. Can paralyze weaker foes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Character;