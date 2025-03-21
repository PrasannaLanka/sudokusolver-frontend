// PlayPage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PlayPage.css";

function PlayPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const difficulty = queryParams.get('difficulty') || 'medium';

    const [puzzle, setPuzzle] = useState([]);
    const [solution, setSolution] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/generate?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => {
                setPuzzle(data.puzzle);
                setSolution(data.solution);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching puzzle:", error);
                setLoading(false);
            });
    }, [difficulty]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="play-container">
            <h1>Sudoku - {difficulty}</h1>
            <div className="sudoku-grid">
                {puzzle.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => (
                            <input
                                key={colIndex}
                                type="text"
                                className="sudoku-cell"
                                value={cell === 0 ? '' : cell}
                                readOnly={cell !== 0}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <button onClick={() => checkSolution()}>Check Solution</button>
        </div>
    );

    function checkSolution() {
        const userBoard = puzzle.map(row => row.map(cell => cell === '' ? 0 : cell));
        fetch('http://localhost:5000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ board: userBoard, solution: solution }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error("Error checking solution:", error);
            });
    }
}

export default PlayPage;