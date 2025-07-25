// HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Import the CSS file for styling
import customButtonImage from "../assets/settings.png"; 
import SettingsModal from "./SettingsModal"; 
function HomePage() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const handleDifficultyClick = (difficulty) => {
        navigate(`/play?difficulty=${difficulty}`);
    };
    const handleCustomClick = () => {
        setShowModal(true); // Correct way to open modal
    };
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleHelp = () => {
        navigate("/help"); // instead of alert
    };
    const handleHome = () => {
        navigate("/home"); 
    };
    const handleLeaderboard = () => {
        navigate("/leaderboard"); 
    };
    
    const closeModal = () => {
        setShowModal(false);
    };
    const handleResumeClick = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/resume_game", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
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
              time: data.time 
            }
          });
        } catch (error) {
          console.error("Error resuming game:", error);
          alert("Failed to resume game.");
        }
      };
      
    return (
        <div className="home-container">
            <h1>LET'S SOLVE SUDOKU</h1>
            
            {/* Buttons positioned over placards */}
            <button
                className="difficulty-button easy"
                onClick={() => handleDifficultyClick('easy')}
            >
                Easy
            </button>
            <button
                className="difficulty-button medium"
                onClick={() => handleDifficultyClick('medium')}
            >
                Medium
            </button>
            <button
                className="difficulty-button hard"
                onClick={() => handleDifficultyClick('hard')}
            >
                Hard
            </button>
            <img
                src={customButtonImage}
                alt="Custom Mode"
                className="image-button"
                onClick={handleCustomClick}
            />

            {showModal && (
                <SettingsModal
                    onClose={closeModal}
                    onHome = {handleHome}
                    onHelp={handleHelp}
                    onLeaderboard={handleLeaderboard}
                    onLogout={handleLogout}
                    onResume = {handleResumeClick}
                />
            )}
        </div>
    );
}

export default HomePage;