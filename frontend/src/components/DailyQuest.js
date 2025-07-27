import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { dailyQuestAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Timer,
  Zap, 
  Skull, 
  Trophy, 
  Target,
  Flame,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

const DailyQuest = () => {
  const { player } = useAuth();
  const [questData, setQuestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [penaltyZone, setPenaltyZone] = useState(null);
  const [penaltySession, setPenaltySession] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  // Load daily quest data
  useEffect(() => {
    loadDailyQuest();
  }, [player]);

  // Easter egg messages for different progress states
  const getProgressMessage = (progress) => {
    if (progress === 0) return "🌅 'A new day, a new chance to grow stronger!' - Jin-Woo";
    if (progress < 30) return "💪 'Every rep makes you stronger than yesterday!'";
    if (progress < 60) return "🔥 'The System acknowledges your dedication...'";
    if (progress < 90) return "⚡ 'You're almost there! Feel the power flowing!'";
    if (progress < 100) return "👑 'The Shadow Monarch's power awakens within you!'";
    return "🌟 'QUEST COMPLETE! You've transcended your limits!'";
  };

  const loadDailyQuest = async () => {
    try {
      setLoading(true);
      const data = await dailyQuestAPI.getDailyQuest(player.id);
      setQuestData(data);
      setMotivationalMessage(data.motivational_message || getProgressMessage(0));
    } catch (error) {
      console.error("Failed to load daily quest:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (type, value) => {
    try {
      setUpdating(true);
      const updateData = { [type]: value };
      const updatedQuest = await dailyQuestAPI.updateDailyQuest(player.id, updateData);
      
      setQuestData(updatedQuest);
      setMotivationalMessage(updatedQuest.motivational_message || getProgressMessage(calculateProgress()));
      
      // Show completion celebration
      if (updatedQuest.completed) {
        setTimeout(() => {
          alert("🎉 DAILY QUEST COMPLETED! 🎉\n\n✨ Rewards Gained:\n• 1000 XP\n• +2 Strength\n• +1 Vitality\n• +1 Agility\n\n👑 The System is pleased with your progress!");
        }, 500);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  const enterPenaltyZone = async () => {
    try {
      const penaltyData = await dailyQuestAPI.enterPenaltyZone(player.id);
      setPenaltyZone(penaltyData);
      setPenaltySession(penaltyData.session_id);
      
      // Start penalty zone status updates
      const interval = setInterval(async () => {
        try {
          const status = await dailyQuestAPI.getPenaltyZoneStatus(player.id, penaltyData.session_id);
          setPenaltyZone(status);
          
          if (status.status === "ESCAPED") {
            clearInterval(interval);
            setTimeout(() => {
              alert("🎉 You survived the Penalty Zone! 🎉\n\n💀 The giant centipedes couldn't catch you!\n⚡ You've gained mental fortitude from this ordeal!");
              setPenaltyZone(null);
              setPenaltySession(null);
            }, 1000);
          }
        } catch (error) {
          console.error("Failed to get penalty zone status:", error);
          clearInterval(interval);
        }
      }, 5000); // Update every 5 seconds
      
    } catch (error) {
      console.error("Failed to enter penalty zone:", error);
    }
  };

  const calculateProgress = () => {
    if (!questData) return 0;
    const { pushups = 0, situps = 0, running_km = 0 } = questData;
    const totalProgress = (pushups / 100) * 33.33 + (situps / 100) * 33.33 + (running_km / 10) * 33.34;
    return Math.min(100, totalProgress);
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading today's training...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Penalty Zone Interface
  if (penaltyZone) {
    return (
      <Card className="bg-gradient-to-br from-red-900 to-orange-900 border-red-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Skull className="w-6 h-6 mr-2 text-red-400" />
            ⚠️ PENALTY ZONE ⚠️
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Endless Desert of Giant Centipedes</h3>
            <p className="text-red-200">{penaltyZone.description || "Survive the nightmare..."}</p>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-200">Survival Progress</span>
              <span className="text-white">{penaltyZone.progress_percent?.toFixed(1) || 0}%</span>
            </div>
            <Progress 
              value={penaltyZone.progress_percent || 0} 
              className="h-3 bg-red-900"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-red-300">
                Time Remaining: {Math.floor((penaltyZone.remaining_minutes || 0) / 60)}h {(penaltyZone.remaining_minutes || 0) % 60}m
              </span>
              <span className="text-red-300">
                Status: {penaltyZone.status || "SURVIVING"}
              </span>
            </div>
          </div>
          
          <Alert className="bg-red-900/50 border-red-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {penaltyZone.encounter_message || "The sand shifts beneath your feet..."}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">{penaltyZone.centipedes_encountered || 0}</div>
              <div className="text-red-200 text-sm">Centipedes Faced</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-400">{penaltyZone.damage_taken || 0}</div>
              <div className="text-red-200 text-sm">Damage Taken</div>
            </div>
          </div>
          
          {penaltyZone.easter_egg && (
            <div className="text-center text-yellow-300 text-sm italic">
              🥚 {penaltyZone.easter_egg}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const progress = calculateProgress();
  const isCompleted = questData?.completed || false;
  const canEnterPenaltyZone = !isCompleted && questData?.failed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3" />
              Daily Quest: Preparation for Becoming Strong
            </h1>
            <p className="text-purple-200">Complete your training or face the consequences...</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Progress</div>
            <div className="text-4xl font-bold">{progress.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {!isCompleted && (
        <Alert className="bg-red-900/20 border-red-600">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-red-200">
            ⚠️ {questData?.penalty_warning || "Failure to complete within 24 hours will result in punishment!"}
          </AlertDescription>
        </Alert>
      )}

      {/* Quest Progress */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <Flame className="w-5 h-5 mr-2 text-orange-400" />
              Training Progress
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Time Left: {questData?.time_remaining || "23:45:30"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Overall Progress</span>
              <span className="text-white font-bold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            {isCompleted && (
              <div className="flex items-center justify-center mt-2">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 font-bold">QUEST COMPLETED! 🎉</span>
              </div>
            )}
          </div>

          {/* Individual Exercises */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Push-ups */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">💪 Push-ups</h3>
                <Badge variant={questData?.pushups >= 100 ? "default" : "secondary"}>
                  {questData?.pushups || 0}/100
                </Badge>
              </div>
              <Progress value={(questData?.pushups || 0)} className="h-2 mb-3" />
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('pushups', Math.min((questData?.pushups || 0) + 10, 100))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +10
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('pushups', Math.min((questData?.pushups || 0) + 25, 100))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +25
                </Button>
              </div>
            </div>

            {/* Sit-ups */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">🏃 Sit-ups</h3>
                <Badge variant={questData?.situps >= 100 ? "default" : "secondary"}>
                  {questData?.situps || 0}/100
                </Badge>
              </div>
              <Progress value={(questData?.situps || 0)} className="h-2 mb-3" />
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('situps', Math.min((questData?.situps || 0) + 10, 100))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +10
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('situps', Math.min((questData?.situps || 0) + 25, 100))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +25
                </Button>
              </div>
            </div>

            {/* Running */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">🏃‍♂️ Running</h3>
                <Badge variant={questData?.running_km >= 10 ? "default" : "secondary"}>
                  {questData?.running_km || 0}/10 km
                </Badge>
              </div>
              <Progress value={(questData?.running_km || 0) * 10} className="h-2 mb-3" />
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('running_km', Math.min((questData?.running_km || 0) + 1, 10))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +1km
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => updateProgress('running_km', Math.min((questData?.running_km || 0) + 2.5, 10))}
                  disabled={updating || isCompleted}
                  className="flex-1"
                >
                  +2.5km
                </Button>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          {motivationalMessage && (
            <Alert className="bg-purple-900/20 border-purple-600">
              <Zap className="h-4 w-4 text-purple-400" />
              <AlertDescription className="text-purple-200">
                {motivationalMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Penalty Zone Button */}
          {canEnterPenaltyZone && (
            <div className="text-center">
              <Button 
                onClick={enterPenaltyZone}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Skull className="w-4 h-4 mr-2" />
                Enter Penalty Zone (Failed Quest Punishment)
              </Button>
            </div>
          )}

          {/* Easter Egg */}
          {questData?.easter_egg && (
            <div className="text-center text-yellow-400 text-sm italic">
              🥚 {questData.easter_egg}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Rewards */}
      {isCompleted && (
        <Card className="bg-gradient-to-r from-green-900 to-emerald-900 border-green-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              Quest Completed - Rewards Earned!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">1000</div>
                <div className="text-green-200 text-sm">Experience</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">+2</div>
                <div className="text-green-200 text-sm">Strength</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">+1</div>
                <div className="text-green-200 text-sm">Vitality</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">+1</div>
                <div className="text-green-200 text-sm">Agility</div>
              </div>
            </div>
            <div className="text-center mt-4 text-yellow-400 font-bold">
              🌟 "Another step closer to becoming the Shadow Monarch!" 👑
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyQuest;