// StreakModal.jsx
import React from "react";
import "./StreakModal.css";

const StreakModal = ({ streak, lastPlayed, onClose }) => {
  return (
    <div className="streak-modal-overlay">
      <div className="streak-modal-content">
        <h3>Your Streak🔥</h3>
        <p>
          Current Streak: <strong>{streak}</strong> day{streak !== 1 ? "s" : ""}
        </p>
        <p>Last Played: {lastPlayed ? lastPlayed : "N/A"}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StreakModal;
