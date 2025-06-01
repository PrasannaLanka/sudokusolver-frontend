// src/components/AutoLogoutWrapper.js
import React, { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const AutoLogoutWrapper = ({ children, timeout = 15 * 60 * 1000 }) => {
  // default timeout: 15 minutes

  const { logout } = useAuth();
  const timerId = useRef(null);

  const resetTimer = () => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      logout();
      alert("Logged out due to inactivity");
    }, timeout);
  };

  useEffect(() => {
    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      if (timerId.current) clearTimeout(timerId.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, []);

  return <>{children}</>;
};

export default AutoLogoutWrapper;
