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

// Configuração da API
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
      // ========== CHAMAR BACKEND DE LOGIN ==========
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Email ou senha incorretos' };
      }

      const result = await response.json();

      // Backend retorna: { success: true, data: { token, usuario: {...} } }
      if (result.success && result.data && result.data.token) {
        const { token, usuario } = result.data;

        // Mapear dados do backend para o formato do frontend
        const userData: User = {
          id: usuario.idUsuario.toString(),
          name: usuario.nome,
          email: usuario.email,
          role: usuario.tipo === 'administrador' ? 'admin' : 'guard',
          cpf: usuario.cpf,
          avatar: usuario.foto || undefined,
        };

        // ========== SALVAR TOKEN E USUÁRIO ==========
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        setUser(userData);

        return { error: null };
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