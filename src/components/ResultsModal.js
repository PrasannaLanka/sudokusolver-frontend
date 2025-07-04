// components/ResultModal.js
import React from "react";
import "./ResultsModal.css";

const ResultModal = ({ show, message, time, onClose, onNewGame, onLogout, onHome }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <p>Time taken: {time}</p>
        <div className="modal-buttons">
          <button onClick={onNewGame}>New Game</button>
          <button onClick={onHome}>Home</button>
          <button onClick={onLogout}>Logout</button>
        </div>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default ResultModal;
