import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SudokuGame.css"; 

function SudokuGame() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get('difficulty') || 'medium';

  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userBoard, setUserBoard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/generate?difficulty=${difficulty}`)
      .then((response) => {
        setPuzzle(response.data.puzzle);
        setSolution(response.data.solution);
        setUserBoard(response.data.puzzle.map(row => [...row]));
        setTime(0);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching puzzle:", error);
        setLoading(false);
      });
  }, [difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (row, col, value) => {
    if (puzzle[row][col] !== 0) return;

    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = userBoard.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? (value ? parseInt(value) : 0) : c))
      );
      setUserBoard(newBoard);
    }
  };

  const checkSolution = async () => {
    try {
      const response = await axios.post("http://localhost:5000/check", {
        board: userBoard,
        solution: solution,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error checking solution");
    }
  };

  const resetGame = () => {
    setLoading(true);
    axios.get(`http://localhost:5000/generate?difficulty=${difficulty}`)
      .then((response) => {
        setPuzzle(response.data.puzzle);
        setSolution(response.data.solution);
        setUserBoard(response.data.puzzle.map(row => [...row]));
        setTime(0);
        setMessage("");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="sudoku-container">
        <div className="loading-spinner">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="sudoku-container">
      <h1 className="sudoku-title">Sudoku - {difficulty.toUpperCase()}</h1>
      <div className="sudoku-timer">Time: {formatTime(time)}</div>
      
      <div className="sudoku-grid">
        {puzzle.map((row, rIndex) => (
          <div key={rIndex} className="sudoku-row">
            {row.map((num, cIndex) => (
              <input
                key={cIndex}
                type="text"
                maxLength="1"
                value={userBoard[rIndex][cIndex] || ""}
                onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                disabled={puzzle[rIndex][cIndex] !== 0}
                className="sudoku-cell"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button className="sudoku-button" onClick={checkSolution}>
          Check Solution
        </button>
        <button className="sudoku-button" onClick={resetGame}>
          New Game
        </button>
      </div>

      {message && <div className="sudoku-message">{message}</div>}
    </div>
  );
}

export default SudokuGame;