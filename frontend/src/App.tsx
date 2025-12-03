import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { GuardDashboard } from './components/GuardDashboard';
import { Toaster } from './components/ui/sonner';

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

  if (!user) {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" />
      </>
    );
  }

  // Se for vigilante, mostrar dashboard específico
  if (user.role === 'guard') {
    return (
      <>
        <GuardDashboard />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <Dashboard />
      <Toaster position="top-right" />
    </>
  );
}
