import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { shadowAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Crown, 
  Zap, 
  Ghost, 
  Skull, 
  Star,
  Eye,
  Flame,
  Sparkles,
  Target,
  Users,
  Plus,
  TrendingUp
} from "lucide-react";

const ShadowExtraction = ({ onShadowExtracted, onClose }) => {
  const { player } = useAuth();
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [showAriseAnimation, setShowAriseAnimation] = useState(false);

  // Available enemies for extraction (defeated in combat)
  const availableEnemies = [
    {
      name: "Goblin",
      type: "Basic Monster",
      rarity: "Common",
      power_level: 150,
      success_rate: 0.8,
      mana_cost: 50,
      description: "A weak but numerous creature. Perfect for beginners.",
      easter_egg: "🟢 'Even goblins have their place in the army!' 👥"
    },
    {
      name: "Hobgoblin",
      type: "Elite Monster", 
      rarity: "Rare",
      power_level: 300,
      success_rate: 0.65,
      mana_cost: 100,
      description: "Stronger and more intelligent than regular goblins.",
      easter_egg: "🔵 'A worthy addition to the shadow army!' ⚔️"
    },
    {
      name: "Ice Elf",
      type: "Magical Creature",
      rarity: "Epic", 
      power_level: 600,
      success_rate: 0.5,
      mana_cost: 200,
      description: "Masters of ice magic from the frozen realms.",
      easter_egg: "🧊 'Even the coldest hearts serve the Shadow Monarch!' ❄️"
    },
    {
      name: "Demon Soldier",
      type: "Infernal Warrior",
      rarity: "Legendary",
      power_level: 1200,
      success_rate: 0.3,
      mana_cost: 400,
      description: "Fearsome warriors from the demon realm.",
      easter_egg: "🔥 'From demon to shadow - the ultimate transformation!' 😈"
    },
    {
      name: "Dragon",
      type: "Ancient Beast",
      rarity: "Mythic",
      power_level: 2500,
      success_rate: 0.15,
      mana_cost: 800,
      description: "The apex predator. Only the strongest can bind its soul.",
      easter_egg: "🐉 'A DRAGON SHADOW?! Jin-Woo would be jealous!' 👑"
    }
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      "Common": "text-gray-400 border-gray-400",
      "Rare": "text-blue-400 border-blue-400", 
      "Epic": "text-purple-400 border-purple-400",
      "Legendary": "text-yellow-400 border-yellow-400",
      "Mythic": "text-red-400 border-red-400"
    };
    return colors[rarity] || "text-gray-400 border-gray-400";
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      "Common": "shadow-lg shadow-gray-500/20",
      "Rare": "shadow-lg shadow-blue-500/30",
      "Epic": "shadow-lg shadow-purple-500/40", 
      "Legendary": "shadow-lg shadow-yellow-500/50",
      "Mythic": "shadow-xl shadow-red-500/60"
    };
    return glows[rarity] || "shadow-lg";
  };

  const calculateSuccessRate = (enemy) => {
    const baseRate = enemy.success_rate;
    const levelBonus = player?.level * 0.02 || 0; // 2% per level
    return Math.min(0.95, baseRate + levelBonus);
  };

  const handleExtraction = async () => {
    if (!selectedEnemy) return;

    setExtracting(true);
    setExtractionResult(null);

    try {
      // Play arise animation
      setShowAriseAnimation(true);
      
      // Add dramatic delay for effect
      await new Promise(resolve => setTimeout(resolve, 2000));

      const extractionData = {
        enemy_name: selectedEnemy.name,
        success_rate: calculateSuccessRate(selectedEnemy),
        mana_cost: selectedEnemy.mana_cost
      };

      const result = await shadowAPI.extractShadow(player.id, extractionData);
      setExtractionResult(result);

      if (result.success && onShadowExtracted) {
        onShadowExtracted(result.shadow);
      }

    } catch (error) {
      console.error("Shadow extraction failed:", error);
      setExtractionResult({
        success: false,
        message: "🌙 The extraction ritual was disrupted by dark forces...",
        easter_egg: "💀 'Even the Shadow Monarch faces technical difficulties!' 🤖"
      });
    } finally {
      setExtracting(false);
      setShowAriseAnimation(false);
    }
  };

  const EnemyCard = ({ enemy }) => (
    <Card 
      className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer ${
        selectedEnemy?.name === enemy.name ? 'border-purple-500 bg-purple-900/20' : ''
      } ${getRarityGlow(enemy.rarity)}`}
      onClick={() => setSelectedEnemy(enemy)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white">{enemy.name}</CardTitle>
          <Badge variant="outline" className={getRarityColor(enemy.rarity)}>
            {enemy.rarity}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{enemy.type}</Badge>
          <Badge variant="outline">PWR {enemy.power_level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-400 text-sm">{enemy.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Success Rate</span>
            <span className="text-green-400 font-bold">
              {(calculateSuccessRate(enemy) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={calculateSuccessRate(enemy) * 100} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Mana Cost</span>
          <span className="text-blue-400 font-bold">{enemy.mana_cost} MP</span>
        </div>

        <div className="text-xs text-yellow-400 italic">
          🥚 {enemy.easter_egg}
        </div>
      </CardContent>
    </Card>
  );

  // Arise Animation Component
  const AriseAnimation = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-8xl mb-8 animate-pulse">👤</div>
        <div className="text-6xl font-bold text-purple-400 mb-4 animate-bounce">
          ARISE!
        </div>
        <div className="text-2xl text-gray-300 animate-pulse">
          🌑 Extracting shadow essence... 🌑
        </div>
        <div className="mt-8">
          <Progress value={extracting ? 75 : 100} className="h-2 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Arise Animation Overlay */}
      {showAriseAnimation && <AriseAnimation />}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Crown className="w-8 h-8 mr-3 text-purple-400" />
              Shadow Extraction
            </h1>
            <p className="text-purple-200">Bind the souls of defeated enemies to your eternal army</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Current MP</div>
            <div className="text-4xl font-bold">{player?.mp || 0}/{player?.maxMp || 100}</div>
          </div>
        </div>
      </div>

      {/* Extraction Result */}
      {extractionResult && (
        <Alert className={`${
          extractionResult.success 
            ? 'bg-green-900/20 border-green-600' 
            : 'bg-red-900/20 border-red-600'
        }`}>
          <div className="flex items-center">
            {extractionResult.success ? (
              <Sparkles className="h-5 w-5 text-green-400" />
            ) : (
              <Skull className="h-5 w-5 text-red-400" />
            )}
            <AlertDescription className={`ml-2 ${
              extractionResult.success ? 'text-green-200' : 'text-red-200'
            }`}>
              {extractionResult.message}
            </AlertDescription>
          </div>
          
          {extractionResult.success && extractionResult.shadow && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <h4 className="text-white font-bold mb-2">New Shadow Acquired!</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{extractionResult.shadow.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{extractionResult.shadow.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white ml-2">{extractionResult.shadow.level}</span>
                </div>
                <div>
                  <span className="text-gray-400">Loyalty:</span>
                  <span className="text-yellow-400 ml-2">{extractionResult.shadow.loyalty}%</span>
                </div>
              </div>
            </div>
          )}
          
          {extractionResult.easter_egg && (
            <div className="mt-2 text-yellow-400 text-sm italic">
              🥚 {extractionResult.easter_egg}
            </div>
          )}
        </Alert>
      )}

      {/* Enemy Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-400" />
            Select Defeated Enemy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableEnemies.map((enemy) => (
              <EnemyCard key={enemy.name} enemy={enemy} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extraction Interface */}
      {selectedEnemy && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Ghost className="w-5 h-5 mr-2 text-purple-400" />
              Shadow Extraction Ritual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-600/30">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedEnemy.name}
                </h3>
                <Badge variant="outline" className={getRarityColor(selectedEnemy.rarity)}>
                  {selectedEnemy.rarity} {selectedEnemy.type}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">
                    {(calculateSuccessRate(selectedEnemy) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-300 text-sm">Success Rate</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedEnemy.mana_cost}
                  </div>
                  <div className="text-gray-300 text-sm">Mana Cost</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleExtraction}
                  disabled={extracting || (player?.mp || 0) < selectedEnemy.mana_cost}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                >
                  {extracting ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Extracting Shadow...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      ARISE! (Extract Shadow)
                    </>
                  )}
                </Button>

                {(player?.mp || 0) < selectedEnemy.mana_cost && (
                  <Alert className="bg-red-900/20 border-red-600">
                    <Zap className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                      Insufficient mana! You need {selectedEnemy.mana_cost} MP but only have {player?.mp || 0} MP.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center text-gray-400 text-sm">
                  💡 Higher level increases success rate. Current bonus: +{((player?.level || 1) * 2).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shadow Army Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            Shadow Army Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {player?.shadowArmy?.current || 0}
              </div>
              <div className="text-gray-300 text-sm">Active Shadows</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {player?.shadowArmy?.capacity || 10}
              </div>
              <div className="text-gray-300 text-sm">Max Capacity</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {player?.shadowArmy?.capacity - player?.shadowArmy?.current || 10}
              </div>
              <div className="text-gray-300 text-sm">Available Slots</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jin-Woo Quote Easter Egg */}
      <div className="text-center text-yellow-400 text-lg italic font-semibold">
        👑 "Death is not the end. It is the beginning of serving me for eternity." - Sung Jin-Woo 👑
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="text-center">
          <Button onClick={onClose} variant="outline">
            Return to Shadow Army
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShadowExtraction;