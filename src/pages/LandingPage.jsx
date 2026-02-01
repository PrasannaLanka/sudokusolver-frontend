import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero">
        <h1>Sudoku Game for Kids</h1>

        <p className="subtitle">
          Fun and free Sudoku puzzles designed for kids. 
          Improve logical thinking, focus, and problem-solving skills. Climb up leaderboard and maintain streak as well.
        </p>
      </section>

      {/* FEATURES */}
      {/* <section className="features">
        <h2>Why Is This Sudoku Game Fun?</h2>

        <div className="feature-grid">
          <div className="feature-card">🏆 Fastest-time leaderboards</div>
          <div className="feature-card">🔥 Daily streak tracking</div>
          <div className="feature-card">📊 Easy / Medium / Hard rankings</div>
          <div className="feature-card">🎯 Streak-based leaderboards</div>
          <div className="feature-card">💾 Save & resume games</div>
          <div className="feature-card">📱 Play on Desktop or Mobile</div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="final-cta">       

        <Link to="/login">
          <button className="cta-btn">▶ Login to play Sudoku now</button>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
