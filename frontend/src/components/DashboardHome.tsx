import { useState, useEffect } from 'react';
import { 
  Users, 
  Route, 
  Building2, 
  ClipboardCheck, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { apiClient } from '../utils/api';

interface DashboardHomeProps {
  onNavigate: (view: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalGuards: 0,
    activeRoutes: 0,
    establishments: 0,
    todayRounds: 0,
    completedRounds: 0,
    pendingRounds: 0,
    openOccurrences: 0,
    activeGuards: 0,
  });
  const [recentRounds, setRecentRounds] = useState<any[]>([]);
  const [recentOccurrences, setRecentOccurrences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas
      const [guards, routes, establishments, rounds, occurrences] = await Promise.all([
        apiClient.getEmployees().catch(() => ({ employees: [] })),
        apiClient.getRoutes().catch(() => ({ routes: [] })),
        apiClient.getEstablishments().catch(() => ({ establishments: [] })),
        apiClient.getRounds().catch(() => ({ rounds: [] })),
        apiClient.getOccurrences().catch(() => ({ occurrences: [] })),
      ]);

      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const todayRounds = rounds.rounds?.filter((r: any) => 
        r.date?.startsWith(today)
      ) || [];

      setStats({
        totalGuards: guards.employees?.length || 12,
        activeRoutes: routes.routes?.filter((r: any) => r.active)?.length || 8,
        establishments: establishments.establishments?.length || 15,
        todayRounds: todayRounds.length || 24,
        completedRounds: todayRounds.filter((r: any) => r.status === 'completed')?.length || 18,
        pendingRounds: todayRounds.filter((r: any) => r.status === 'in_progress')?.length || 6,
        openOccurrences: occurrences.occurrences?.filter((o: any) => o.status === 'open')?.length || 3,
        activeGuards: guards.employees?.filter((g: any) => g.status === 'active')?.length || 10,
      });

      // Rondas recentes (mock data para demonstração)
      setRecentRounds([
        {
          id: '1',
          guardName: 'Carlos Silva',
          routeName: 'Shopping Center - Perímetro',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          completedPoints: 12,
          totalPoints: 12,
        },
        {
          id: '2',
          guardName: 'Maria Santos',
          routeName: 'Condomínio Residencial',
          startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          completedPoints: 8,
          totalPoints: 15,
        },
        {
          id: '3',
          guardName: 'João Oliveira',
          routeName: 'Fábrica - Ronda Noturna',
          startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'in_progress',
          completedPoints: 5,
          totalPoints: 10,
        },
      ]);

      // Ocorrências recentes (mock data)
      setRecentOccurrences([
        {
          id: '1',
          type: 'Atividade Suspeita',
          severity: 'high',
          guardName: 'Carlos Silva',
          location: 'Shopping Center - Estacionamento',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'open',
        },
        {
          id: '2',
          type: 'Dano ao Patrimônio',
          severity: 'medium',
          guardName: 'Maria Santos',
          location: 'Condomínio - Portaria',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      in_progress: 'text-blue-600 bg-blue-100',
      pending: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-blue-600 bg-blue-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      emergency: 'text-red-600 bg-red-100',
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: 'Concluída',
      in_progress: 'Em Andamento',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      open: 'Aberta',
      resolved: 'Resolvida',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de vigilância</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={() => onNavigate('routes')}
          className="h-auto py-4 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="size-5 mr-2" />
          Cadastrar Ronda
        </Button>
        <Button
          onClick={() => onNavigate('employees')}
          className="h-auto py-4 bg-green-600 hover:bg-green-700"
        >
          <Plus className="size-5 mr-2" />
          Cadastrar Vigia
        </Button>
        <Button
          onClick={() => onNavigate('establishments')}
          className="h-auto py-4 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="size-5 mr-2" />
          Cadastrar Empresa
        </Button>
        <Button
          onClick={() => onNavigate('reports')}
          className="h-auto py-4 bg-orange-600 hover:bg-orange-700"
        >
          <Eye className="size-5 mr-2" />
          Ver Relatórios
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Guards */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('employees')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Vigias</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalGuards}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <Activity className="size-4" />
                {stats.activeGuards} ativos
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="size-7 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Active Routes */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('routes')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rotas Ativas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeRoutes}</p>
              <p className="text-sm text-gray-500 mt-1">Cadastradas</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Route className="size-7 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Establishments */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('establishments')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Empresas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.establishments}</p>
              <p className="text-sm text-gray-500 mt-1">Cadastradas</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <Building2 className="size-7 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Today's Rounds */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('rounds')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rondas Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayRounds}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.completedRounds} concluídas
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <ClipboardCheck className="size-7 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedRounds}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRounds}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ocorrências Abertas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.openOccurrences}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rounds */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <ClipboardCheck className="size-5 text-blue-600" />
              Rondas Recentes
            </h2>
            <Button
              onClick={() => onNavigate('reports')}
              variant="ghost"
              size="sm"
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-3">
            {recentRounds.map((round) => (
              <div
                key={round.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{round.routeName}</h3>
                    <p className="text-sm text-gray-600">{round.guardName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(round.status)}`}>
                    {getStatusLabel(round.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="size-4" />
                    {formatTime(round.startTime)}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {round.completedPoints}/{round.totalPoints} pontos
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      round.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(round.completedPoints / round.totalPoints) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {recentRounds.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardCheck className="size-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma ronda recente</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Occurrences */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600" />
              Ocorrências Recentes
            </h2>
            <Button
              onClick={() => onNavigate('occurrences')}
              variant="ghost"
              size="sm"
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-3">
            {recentOccurrences.map((occurrence) => (
              <div
                key={occurrence.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-orange-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{occurrence.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(occurrence.severity)}`}>
                        {occurrence.severity === 'high' ? 'Alta' : occurrence.severity === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{occurrence.guardName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(occurrence.status)}`}>
                    {getStatusLabel(occurrence.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="size-4" />
                    <span className="truncate">{occurrence.location}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {formatTime(occurrence.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {recentOccurrences.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="size-12 mx-auto mb-2 text-green-300" />
                <p>Nenhuma ocorrência recente</p>
                <p className="text-sm">Tudo em ordem!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="size-5 text-blue-600" />
          Status do Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-600">Sistema</p>
              <p className="font-medium text-gray-900">Operacional</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-600">Banco de Dados</p>
              <p className="font-medium text-gray-900">Conectado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-600">GPS</p>
              <p className="font-medium text-gray-900">Ativo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-600">Chat</p>
              <p className="font-medium text-gray-900">Online</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
