import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [puzzle, setPuzzle] = useState([]);
    const [solution, setSolution] = useState([]);
    const [userBoard, setUserBoard] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/generate").then((response) => {
            setPuzzle(response.data.puzzle);
            setSolution(response.data.solution);
            setUserBoard(response.data.puzzle.map(row => [...row])); // Copy puzzle array
        });
    }, []);

    const handleChange = (row, col, value) => {
        if (puzzle[row][col] !== 0) return; // Prevent editing pre-filled numbers

        // Allow only digits 1-9 or empty input
        if (value === "" || /^[1-9]$/.test(value)) {
            const newBoard = userBoard.map((r, i) =>
                r.map((c, j) => (i === row && j === col ? (value ? parseInt(value) : 0) : c))
            );
            setUserBoard(newBoard);
        }
    };

    const checkSolution = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/check", {
                board: userBoard,
                solution: solution,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="container">
            <h1>Sudoku Game</h1>
            <div className="grid">
                {puzzle.length > 0 &&
                    puzzle.map((row, rIndex) =>
                        row.map((num, cIndex) => (
                            <input
                                key={`${rIndex}-${cIndex}`}
                                type="text"
                                maxLength="1"
                                value={userBoard[rIndex][cIndex] || ""}
                                onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                                disabled={puzzle[rIndex][cIndex] !== 0}
                            />
                        ))
                    )}
            </div>
            <button onClick={checkSolution}>Check Solution</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default App;
