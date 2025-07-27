import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockRankings } from "../mock/mockData";
import { 
  Trophy, 
  Crown, 
  Star, 
  Users, 
  Zap,
  Target,
  Medal
} from "lucide-react";

const Rankings = () => {
  const [selectedCategory, setSelectedCategory] = useState("hunters");

  const getRankColor = (rank) => {
    const colors = {
      'E': 'text-gray-400 border-gray-400',
      'D': 'text-green-400 border-green-400',
      'C': 'text-blue-400 border-blue-400',
      'B': 'text-purple-400 border-purple-400',
      'A': 'text-yellow-400 border-yellow-400',
      'S': 'text-red-400 border-red-400'
    };
    return colors[rank] || 'text-gray-400 border-gray-400';
  };

  const getRankIcon = (position) => {
    if (position === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (position === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{position}</span>;
  };

  const RankingCard = ({ player, position }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12">
            {getRankIcon(position)}
          </div>
          
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{player.name}</h3>
              {position <= 3 && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Top {position}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className={getRankColor(player.hunterRank)}>
                {player.hunterRank}-Rank
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Level {player.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {player.guild}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">#{position}</div>
            <div className="text-sm text-gray-400">Rank</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const mockGuildRankings = [
    { rank: 1, name: "Ahjin Guild", members: 15, averageLevel: 42, totalPower: 15420 },
    { rank: 2, name: "Hunters Guild", members: 45, averageLevel: 38, totalPower: 14800 },
    { rank: 3, name: "White Tiger Guild", members: 32, averageLevel: 36, totalPower: 13600 },
    { rank: 4, name: "Fiend Guild", members: 28, averageLevel: 34, totalPower: 12100 },
    { rank: 5, name: "Knights Guild", members: 38, averageLevel: 33, totalPower: 11900 }
  ];

  const mockDungeonRankings = [
    { rank: 1, name: "Sung Jin-Woo", dungeon: "Demon Castle", clearTime: "12:34", difficulty: "S" },
    { rank: 2, name: "Cha Hae-In", dungeon: "Red Gate", clearTime: "15:22", difficulty: "A" },
    { rank: 3, name: "Baek Yoon-Ho", dungeon: "Ice Cave", clearTime: "18:45", difficulty: "A" },
    { rank: 4, name: "Choi Jong-In", dungeon: "Fire Temple", clearTime: "21:12", difficulty: "B" },
    { rank: 5, name: "Ma Dong-Wook", dungeon: "Shadow Realm", clearTime: "23:56", difficulty: "B" }
  ];

  const GuildRankingCard = ({ guild, position }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12">
            {getRankIcon(position)}
          </div>
          
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{guild.name}</h3>
              {position <= 3 && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Top {position}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {guild.members} Members
              </Badge>
              <Badge variant="outline" className="text-xs">
                Avg Lv {guild.averageLevel}
              </Badge>
              <Badge variant="outline" className="text-xs text-purple-400">
                {guild.totalPower} Power
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">#{position}</div>
            <div className="text-sm text-gray-400">Guild Rank</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DungeonRankingCard = ({ record, position }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12">
            {getRankIcon(position)}
          </div>
          
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{record.name}</h3>
              {position <= 3 && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Top {position}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {record.dungeon}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getRankColor(record.difficulty)}`}>
                {record.difficulty}-Rank
              </Badge>
              <Badge variant="outline" className="text-xs text-green-400">
                {record.clearTime}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">#{position}</div>
            <div className="text-sm text-gray-400">Speed Run</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Rankings</h1>
            <p className="text-xl text-purple-200">Compete with hunters worldwide</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Your Rank</div>
            <div className="text-4xl font-bold">#1</div>
          </div>
        </div>
      </div>

      {/* Ranking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Hunter Rank</div>
                <div className="text-xl font-bold text-white">#1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Guild Rank</div>
                <div className="text-xl font-bold text-white">#1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Dungeon Clears</div>
                <div className="text-xl font-bold text-white">47</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Total Power</div>
                <div className="text-xl font-bold text-white">9,847</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Tabs */}
      <Tabs defaultValue="hunters" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hunters">Hunter Rankings</TabsTrigger>
          <TabsTrigger value="guilds">Guild Rankings</TabsTrigger>
          <TabsTrigger value="dungeons">Dungeon Records</TabsTrigger>
        </TabsList>

        <TabsContent value="hunters" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Top Hunters</h2>
          </div>
          
          <div className="space-y-4">
            {mockRankings.map((player, index) => (
              <RankingCard key={index} player={player} position={player.rank} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guilds" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Top Guilds</h2>
          </div>
          
          <div className="space-y-4">
            {mockGuildRankings.map((guild, index) => (
              <GuildRankingCard key={index} guild={guild} position={guild.rank} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dungeons" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Dungeon Speed Records</h2>
          </div>
          
          <div className="space-y-4">
            {mockDungeonRankings.map((record, index) => (
              <DungeonRankingCard key={index} record={record} position={record.rank} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;