// HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Import the CSS file for styling
import customButtonImage from "../assets/settings.png"; 
function HomePage() {
    const navigate = useNavigate();

    const handleDifficultyClick = (difficulty) => {
        navigate(`/play?difficulty=${difficulty}`);
    };
    const handleCustomClick = () => {
        navigate("/custom");
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
        </div>
    );
}

export default HomePage;