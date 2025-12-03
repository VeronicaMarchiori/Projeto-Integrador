import { useState } from 'react';
import { 
  Users, 
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  Clock,
  UserPlus,
  Building2,
  Route,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { EmployeesManager } from './EmployeesManager';
import { ReportsManager } from './ReportsManager';
import { CreateGuardForm } from './CreateGuardForm';
import { ClientsManager } from './ClientsManager';
import { RoutesManager } from './RoutesManager';

type MenuOption = 'employees' | 'reports' | 'create-guard' | 'clients' | 'routes';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<MenuOption>('employees');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'employees' as MenuOption, label: 'Gerenciar Funcionários', icon: Users },
    { id: 'create-guard' as MenuOption, label: 'Criar Novo Funcionário', icon: UserPlus },
    { id: 'clients' as MenuOption, label: 'Gerenciar Clientes', icon: Building2 },
    { id: 'routes' as MenuOption, label: 'Gerenciar Rotas', icon: Route },
    { id: 'reports' as MenuOption, label: 'Relatórios das Rondas', icon: FileText },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'employees':
        return <EmployeesManager onNavigateToCreate={() => setCurrentView('create-guard')} />;
      case 'create-guard':
        return <CreateGuardForm />;
      case 'clients':
        return <ClientsManager />;
      case 'routes':
        return <RoutesManager />;
      case 'reports':
        return <ReportsManager />;
      default:
        return <EmployeesManager onNavigateToCreate={() => setCurrentView('create-guard')} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-primary-700 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-primary-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-primary-600 rounded p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-primary-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{user?.name}</p>
                <p className="truncate text-sm text-primary-200">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors mb-1 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-100 hover:bg-primary-600/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-primary-600 p-3">
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-primary-100 hover:bg-primary-600/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === currentView)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{renderContent()}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}