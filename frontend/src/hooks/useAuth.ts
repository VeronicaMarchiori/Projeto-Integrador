import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'guard';
  cpf: string;
  avatar?: string;
}

const SESSION_KEY = 'vigiasystem_session';
const TOKEN_KEY = 'vigiasystem_token';

const API_BASE_URL = 'http://localhost:3001';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (savedSession && savedToken) {
        const sessionUser = JSON.parse(savedSession);
        setUser(sessionUser);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.message || 'Email ou senha incorretos' };
      }

      if (result.success && result.data?.token) {
        const { token, usuario } = result.data;

        const userData: User = {
          id: usuario.idUsuario.toString(),
          name: usuario.nome,
          email: usuario.email,
          role: usuario.tipo === 'administrador' ? 'admin' : 'guard',
          cpf: usuario.cpf,
          avatar: usuario.foto || undefined,
        };

        // Salvar no localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

        setUser(userData);

        // 👇 AGORA RETORNA O userType NECESSÁRIO NO AuthPage
        return { error: null, userType: userData.role };
      }

      return { error: 'Resposta inválida do servidor' };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { error: error.message || 'Erro ao fazer login' };
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
