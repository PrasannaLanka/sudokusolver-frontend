import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import customButtonImage from "../assets/settings.png"; 

const Leaderboard = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [scores, setScores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/leaderboard?difficulty=${difficulty}`)
      .then((res) => setScores(res.data))
      .catch((err) => console.error(err));
  }, [difficulty]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

const handleHelp = () => {
    navigate("/help"); 
};
const handleHome = () => {
    navigate("/home"); 
};

const handleClose = () => {
    setShowModal(false);
};
const handleLeaderboard = () => {
  navigate("/leaderboard"); 
};
const handleCustomClick = () => {
  setShowModal(true); // Correct way to open modal
};


  return (
    <div className="leaderboard-wrapper">
       <img
                src={customButtonImage}
                alt="Custom Mode"
                className="image-button"
                onClick={handleCustomClick}
            />
      {showModal && (
        <SettingsModal
          onClose={ handleClose}
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
                className={`diff-btn ${difficulty === level ? "active" : ""}`}
                onClick={() => setDifficulty(level)}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        
        </div>

        <h2 className="leaderboard-title">🏆 {difficulty[0].toUpperCase() + difficulty.slice(1)} Leaderboard</h2>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr><td colSpan="3">No entries yet.</td></tr>
            ) : (
              scores.map((entry, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.time_taken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
