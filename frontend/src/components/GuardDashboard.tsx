import { useState, useEffect, useCallback } from 'react';
import { Play, MapPin, MessageSquare, AlertTriangle, Menu, ChevronRight, Clock, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { RouteDetails } from './RouteDetails';
import { GuardProfile } from './GuardProfile';
import { ClientSelection } from './ClientSelection';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/api';
import { mockRoutes } from '../utils/mockData';
import userAvatar from 'figma:asset/d63bbb04164cbfd88f680768bd7650b11073d372.png';

interface Route {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  nextCheckTime?: string;
  totalPoints?: number;
  completedPoints?: number;
  scheduleStart?: string;
  scheduleEnd?: string;
  daysOfWeek?: string[];
}

export function GuardDashboard() {
  const { user, signOut } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleShowProfile = useCallback(() => {
    setShowProfile(true);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      // Tentar carregar do backend
      const response = await apiClient.getRoutes();
      
      if (response?.routes && response.routes.length > 0) {
        setRoutes(response.routes);
      } else {
        // Usar dados mock se não houver rotas
        setRoutes(mockRoutes as any);
      }
    } catch (error) {
      // Em caso de erro (backend não disponível), usar dados mock
      console.log('Backend não disponível, usando dados mock para demonstração');
      setRoutes(mockRoutes as any);
    } finally {
      setLoading(false);
    }
  };

  const canStartRoute = (route: Route): boolean => {
    const now = new Date();
    const currentDay = now.getDay().toString();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Verificar dia da semana
    if (route.daysOfWeek && !route.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Verificar horário
    if (route.scheduleStart && route.scheduleEnd) {
      if (currentTime < route.scheduleStart || currentTime > route.scheduleEnd) {
        return false;
      }
    }

    return true;
  };

  const getRouteStatusInfo = (route: Route) => {
    if (route.status === 'completed') {
      return {
        label: 'Concluída',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle,
      };
    }
    if (route.status === 'in_progress') {
      return {
        label: `Faltam ${(route.totalPoints || 0) - (route.completedPoints || 0)} pontos`,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        icon: Clock,
      };
    }
    if (route.nextCheckTime) {
      return {
        label: `Faltam ${route.nextCheckTime} para começar`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Clock,
      };
    }
    return {
      label: 'Pronta para iniciar',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: Clock,
    };
  };

  if (selectedRoute) {
    return <RouteDetails route={selectedRoute} onBack={() => setSelectedRoute(null)} />;
  }

  if (showProfile) {
    return <GuardProfile onBack={() => setShowProfile(false)} />;
  }

  // Show client selection if no client is selected
  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-red-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex-shrink-0">
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-lg">{user?.name || 'Vigilante'}</p>
                <p className="text-sm opacity-90">{user?.role === 'guard' ? 'Vigia' : user?.role || 'Funcionário'}</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>

        <ClientSelection onSelectClient={(clientId) => {
          setSelectedClient(clientId);
          loadRoutes();
        }} />

        {/* Menu Dropdown */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)}>
            <div 
              className="absolute right-0 top-0 w-64 bg-white h-full shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <button 
                  onClick={handleShowProfile}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <User className="size-5 text-gray-600" />
                  <span>Perfil</span>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3">
                  <Menu className="size-5 text-gray-600" />
                  <span>Configurações</span>
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Deseja realmente sair?')) {
                      signOut();
                    }
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors flex items-center gap-3"
                >
                  <AlertTriangle className="size-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex-shrink-0">
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-lg">{user?.name || 'Vigilante'}</p>
              <p className="text-sm opacity-90">{user?.role === 'guard' ? 'Vigia' : user?.role || 'Funcionário'}</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      {/* Routes List */}
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedClient(null)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="size-5" />
          Voltar para empresas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Suas Rotas</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando rotas...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => {
              const statusInfo = getRouteStatusInfo(route);
              const canStart = canStartRoute(route);
              const StatusIcon = statusInfo.icon;

              return (
                <button
                  key={route.id}
                  onClick={() => canStart && setSelectedRoute(route)}
                  className={`w-full bg-white rounded-lg border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                    canStart 
                      ? 'border-gray-200 hover:border-red-300 cursor-pointer' 
                      : 'border-gray-100 opacity-60 cursor-not-allowed'
                  }`}
                  disabled={!canStart}
                >
                  <div className="flex items-center gap-4">
                    {/* Play Button */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        canStart ? 'bg-gray-900' : 'bg-gray-300'
                      }`}>
                        <Play className="size-6 text-white fill-white" />
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Rota {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`size-4 ${statusInfo.color}`} />
                        <p className={`text-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className={`size-6 ${canStart ? 'text-gray-400' : 'text-gray-300'}`} />
                  </div>
                </button>
              );
            })}

            {routes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <MapPin className="size-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-900 font-medium mb-1">Nenhuma rota disponível</p>
                <p className="text-sm text-gray-500">Entre em contato com o administrador</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 w-64 bg-white h-full shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <button 
                onClick={handleShowProfile}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <User className="size-5 text-gray-600" />
                <span>Perfil</span>
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3">
                <Menu className="size-5 text-gray-600" />
                <span>Configurações</span>
              </button>
              <button 
                onClick={() => {
                  if (confirm('Deseja realmente sair?')) {
                    signOut();
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <AlertTriangle className="size-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}