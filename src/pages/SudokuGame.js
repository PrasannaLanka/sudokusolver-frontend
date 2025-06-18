// pages/SudokuGame.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SudokuGame.css";

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

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Redirect to login if no token
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

  // Timer increment
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

    if (value === "" || /^[1-9]$/.test(value)) {
      const val = value ? parseInt(value) : 0;
      const newBoard = userBoard.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? val : c))
      );

      setUserBoard(newBoard);

      const newWrongCells = new Set(wrongCells);
      if (val !== 0 && !isValidMove(newBoard, row, col, val)) {
        newWrongCells.add(`${row}-${col}`);
      } else {
        newWrongCells.delete(`${row}-${col}`);
      }
      setWrongCells(newWrongCells);
    }
  };

  const checkSolution = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/check",
        { board: userBoard, solution },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setMessage(error.response?.data?.message || "Error checking solution");
      }
    }
  };

  const resetGame = () => {
    if (!token) {
      navigate("/login");
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
                id={`cell-${rIndex}-${cIndex}`}
                key={cIndex}
                type="text"
                maxLength="1"
                autoComplete="off" 
                value={userBoard[rIndex][cIndex] || ""}
                onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                onFocus={() => setSelectedCell({ row: rIndex, col: cIndex })}
                disabled={puzzle[rIndex][cIndex] !== 0}
                className={`sudoku-cell ${
                  wrongCells.has(`${rIndex}-${cIndex}`) ? "wrong-cell" : ""
                } ${
                  selectedCell.row === rIndex && selectedCell.col === cIndex
                    ? "selected-cell"
                    : ""
                }`}
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
};

export default SudokuGame;
