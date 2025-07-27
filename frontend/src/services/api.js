import axios from 'axios';

// Get backend URL from environment
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and Easter eggs
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    
    // Log Easter eggs if present
    if (response.data?.easter_egg) {
      console.log(`🥚 Easter Egg: ${response.data.easter_egg}`);
    }
    
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases with fun messages
    if (error.response?.status === 404) {
      console.log("🕵️ 404: Like Jin-Woo's enemies, this endpoint has vanished into the shadows...");
    } else if (error.response?.status === 500) {
      console.log("💥 500: Even the Shadow Monarch faces server crashes sometimes!");
    }
    
    return Promise.reject(error);
  }
);

// Player API methods
export const playerAPI = {
  // Create a new player
  async createPlayer(playerData) {
    const response = await api.post('/players', playerData);
    return response.data;
  },

  // Get player information
  async getPlayer(playerId) {
    const response = await api.get(`/players/${playerId}`);
    return response.data;
  },

  // Update player information
  async updatePlayer(playerId, updates) {
    const response = await api.put(`/players/${playerId}`, updates);
    return response.data;
  },

  // Get player equipment
  async getPlayerEquipment(playerId) {
    const response = await api.get(`/players/${playerId}/equipment`);
    return response.data;
  },

  // Get player shadows
  async getPlayerShadows(playerId) {
    const response = await api.get(`/players/${playerId}/shadows`);
    return response.data;
  },
};

// Daily Quest API methods
export const dailyQuestAPI = {
  // Get today's daily quest
  async getDailyQuest(playerId) {
    const response = await api.get(`/players/${playerId}/daily-quest`);
    return response.data;
  },

  // Update daily quest progress
  async updateDailyQuest(playerId, progress) {
    const response = await api.put(`/players/${playerId}/daily-quest`, progress);
    return response.data;
  },

  // Enter penalty zone
  async enterPenaltyZone(playerId) {
    const response = await api.post(`/players/${playerId}/penalty-zone`);
    return response.data;
  },

  // Get penalty zone status
  async getPenaltyZoneStatus(playerId, sessionId) {
    const response = await api.get(`/players/${playerId}/penalty-zone/${sessionId}`);
    return response.data;
  },
};

// Shadow Extraction API methods
export const shadowAPI = {
  // Extract a shadow from defeated enemy
  async extractShadow(playerId, extractionData) {
    const response = await api.post(`/players/${playerId}/extract-shadow`, extractionData);
    return response.data;
  },

  // Upgrade a shadow
  async upgradeShadow(playerId, shadowId) {
    const response = await api.put(`/players/${playerId}/shadows/${shadowId}/upgrade`);
    return response.data;
  },
};

// Instant Dungeons API methods
export const dungeonAPI = {
  // Get available instant dungeons
  async getInstantDungeons(playerId) {
    const response = await api.get(`/players/${playerId}/instant-dungeons`);
    return response.data;
  },

  // Enter an instant dungeon
  async enterInstantDungeon(playerId, dungeonId) {
    const response = await api.post(`/players/${playerId}/instant-dungeons/${dungeonId}/enter`);
    return response.data;
  },

  // Engage in dungeon combat
  async dungeonCombat(playerId, dungeonId) {
    const response = await api.post(`/players/${playerId}/dungeons/${dungeonId}/combat`);
    return response.data;
  },
};

// Equipment Enhancement API methods
export const equipmentAPI = {
  // Enhance equipment
  async enhanceEquipment(playerId, itemId) {
    const response = await api.post(`/players/${playerId}/equipment/${itemId}/enhance`);
    return response.data;
  },
};

// Story API methods
export const storyAPI = {
  // Get player story progress
  async getPlayerStoryProgress(playerId) {
    const response = await api.get(`/players/${playerId}/story`);
    return response.data;
  },

  // Get story chapter content
  async getStoryChapter(chapterNumber) {
    const response = await api.get(`/story/chapters/${chapterNumber}`);
    return response.data;
  },
};

// Easter Eggs API methods (for fun!)
export const easterEggAPI = {
  // Get Jin-Woo quotes
  async getJinWooQuotes() {
    const response = await api.get('/easter-eggs/jin-woo-quotes');
    return response.data;
  },

  // Get funny stats
  async getFunnyStats() {
    const response = await api.get('/easter-eggs/stats');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

// Default export
export default api;

// Utility function to handle API errors gracefully
export const handleApiError = (error, customMessage = "Something went wrong") => {
  console.error('API Error:', error);
  
  if (error.response?.data?.easter_egg) {
    console.log(`🥚 Error Easter Egg: ${error.response.data.easter_egg}`);
  }
  
  const errorMessage = error.response?.data?.detail || 
                      error.response?.data?.message || 
                      error.message || 
                      customMessage;
  
  // Return user-friendly error with Easter egg
  return {
    success: false,
    message: errorMessage,
    easter_egg: "💀 'Even the strongest hunters face setbacks!' - Jin-Woo probably"
  };
};

// Success handler with Easter eggs
export const handleApiSuccess = (data, customMessage = "Success!") => {
  if (data?.easter_egg) {
    console.log(`🎉 Success Easter Egg: ${data.easter_egg}`);
  }
  
  return {
    success: true,
    message: customMessage,
    data: data,
    easter_egg: data?.easter_egg || "🌟 'Another step closer to becoming the Shadow Monarch!' ⚡"
  };
};