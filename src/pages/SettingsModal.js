import "./SettingsModal.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StreakModal from "./StreakModal";
import api from "../api/api";
const SettingsModal = ({ variant = "home", onClose }) => {
  const navigate = useNavigate();

  const [streak, setStreak] = useState(null);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // ---------- Handlers INSIDE modal ----------
  const handleHome = () => {
    navigate("/home");
    onClose();
  };

  const handleHelp = () => {
    navigate("/help");
    onClose();
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleResumeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/resume_game", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        alert("No saved game found!");
        return;
      }

      const data = await response.json();
      navigate("/play", {
        state: {
          resumeGame: true,
          puzzle: data.puzzle,
          progress: data.progress,
          solution: data.solution,
          time: data.time,
        },
      });
    } catch (error) {
      console.error("Error resuming game:", error);
      alert("Failed to resume game.");
    }
  };
  const fetchStreak = async () => {
    try {
      const response = await api.get("/streak", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStreak(response.data.streak_count);
      setLastPlayed(response.data.last_played_date);
      setShowStreakModal(true);
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  // ---------- Page-based menu ----------
  const MENU_CONFIG = {
    home: [
      { label: "Help", action: handleHelp },
      { label: "Leaderboard", action: handleLeaderboard },
      { label: "My Streak", action: fetchStreak },
      // { label: "Resume game", action: handleResumeClick },
      { label: "Logout", action: handleLogout },
    ],
    others: [
      { label: "Home", action: handleHome },
      { label: "Logout", action: handleLogout },
    ],
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">MENU</h2>

          {MENU_CONFIG[variant].map((btn, idx) => (
            <button key={idx} onClick={btn.action}>
              {btn.label}
            </button>
          ))}

          <button onClick={onClose}>Close</button>
        </div>
      </div>

      {showStreakModal && (
        <StreakModal
          streak={streak}
          lastPlayed={lastPlayed}
          onClose={() => setShowStreakModal(false)}
        />
      )}
    </>
  );
};

export default SettingsModal;
