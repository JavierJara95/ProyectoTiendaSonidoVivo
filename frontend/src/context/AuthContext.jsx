import { createContext, useContext, useEffect, useState } from "react";
import * as auth from "../services/authService";
import { initializeDemo } from "../services/bootstrapService";
import { subscribeStorage } from "../utils/storage";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    initializeDemo()
      .then(() => {
        if (mounted) {
          setUser(auth.getCurrentUser());
          setReady(true);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message);
          setReady(true);
        }
      });
    const sync = () => {
      if (mounted) setUser(auth.getCurrentUser());
    };
    const unsubscribe = subscribeStorage(sync);
    const timer = setInterval(sync, 30000);
    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(timer);
    };
  }, []);
  const value = { user, ready, error, login: auth.login, logout: auth.logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Falta AuthProvider.");
  return context;
}
