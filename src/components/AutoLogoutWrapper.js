import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";

const AutoLogoutWrapper = ({ children, timeout = 15 * 60 * 1000 }) => {
  const { logout } = useAuth();
  const timerId = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      logout();
      alert("Logged out due to inactivity");
    }, timeout);
  }, [logout, timeout]);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    resetTimer();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    document.addEventListener("visibilitychange", handleActivity);

    return () => {
      if (timerId.current) clearTimeout(timerId.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      document.removeEventListener("visibilitychange", handleActivity);
    };
  }, [resetTimer]);

  return <>{children}</>;
};

export default AutoLogoutWrapper;
