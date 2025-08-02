// pages/SudokuGame.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SudokuGame.css";
import SettingsModal from "./SettingsModal";
import customButtonImage from "../assets/settings.png"; 
import ResultModal from "../components/ResultsModal.js"; 

const SudokuGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty") || "medium";

  const [wrongCells, setWrongCells] = useState(new Set());
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userBoard, setUserBoard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultStatus, setResultStatus] = useState(""); // 'You won!' or 'Invalid solution' etc.
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  // Get token from localStorage
  const token = localStorage.getItem("token");

 
const [showModal, setShowModal] = useState(false);
const calculateWrongCells = (board, puzzle) => {
  const wrongs = new Set();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === 0 && board[i][j] !== 0) {
        if (!isValidMove(board, i, j, board[i][j])) {
          wrongs.add(`${i}-${j}`);
        }
      }
    }
  }
  return wrongs;
};
useEffect(() => {
  if (!isPaused) {
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(timerRef.current);
}, [isPaused]);

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

const handleHelp = () => {
  navigate("/help");
};
const handleHome = () => {
  navigate("/home");
};
const handleLeaderboard = () => {
  navigate("/leaderboard"); 
};
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Fetch new puzzle on difficulty change
  useEffect(() => {
    if (!token) return;
    const resumeData = location.state?.resumeGame;

    if (resumeData) {
      const resumedPuzzle = location.state.puzzle;
      const resumedSolution = location.state.solution;
      const resumedProgress = location.state.progress;
      const resumedTime = location.state.time || 0;
    
      setPuzzle(resumedPuzzle);
      setSolution(resumedSolution);
      setUserBoard(resumedProgress);
      setTime(resumedTime);
      setMessage("");
      setWrongCells(calculateWrongCells(resumedProgress, resumedPuzzle));
      setLoading(false);
      return;
    }
    
  
    setLoading(true);
    axios
      .get(`http://localhost:5000/generate?difficulty=${difficulty}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPuzzle(response.data.puzzle);
        setSolution(response.data.solution);
        setUserBoard(response.data.puzzle.map((row) => [...row]));
        setTime(0);
        setMessage("");
        setWrongCells(new Set());
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching puzzle:", error);
          setMessage("Failed to load puzzle.");
          setLoading(false);
        }
      });
  }, [difficulty, token, navigate]);

   // Keyboard navigation between cells
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedCell.row === null || selectedCell.col === null) return;

      const { row, col } = selectedCell;
      let newRow = row;
      let newCol = col;

      if (e.key === "ArrowUp") newRow = row > 0 ? row - 1 : row;
      else if (e.key === "ArrowDown") newRow = row < 8 ? row + 1 : row;
      else if (e.key === "ArrowLeft") newCol = col > 0 ? col - 1 : col;
      else if (e.key === "ArrowRight") newCol = col < 8 ? col + 1 : col;
      else return;

      // Skip non-editable cells
      while (puzzle[newRow][newCol] !== 0) {
        if (e.key === "ArrowUp" && newRow > 0) newRow--;
        else if (e.key === "ArrowDown" && newRow < 8) newRow++;
        else if (e.key === "ArrowLeft" && newCol > 0) newCol--;
        else if (e.key === "ArrowRight" && newCol < 8) newCol++;
        else break; // no further move possible
      }

      setSelectedCell({ row: newRow, col: newCol });

      const input = document.getElementById(`cell-${newRow}-${newCol}`);
      input?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, puzzle]);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isPaused) return;

      if (selectedCell.row === null || selectedCell.col === null) return;
  
      const { row, col } = selectedCell;
      if (puzzle[row][col] !== 0) return;
  
      if (/^[1-9]$/.test(e.key)) {
        handleChange(row, col, parseInt(e.key));
      } else  {
        handleChange(row, col, 0);
      }
    };
  
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedCell, puzzle, isPaused]);
  
  const isValidMove = (board, row, col, val) => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === val) return false;
      if (i !== row && board[i][col] === val) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === val) return false;
      }
    }
    return true;
  };

  const handleChange = (row, col, value) => {
    if (puzzle[row][col] !== 0) return;
  
    if (value === "" || value === 0 || /^[1-9]$/.test(value)) {
      const val = value ? parseInt(value) : 0;  
      const newBoard = userBoard.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? val : c))
      );
  
      setUserBoard(newBoard);
      setWrongCells(calculateWrongCells(newBoard, puzzle));
    }
  };
  

  const checkSolution = async () => {
    if (!token) return navigate("/login");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/check",
        { board: userBoard, solution},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setMessage(response.data.message);
      setResultStatus(response.data.message);
      setShowResultModal(true);
  
      // Optional: Send stats to backend
      if (response.data.status === "success") {
        await axios.post(
          "http://localhost:5000/record_game",
          {
            timeTaken: time,
            difficulty: difficulty,
            date: new Date().toISOString().split("T")[0],
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true  // <--- IMPORTANT
          }
        );
        await axios.post(
          "http://localhost:5000/update_streak",
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
      }
  
    } catch (error) {
      const msg = error.response?.data?.message || "Error checking solution";
      setMessage(msg);
      setResultStatus(msg);
      setShowResultModal(true);
    }
  };
  
  const handlePauseAndSave = async () => {
    if (!isPaused) {
      // We're pausing
      try {
        await axios.post(
          "http://localhost:5000/save_game",
          {
            puzzle,
            progress: userBoard,
            solution
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsPaused(true); 
       
      } catch (error) {
        alert("Failed to save game.");
        console.error(error);
      }
    } else {
      
      setIsPaused(false);
    }
  };
  

  const resetGame = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setIsPaused(false);  
    setLoading(true);
    axios
      .get(`http://localhost:5000/generate?difficulty=${difficulty}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPuzzle(response.data.puzzle);
        setSolution(response.data.solution);
        setUserBoard(response.data.puzzle.map((row) => [...row]));
        setTime(0);
        setMessage("");
        setWrongCells(new Set());
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching puzzle:", error);
          setMessage("Failed to load puzzle.");
          setLoading(false);
        }
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
          <div
          key={cIndex}
          id={`cell-${rIndex}-${cIndex}`}
          tabIndex={0}
          onClick={() => setSelectedCell({ row: rIndex, col: cIndex })}
          className={`sudoku-cell
            ${rIndex % 3 === 0 ? "box-border-top" : ""}
            ${cIndex % 3 === 0 ? "box-border-left" : ""}
            ${rIndex === 8 ? "box-border-bottom" : ""}
            ${cIndex === 8 ? "box-border-right" : ""}
            ${selectedCell.row === rIndex && selectedCell.col === cIndex ? "selected-cell" : ""}
            ${wrongCells.has(`${rIndex}-${cIndex}`) ? "wrong-cell" : ""}
            ${puzzle[rIndex][cIndex] !== 0 ? "prefilled-cell" : "editable-cell"}
          `}
        >
          {userBoard[rIndex][cIndex] || ""}
        </div>
        
            
            ))}
          </div>
        ))}
      </div>
      <img
  src={customButtonImage}
  alt="Settings"
  className="image-button"
  onClick={() => setShowModal(true)}
/>

{showModal && (
  <SettingsModal
    onClose={() => setShowModal(false)}
    onHome = {handleHome}
    onLeaderboard={handleLeaderboard}
    onHelp={handleHelp}
    onLogout={handleLogout}
  />
)}
<ResultModal
  show={showResultModal}
  message={resultStatus}
  time={formatTime(time)}
  onClose={() => setShowResultModal(false)}
  onNewGame={resetGame}
  onLogout={handleLogout}
  onHome={() => navigate("/")}
/>


      <div className="button-group">
        <button className="sudoku-button" onClick={checkSolution}>
          Submit
        </button>
        <button className="sudoku-button" onClick={resetGame}>
          New Game
        </button>
        <button className="sudoku-button" onClick={handlePauseAndSave}>
  {isPaused ? "Resume" : "Pause & Save"}
</button>


      </div>

      {message && <div className="sudoku-message">{message}</div>}
    </div>
  );
};

export default SudokuGame;
