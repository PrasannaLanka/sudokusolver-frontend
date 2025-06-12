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
    
    const closeModal = () => {
        setShowModal(false);
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
                    onHelp={handleHelp}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default HomePage;