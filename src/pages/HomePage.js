// HomePage.js
import { useState } from "react";
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
    setShowModal(true);
  };
  return (
    <div className="home-container">
      <h1 className="heading">LET'S SOLVE SUDOKU</h1>
      <div className="button-group">
        <div className="button-section">
          <img
            src={customButtonImage}
            alt="Custom Mode"
            className="image-button"
            onClick={handleCustomClick}
          />
          {/* Buttons positioned over placards */}
          <button
            className="difficulty-button easy"
            onClick={() => handleDifficultyClick("easy")}
          >
            Easy
          </button>
          <button
            className="difficulty-button medium"
            onClick={() => handleDifficultyClick("medium")}
          >
            Medium
          </button>
          <button
            className="difficulty-button hard"
            onClick={() => handleDifficultyClick("hard")}
          >
            Hard
          </button>
        </div>
      </div>

      {showModal && (
        <SettingsModal variant="home" onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default HomePage;
