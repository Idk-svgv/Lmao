import React from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { mockQuests, mockDungeons, mockInventory } from "../mock/mockData";
import { 
  Sword, 
  Shield, 
  Crown, 
  Users, 
  Target, 
  Mountain,
  TrendingUp,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { player } = useAuth();
  
  const recentQuests = mockQuests.slice(0, 3);
  const recentDungeons = mockDungeons.slice(0, 3);
  const equippedWeapon = mockInventory.weapons.find(w => w.equipped);
  const equippedArmor = mockInventory.armor.find(a => a.equipped);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {player.name}</h1>
            <p className="text-xl text-purple-200">{player.title}</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {player.rank}-Rank Hunter
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Level {player.level}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Shadow Army</div>
            <div className="text-lg">{player.shadowArmy.current}/{player.shadowArmy.capacity}</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Strength</CardTitle>
            <Sword className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{player.stats.strength}</div>
            <p className="text-xs text-green-400">+12 from last level</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Agility</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{player.stats.agility}</div>
            <p className="text-xs text-green-400">+8 from last level</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Intelligence</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{player.stats.intelligence}</div>
            <p className="text-xs text-green-400">+5 from last level</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vitality</CardTitle>
            <Crown className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{player.stats.vitality}</div>
            <p className="text-xs text-green-400">+10 from last level</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quests */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-400" />
              Active Quests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQuests.map((quest) => (
              <div key={quest.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-white">{quest.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {quest.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{quest.description}</p>
                <div className="flex items-center space-x-2">
                  <Progress value={(quest.progress / quest.target) * 100} className="flex-1" />
                  <span className="text-xs text-gray-400">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Dungeons */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mountain className="w-5 h-5 mr-2 text-blue-400" />
              Available Dungeons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDungeons.map((dungeon) => (
              <div key={dungeon.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-white">{dungeon.name}</h4>
                  <Badge variant="outline" className={`text-xs ${
                    dungeon.difficulty === 'S' ? 'text-red-400 border-red-400' :
                    dungeon.difficulty === 'A' ? 'text-yellow-400 border-yellow-400' :
                    'text-green-400 border-green-400'
                  }`}>
                    {dungeon.difficulty}-Rank
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">Level {dungeon.recommendedLevel} recommended</p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {dungeon.cleared ? 'Cleared' : 'Not cleared'} • {dungeon.attempts} attempts
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipment Summary */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sword className="w-5 h-5 mr-2 text-yellow-400" />
              Current Equipment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">Weapon</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${equippedWeapon?.rarity === 'Mythic' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {equippedWeapon?.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  ATK {equippedWeapon?.attack}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Armor</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${equippedArmor?.rarity === 'Mythic' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {equippedArmor?.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  DEF {equippedArmor?.defense}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-white">Guild</h4>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{player.guild.name}</span>
                <Badge variant="outline" className="text-xs">
                  {player.guild.position}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;