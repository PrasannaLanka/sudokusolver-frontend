// src/pages/HelpPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import howToPlayGif from "../assets/help";
import "./HelpPage.css"; // Optional for styling

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="help-page">
     
      <img
        src={howToPlayGif}
        alt="How to Play Sudoku"
        className="help-gif"
      />

      <div className="help-buttons">
        <button onClick={() => navigate("/")}>🏠 Home</button>
        <button onClick={() => navigate("/login")}>🚪 Logout</button>
      </div>
    </div>
  );
}

export default HelpPage;
