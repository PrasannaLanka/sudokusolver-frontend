import React from "react";
import "./SettingsModal.css";

const SettingsModal = ({ onClose, onHelp, onLogout, onResume }) => {

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2 className="modal-title">MENU</h2>

                <button onClick={onHelp}>Help</button>
                <button onClick={onLogout}>Logout</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SettingsModal;
