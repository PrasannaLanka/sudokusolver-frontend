// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SudokuGame from "./SudokuGame"; 
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/play" element={<SudokuGame />} />
            </Routes>
        </Router>
    );
}

export default App;