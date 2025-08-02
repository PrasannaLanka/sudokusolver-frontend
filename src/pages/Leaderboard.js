import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import customButtonImage from "../assets/settings.png"; 

const Leaderboard = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [viewMode, setViewMode] = useState("time"); // "time" or "streak"
  const [scores, setScores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url =
      viewMode === "streak"
        ? "http://localhost:5000/streak_leaderboard"
        : `http://localhost:5000/leaderboard?difficulty=${difficulty}`;

    axios
      .get(url)
      .then((res) => setScores(res.data))
      .catch((err) => console.error(err));
  }, [difficulty, viewMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHelp = () => navigate("/help");
  const handleHome = () => navigate("/home");
  const handleClose = () => setShowModal(false);
  const handleLeaderboard = () => navigate("/leaderboard");
  const handleCustomClick = () => setShowModal(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="leaderboard-wrapper">
      <img
        src={customButtonImage}
        alt="Settings"
        className="image-button"
        onClick={handleCustomClick}
      />

      {showModal && (
        <SettingsModal
          onClose={handleClose}
          onHome={handleHome}
          onHelp={handleHelp}
          onLogout={handleLogout}
          onLeaderboard={handleClose}
        />
      )}

      <div className="leaderboard-box">
        <div className="leaderboard-header">
          <div className="difficulty-buttons">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                className={`diff-btn ${difficulty === level && viewMode === "time" ? "active" : ""}`}
                onClick={() => {
                  setDifficulty(level);
                  setViewMode("time");
                }}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
            <button
              className={`diff-btn ${viewMode === "streak" ? "active" : ""}`}
              onClick={() => setViewMode("streak")}
            >
              🔥 Streak
            </button>
          </div>
        </div>

        <h2 className="leaderboard-title">
          {viewMode === "streak"
            ? "🔥 Streak Leaderboard"
            : `🏆 ${difficulty[0].toUpperCase() + difficulty.slice(1)} Leaderboard`}
        </h2>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>{viewMode === "streak" ? "Streak 🔥" : "Time"}</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr><td colSpan="3">No entries yet.</td></tr>
            ) : (
              scores.map((entry, i) => {
                const medalIcons = ["🥇", "🥈", "🥉"];
                const rankDisplay = i < 3 ? medalIcons[i] : i + 1;
                return (
                  <tr key={i}>
                    <td>{rankDisplay}</td>
                    <td>{entry.username}</td>
                    <td>
                      {viewMode === "streak"
                        ? `${entry.streak_count} day${entry.streak_count > 1 ? "s" : ""}`
                        : formatTime(entry.time_taken)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
