import React, { createContext, useContext, useState, useEffect } from "react";
import { mockPlayer } from "../mock/mockData";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [player, setPlayer] = useState(mockPlayer);
  const [isLoading, setIsLoading] = useState(false);

  const updatePlayer = (updates) => {
    setPlayer(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateStats = (statUpdates) => {
    setPlayer(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        ...statUpdates
      }
    }));
  };

  const gainExperience = (amount) => {
    setPlayer(prev => {
      const newExp = prev.experience + amount;
      let newLevel = prev.level;
      let newExpToNext = prev.experienceToNext;

      // Simple level up calculation
      if (newExp >= prev.experienceToNext) {
        newLevel += 1;
        newExpToNext = prev.experienceToNext + (newLevel * 1000);
      }

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNext: newExpToNext
      };
    });
  };

  const value = {
    player,
    setPlayer,
    updatePlayer,
    updateStats,
    gainExperience,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};