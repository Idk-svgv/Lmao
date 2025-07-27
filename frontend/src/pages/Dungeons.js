import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { mockDungeons } from "../mock/mockData";
import { 
  Mountain, 
  Clock, 
  Users, 
  Trophy, 
  Skull, 
  Star,
  Play,
  Eye,
  Gift
} from "lucide-react";

const Dungeons = () => {
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [inDungeon, setInDungeon] = useState(false);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'E': 'text-gray-400 border-gray-400',
      'D': 'text-green-400 border-green-400',
      'C': 'text-blue-400 border-blue-400',
      'B': 'text-purple-400 border-purple-400',
      'A': 'text-yellow-400 border-yellow-400',
      'S': 'text-red-400 border-red-400'
    };
    return colors[difficulty] || 'text-gray-400 border-gray-400';
  };

  const handleEnterDungeon = (dungeon) => {
    setSelectedDungeon(dungeon);
    setInDungeon(true);
  };

  const DungeonCard = ({ dungeon }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white">{dungeon.name}</CardTitle>
          <Badge variant="outline" className={getDifficultyColor(dungeon.difficulty)}>
            {dungeon.difficulty}-Rank
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>Recommended Level: {dungeon.recommendedLevel}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Monsters:</div>
          <div className="flex flex-wrap gap-1">
            {dungeon.monsters.map((monster, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {monster}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Rewards:</div>
          <div className="flex flex-wrap gap-1">
            {dungeon.rewards.map((reward, index) => (
              <Badge key={index} variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                {reward}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {dungeon.cleared ? 'Cleared' : 'Not cleared'} • {dungeon.attempts} attempts
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedDungeon(dungeon)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => handleEnterDungeon(dungeon)}
            >
              <Play className="w-4 h-4 mr-1" />
              Enter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DungeonDetails = ({ dungeon }) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Mountain className="w-5 h-5 mr-2" />
          {dungeon.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className={getDifficultyColor(dungeon.difficulty)}>
            {dungeon.difficulty}-Rank
          </Badge>
          <Badge variant="outline">
            Level {dungeon.recommendedLevel}
          </Badge>
          <Badge variant={dungeon.cleared ? "default" : "secondary"}>
            {dungeon.cleared ? "Cleared" : "Not Cleared"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Monsters</h4>
            <div className="space-y-1">
              {dungeon.monsters.map((monster, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300">{monster}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Rewards</h4>
            <div className="space-y-1">
              {dungeon.rewards.map((reward, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">Attempts: {dungeon.attempts}</span>
        </div>
        
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => handleEnterDungeon(dungeon)}
        >
          Enter Dungeon
        </Button>
      </CardContent>
    </Card>
  );

  const DungeonInstance = ({ dungeon }) => {
    const [progress, setProgress] = useState(0);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [battleLog, setBattleLog] = useState([
      "Entered the dungeon...",
      "Encountered a group of monsters!",
      "Battle commenced..."
    ]);

    const handleNextFloor = () => {
      setCurrentFloor(prev => prev + 1);
      setProgress(prev => Math.min(prev + 33, 100));
      setBattleLog(prev => [...prev, `Advanced to floor ${currentFloor + 1}`]);
    };

    const handleExitDungeon = () => {
      setInDungeon(false);
      setSelectedDungeon(null);
      setProgress(0);
      setCurrentFloor(1);
    };

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {dungeon.name} - Floor {currentFloor}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 h-32 overflow-y-auto">
            <div className="text-sm text-gray-300 space-y-1">
              {battleLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleNextFloor}
              disabled={progress >= 100}
            >
              Next Floor
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleExitDungeon}
            >
              Exit Dungeon
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dungeons</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Available: {mockDungeons.length}
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Cleared: {mockDungeons.filter(d => d.cleared).length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dungeon List */}
        <div className="lg:col-span-2 space-y-4">
          {mockDungeons.map((dungeon) => (
            <DungeonCard key={dungeon.id} dungeon={dungeon} />
          ))}
        </div>

        {/* Dungeon Details or Instance */}
        <div className="lg:col-span-1">
          {inDungeon && selectedDungeon ? (
            <DungeonInstance dungeon={selectedDungeon} />
          ) : selectedDungeon ? (
            <DungeonDetails dungeon={selectedDungeon} />
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a dungeon to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dungeons;