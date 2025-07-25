import React from "react";
import "./SettingsModal.css";

const SettingsModal = ({ onClose, onHelp, onLogout , onHome, onLeaderboard}) => {

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2 className="modal-title">MENU</h2>
                <button onClick={onHome}>Home</button>
                <button onClick={onHelp}>Help</button>
                <button onClick={onLeaderboard}>Leaderboard</button>
                <button onClick={onLogout}>Logout</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SettingsModal;
