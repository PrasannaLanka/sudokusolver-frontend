// Updated api.js
import axios from "axios";

const PROD_BASE_URL = process.env.REACT_APP_API_URL || 
  "https://sudokusolver-backend.up.railway.app";
const LOCAL_BASE_URL = "http://localhost:8080";

// Create base instance
const api = axios.create({
  baseURL: PROD_BASE_URL,
  timeout: 10000,
});

export const tryLocalFallback = async (config) => {
  try {
    return await api.request(config);
  } catch (error) {
    // If using prod URL and request failed, try local
    if (config.baseURL === PROD_BASE_URL || !config.baseURL) {
      console.warn("⚠️ Railway backend unreachable. Trying localhost...");
      const localConfig = {
        ...config,
        baseURL: LOCAL_BASE_URL
      };
      return await api.request(localConfig);
    }
    throw error;
  }
};

export default api;