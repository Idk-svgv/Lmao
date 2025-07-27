import React from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { player } = useAuth();
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">Welcome back,</div>
          <div className="text-lg font-semibold text-purple-400">{player.name}</div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Level and XP */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Level</span>
            <span className="text-lg font-bold text-yellow-400">{player.level}</span>
          </div>
          
          {/* XP Bar */}
          <div className="flex items-center space-x-2">
            <div className="w-40 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(player.experience / player.experienceToNext) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{player.experience}/{player.experienceToNext}</span>
          </div>
          
          {/* HP/MP */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-xs text-red-400">HP</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
                />
              </div>
              <span className="text-xs text-blue-400">MP</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;