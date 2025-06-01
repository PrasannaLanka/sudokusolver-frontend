import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return true;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  return { logout, isTokenExpired };
}
