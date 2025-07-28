import "./SettingsModal.css";
import React, { useState } from "react";
import axios from "axios";
const SettingsModal = ({ onClose, onHelp, onLogout , onHome, onLeaderboard}) => {
    const [streak, setStreak] = useState(null);
    const [lastPlayed, setLastPlayed] = useState(null);
    const fetchStreak = async () => {
        try {
          const response = await axios.get("http://localhost:5000/streak", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          setStreak(response.data.streak_count);
          setLastPlayed(response.data.last_played_date);
        } catch (error) {
          console.error("Error fetching streak:", error);
        }
      };
      
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2 className="modal-title">MENU</h2>
                <button onClick={onHome}>Home</button>
                <button onClick={onHelp}>Help</button>
                <button onClick={onLeaderboard}>Leaderboard</button>         
                <button onClick={fetchStreak} >
  My Streak
</button>

{streak !== null && (
  <p style={{ marginTop: "8px" }}>
    🔥 Current Streak: <strong>{streak}</strong> day{streak > 1 ? "s" : ""}  
  </p>
)}
       <button onClick={onLogout}>Logout</button>
       <button onClick={onClose}>Close</button>

            </div>
        </div>
    );
};

export default SettingsModal;
