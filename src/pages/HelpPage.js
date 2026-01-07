// src/pages/HelpPage.js
import { useState } from "react";
import howToPlayGif from "../assets/help.png";
import "./HelpPage.css";
import customButtonImage from "../assets/settings.png";
import SettingsModal from "./SettingsModal";
function HelpPage() {
  const [showModal, setShowModal] = useState(false);

  const handleCustomClick = () => {
    setShowModal(true); // Correct way to open modal
  };

  return (
    <div>
      <img src={howToPlayGif} alt="How to Play Sudoku" className="help-gif" />
      <img
        src={customButtonImage}
        alt="Custom Mode"
        className="image-button"
        onClick={handleCustomClick}
      />

      {showModal && (
        <SettingsModal variant="others" onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default HelpPage;
