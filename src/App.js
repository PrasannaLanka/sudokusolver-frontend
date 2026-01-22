// src/App.js
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SudokuGame from "./pages/SudokuGame";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HelpPage from "./pages/HelpPage";

import AutoLogoutWrapper from "./components/AutoLogoutWrapper";
import { useAuth } from "./hooks/useAuth";
import "./App.css";
import Leaderboard from './pages/Leaderboard';


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// This component will check token expiry on every route change
function AuthChecker() {
  const location = useLocation();
  const { logout, isTokenExpired } = useAuth();

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/signup"];
    if (!publicRoutes.includes(location.pathname) && isTokenExpired()) {
      logout();
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AutoLogoutWrapper>
        <AuthChecker />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/play"
            element={
              <PrivateRoute>
                <SudokuGame />
              </PrivateRoute>
            }
          />
           <Route
    path="/help"
    element={
      <PrivateRoute>
        <HelpPage />
      </PrivateRoute>
    }
  />
  <Route path="/leaderboard" element={
  <PrivateRoute><Leaderboard /></PrivateRoute>
    } />

        </Routes>
      </AutoLogoutWrapper>
    </Router>
  );
}

export default App;
