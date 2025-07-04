// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { Organisation } from "../types/models";

interface AuthContextType {
  currentOrg: Organisation | null;
  setCurrentOrg: (org: Organisation | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentOrg: null,
  setCurrentOrg: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentOrg, setCurrentOrg] = useState<Organisation | null>(null);

  // Doar fetch din API la start
  useEffect(() => {
    const fetchCurrentOrg = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setCurrentOrg(data);
      } catch {
        setCurrentOrg(null);
      }
    };
    fetchCurrentOrg();
  }, []);

  return (
    <AuthContext.Provider value={{ currentOrg, setCurrentOrg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
