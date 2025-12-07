import { useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "guard";
  cpf: string;
}

const SESSION_KEY = "vigiasystem_session";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Falha ao fazer login" };
      }

      setUser(data);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));

      return { error: null };

    } catch (err: any) {
      return { error: err.message || "Erro na comunicação com servidor" };
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
