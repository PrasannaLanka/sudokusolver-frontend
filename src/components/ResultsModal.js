// components/ResultModal.js
import "./ResultsModal.css";

const ResultModal = ({ show, message, time, onClose, onNewGame }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <p>Time taken: {time}</p>
        <div className="modal-buttons">
          <button onClick={onNewGame}>New Game</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
