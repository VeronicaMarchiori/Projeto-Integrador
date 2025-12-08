import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { GuardDashboard } from "./components/GuardDashboard";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        
        {/* Rota de Login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <AuthPage />} 
        />

        {/* Rota Dashboard Admin */}
        <Route
          path="/dashboard"
          element={
            user?.role === "admin" ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rota Dashboard Vigilante */}
        <Route
          path="/ronda"
          element={
            user?.role === "guard" ? (
              <GuardDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Home decide para onde mandar */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/ronda" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
