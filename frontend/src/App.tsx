import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { GuardDashboard } from './components/GuardDashboard';
import { Toaster } from './components/ui/sonner';

// Estamos utilizando um modo de desenvolvimento para poder mudar as páginas sem passar pela autenticação
// Opções: 'admin' | 'guard' | 'login' | null
// - 'admin': Ver Dashboard Admin (sem login)
// - 'guard': Ver Dashboard Vigilante (sem login)
// - 'login': Ver Tela de Login
// - null: Comportamento normal (requer autenticação)
const DEV_SCREEN = null;

export default function App() {
  const { user, loading } = useAuth();

  // BYPASS DE AUTENTICAÇÃO PARA O DESENVOLVIMENTO
  if (DEV_SCREEN === 'admin') {
    return (
      <>
        <Dashboard />
        <Toaster position="top-right" />
      </>
    );
  }

  if (DEV_SCREEN === 'guard') {
    return (
      <>
        <GuardDashboard />
        <Toaster position="top-right" />
      </>
    );
  }

  if (DEV_SCREEN === 'login') {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" />
      </>
    );
  }

  // COMPORTAMENTO NORMAL (quando DEV_SCREEN = null)
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

  // O código renderiza a página condicionalmente, ou seja, se for Administrador renderiza de um jeito, se for vigilante renderiza de outro.
  // Nós escolhemos isso por conta do processamento, isso ajuda a economizar e deixa o app mais leve para sistemas menos robustos.
  if (!user) {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" />
      </>
    );
  }

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
