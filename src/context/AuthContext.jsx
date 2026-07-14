import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = "https://fsa-jwt-practice.herokuapp.com";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("ENTRANCE");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const savedToken = sessionStorage.getItem("secret_tunnel_token");
    const savedLocation = sessionStorage.getItem("secret_tunnel_location");

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const saveAuthSession = (newToken, newLocation) => {
    setToken(newToken);
    setLocation(newLocation);
    setErrorMsg("");

    if (newToken) {
      sessionStorage.setItem("secret_tunnel_token", newToken);
    } else {
      sessionStorage.removeItem("secret_tunnel_token");
    }
    sessionStorage.setItem("secret_tunnel_location", newLocation);
  };

  const signup = async ({ username }) => {
    try {
      setErrorMsg("");
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed!");
      }

      saveAuthSession(result.token, "TABLET");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const authenticate = async () => {
    try {
      setErrorMsg("");
      if (!token) {
        throw new Error("No validation token found!");
      }

      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Verification failed!");
      }

      saveAuthSession(token, "TUNNEL");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const reset = () => {
    saveAuthSession(null, "ENTRANCE");
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ token, location, errorMsg, signup, authenticate, reset }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
