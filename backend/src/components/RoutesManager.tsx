import { useState, useEffect } from 'react';
import { 
  MapPin, 
  QrCode, 
  Image, 
  Trash2, 
  Clock, 
  Edit2, 
  Eye, 
  AlertCircle, 
  Plus, 
  Route as RouteIcon,
  Users,
  UserCheck,
  Building,
  Navigation,
  ClipboardCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { GuardProfileModal } from './GuardProfileModal';
import { apiClient } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { mockRoutes, mockEstablishments, mockEmployees, getEmployeeName } from '../utils/mockData';

interface RoutePoint {
  id: string;
  name: string;
  type: 'qrcode' | 'photo';
  latitude?: number;
  longitude?: number;
  qrCode?: string;
  order: number;
}

interface Route {
  id: string;
  name: string;
  establishmentId: string;
  type: 'internal' | 'external' | 'supervision';
  points: RoutePoint[];
  scheduleStart?: string;
  scheduleEnd?: string;
  daysOfWeek?: string[];
  assignedGuards?: string[];
}

export function RoutesManager() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedGuard, setSelectedGuard] = useState<any | null>(null);
  
  const [formData, setFormData] = useState<Partial<Route>>({
    name: '',
    establishmentId: '',
    type: 'internal',
    points: [],
    scheduleStart: '',
    scheduleEnd: '',
    daysOfWeek: ['0', '1', '2', '3', '4', '5', '6'],
    assignedGuards: [],
  });

  const [pointForm, setPointForm] = useState<Partial<RoutePoint>>({
    name: '',
    type: 'qrcode',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar dados da API (com fallback para mock)
      const [routesData, establishmentsData, employeesData] = await Promise.all([
        apiClient.getRoutes().catch(() => ({ routes: [] })),
        apiClient.getEstablishments().catch(() => ({ establishments: [] })),
        apiClient.getEmployees().catch(() => ({ employees: [] })),
      ]);
      
      // Usar dados mock se a API não retornar dados
      const apiRoutes = routesData.routes || [];
      const apiEstablishments = establishmentsData.establishments || [];
      const apiEmployees = employeesData.employees || [];
      
      setRoutes(apiRoutes.length > 0 ? apiRoutes : mockRoutes);
      setEstablishments(apiEstablishments.length > 0 ? apiEstablishments : mockEstablishments);
      setEmployees(apiEmployees.length > 0 ? apiEmployees : mockEmployees);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback para dados mock em caso de erro
      setRoutes(mockRoutes);
      setEstablishments(mockEstablishments);
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  };

  const addPoint = () => {
    if (!pointForm.name) return;
    
    const newPoint: RoutePoint = {
      id: crypto.randomUUID(),
      name: pointForm.name!,
      type: pointForm.type!,
      order: (formData.points?.length || 0) + 1,
      ...(pointForm.type === 'qrcode' && { qrCode: crypto.randomUUID() }),
      latitude: pointForm.latitude,
      longitude: pointForm.longitude,
    };

    setFormData({
      ...formData,
      points: [...(formData.points || []), newPoint],
    });

    setPointForm({ name: '', type: 'qrcode' });
  };

  const removePoint = (pointId: string) => {
    setFormData({
      ...formData,
      points: formData.points?.filter(p => p.id !== pointId),
    });
  };

  const deleteRoute = async (routeId: string) => {
    if (!confirm('Deseja realmente excluir esta rota?')) return;
    
    try {
      await apiClient.deleteRoute(routeId);
      setRoutes(routes.filter(r => r.id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { route } = await apiClient.createRoute(formData);
      setRoutes([...routes, route]);
      setDialogOpen(false);
      setFormData({ name: '', establishmentId: '', type: 'internal', points: [] });
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      internal: 'Interna',
      external: 'Externa',
      supervision: 'Supervisão',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPointTypeIcon = (type: string) => {
    switch (type) {
      case 'qrcode':
        return <QrCode className="size-4" />;
      case 'photo':
        return <Image className="size-4" />;
      default:
        return <QrCode className="size-4" />;
    }
  };

  // Verificar se usuário tem permissão
  const canManageRoutes = user?.role === 'admin' || user?.role === 'supervisor';

  const daysOfWeekOptions = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Segunda' },
    { value: '2', label: 'Terça' },
    { value: '3', label: 'Quarta' },
    { value: '4', label: 'Quinta' },
    { value: '5', label: 'Sexta' },
    { value: '6', label: 'Sábado' },
  ];

  const toggleDayOfWeek = (day: string) => {
    const current = formData.daysOfWeek || [];
    if (current.includes(day)) {
      setFormData({ ...formData, daysOfWeek: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, daysOfWeek: [...current, day] });
    }
  };

  if (loading) {
    return <div>Carregando rotas...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Rotas</h2>
          <p className="text-gray-600">
            {canManageRoutes 
              ? 'Visualize, configure e atribua vigilantes às rotas de ronda' 
              : 'Visualize as rotas cadastradas pelos administradores'}
          </p>
        </div>
        {canManageRoutes && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="size-4 mr-2" />
                Nova Rota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Rota</DialogTitle>
                <DialogDescription>Configure os pontos de verificação e horários para esta rota.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Rota *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Ronda Noturna - Bloco A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishment">Estabelecimento *</Label>
                    <Select
                      value={formData.establishmentId}
                      onValueChange={(value) => setFormData({ ...formData, establishmentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {establishments.map((est) => (
                          <SelectItem key={est.id} value={est.id}>
                            {est.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Route Type Section */}
                  <div className="border-t pt-4">
                    <div className="mb-3">
                      <Label className="text-base">Tipo de Ronda *</Label>
                      <p className="text-sm text-gray-600 mt-1">Selecione o tipo de verificação que será realizada</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'internal' })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.type === 'internal'
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className={`p-2 rounded-lg ${
                            formData.type === 'internal' ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <Building className={`size-6 ${
                              formData.type === 'internal' ? 'text-primary-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              formData.type === 'internal' ? 'text-primary-700' : 'text-gray-900'
                            }`}>
                              Interna
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Dentro do estabelecimento</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'external' })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.type === 'external'
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className={`p-2 rounded-lg ${
                            formData.type === 'external' ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <Navigation className={`size-6 ${
                              formData.type === 'external' ? 'text-primary-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              formData.type === 'external' ? 'text-primary-700' : 'text-gray-900'
                            }`}>
                              Externa
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Perímetro externo</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'supervision' })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.type === 'supervision'
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className={`p-2 rounded-lg ${
                            formData.type === 'supervision' ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <ClipboardCheck className={`size-6 ${
                              formData.type === 'supervision' ? 'text-primary-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              formData.type === 'supervision' ? 'text-primary-700' : 'text-gray-900'
                            }`}>
                              Supervisão
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Verificação geral</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Schedule Section */}
                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Horário de Funcionamento</h3>
                      <p className="text-sm text-gray-600">Defina quando os vigilantes podem executar esta ronda</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="scheduleStart">Horário de Início *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="scheduleStart"
                            type="time"
                            value={formData.scheduleStart}
                            onChange={(e) => setFormData({ ...formData, scheduleStart: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scheduleEnd">Horário de Término *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="scheduleEnd"
                            type="time"
                            value={formData.scheduleEnd}
                            onChange={(e) => setFormData({ ...formData, scheduleEnd: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Dias da Semana *</Label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeekOptions.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDayOfWeek(day.value)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              formData.daysOfWeek?.includes(day.value)
                                ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assigned Guards Section */}
                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <Users className="size-5 text-green-600" />
                        Vigilantes Responsáveis
                      </h3>
                      <p className="text-sm text-gray-600">Selecione os vigilantes que poderão executar esta rota</p>
                    </div>

                    <div className="space-y-3">
                      {employees.filter(emp => emp.role === 'guard' && emp.status === 'active').length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                          {employees
                            .filter(emp => emp.role === 'guard' && emp.status === 'active')
                            .map((guard) => (
                              <label
                                key={guard.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                  formData.assignedGuards?.includes(guard.id)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <Checkbox
                                  checked={formData.assignedGuards?.includes(guard.id)}
                                  onCheckedChange={(checked) => {
                                    const current = formData.assignedGuards || [];
                                    if (checked) {
                                      setFormData({
                                        ...formData,
                                        assignedGuards: [...current, guard.id],
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        assignedGuards: current.filter((id) => id !== guard.id),
                                      });
                                    }
                                  }}
                                />
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                  {guard.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{guard.name}</p>
                                  <p className="text-xs text-gray-500">{guard.email}</p>
                                </div>
                              </label>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <UserCheck className="size-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Nenhum vigilante ativo disponível</p>
                          <p className="text-xs">Cadastre vigilantes primeiro</p>
                        </div>
                      )}
                      
                      {formData.assignedGuards && formData.assignedGuards.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
                          <UserCheck className="size-4" />
                          <span className="font-medium">
                            {formData.assignedGuards.length} vigilante(s) selecionado(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkpoint Section */}
                <div className="border-t pt-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">Pontos de Verificação</h3>
                    <p className="text-sm text-gray-600">Adicione os pontos que devem ser verificados durante a ronda</p>
                  </div>
                  
                  {/* Add Point Form */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
                    <div className="grid grid-cols-[1fr,200px,auto] gap-2">
                      <Input
                        placeholder="Nome do ponto (Ex: Portaria Principal)"
                        value={pointForm.name}
                        onChange={(e) => setPointForm({ ...pointForm, name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPoint())}
                      />
                      <Select
                        value={pointForm.type}
                        onValueChange={(value: any) => setPointForm({ ...pointForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qrcode">
                            <div className="flex items-center gap-2">
                              <QrCode className="size-4" />
                              QR Code
                            </div>
                          </SelectItem>
                          <SelectItem value="photo">
                            <div className="flex items-center gap-2">
                              <Image className="size-4" />
                              Foto
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={addPoint} className="bg-primary-600 hover:bg-primary-700">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    
                    {/* Coordenadas GPS */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Latitude (opcional)</Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Ex: -23.550520"
                          value={pointForm.latitude || ''}
                          onChange={(e) => setPointForm({ ...pointForm, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Longitude (opcional)</Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Ex: -46.633308"
                          value={pointForm.longitude || ''}
                          onChange={(e) => setPointForm({ ...pointForm, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-primary-50 border border-primary-200 p-2 rounded">
                      <MapPin className="size-3 text-primary-600" />
                      <span>As coordenadas GPS permitem mostrar o mapa e navegação para o vigilante</span>
                    </div>
                  </div>

                  {/* Points List */}
                  <div className="space-y-2">
                    {formData.points && formData.points.length > 0 ? (
                      formData.points.map((point, index) => (
                        <div key={point.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2 text-primary-600">
                            {getPointTypeIcon(point.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{point.name}</p>
                            <p className="text-sm text-gray-500">
                              {point.type === 'qrcode' && 'Verificação por QR Code'}
                              {point.type === 'photo' && 'Verificação por Foto'}
                            </p>
                            {point.latitude && point.longitude && (
                              <p className="text-xs text-gray-400 font-mono mt-1">
                                📍 {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removePoint(point.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <MapPin className="size-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Nenhum ponto adicionado</p>
                        <p className="text-xs">Use o formulário acima para adicionar pontos</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary-600 hover:bg-primary-700" 
                    disabled={!formData.points?.length || !formData.name || !formData.establishmentId || !formData.scheduleStart || !formData.scheduleEnd}
                  >
                    Cadastrar Rota
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Permission Warning for Guards */}
      {!canManageRoutes && (
        <div className="flex items-center gap-3 text-blue-700 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <AlertCircle className="size-5" />
          <div>
            <p className="font-medium">Acesso Restrito</p>
            <p className="text-sm">Apenas administradores e supervisores podem cadastrar e editar rotas.</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando rotas...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Routes Grid */}
          <div className="grid gap-4">
            {routes.map((route) => {
              const establishment = establishments.find(e => e.id === route.establishmentId);
              return (
                <div key={route.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                        <RouteIcon className="size-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{route.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{establishment?.name || 'Estabelecimento não encontrado'}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                            {getTypeLabel(route.type)}
                          </span>
                          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {route.points?.length || 0} pontos
                          </span>
                          {route.scheduleStart && route.scheduleEnd && (
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 flex items-center gap-1">
                              <Clock className="size-3" />
                              {route.scheduleStart} - {route.scheduleEnd}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoute(route);
                          setViewDialogOpen(true);
                        }}
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye className="size-4 text-primary-600" />
                      </button>
                      {canManageRoutes && (
                        <>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="size-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => deleteRoute(route.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Points Preview */}
                  {route.points && route.points.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Pontos de Verificação:</p>
                      <div className="flex flex-wrap gap-2">
                        {route.points.slice(0, 4).map((point, idx) => (
                          <div key={point.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <span className="text-xs text-gray-500">{idx + 1}.</span>
                            {getPointTypeIcon(point.type)}
                            <span className="text-sm text-gray-700">{point.name}</span>
                          </div>
                        ))}
                        {route.points.length > 4 && (
                          <div className="flex items-center bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-200">
                            <span className="text-sm text-primary-700 font-medium">
                              +{route.points.length - 4} mais
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assigned Guards Preview */}
                  {route.assignedGuards && route.assignedGuards.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="size-4 text-green-600" />
                          Vigias Atribuídos
                        </p>
                        <span className="text-xs text-gray-500">{route.assignedGuards.length} vigia(s)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {route.assignedGuards.slice(0, 3).map((guardId) => {
                          const guard = employees.find(e => e.id === guardId);
                          return guard ? (
                            <button
                              key={guardId}
                              onClick={() => setSelectedGuard(guard)}
                              className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors cursor-pointer"
                            >
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                {guard.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-green-900">{guard.name}</span>
                            </button>
                          ) : null;
                        })}
                        {route.assignedGuards.length > 3 && (
                          <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <span className="text-sm text-green-700 font-medium">
                              +{route.assignedGuards.length - 3} mais
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {routes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <RouteIcon className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-900 font-medium mb-1">Nenhuma rota cadastrada</p>
              <p className="text-sm text-gray-500">
                {canManageRoutes 
                  ? 'Clique em "Nova Rota" para começar' 
                  : 'Aguarde o administrador cadastrar rotas'}
              </p>
            </div>
          )}
        </>
      )}

      {/* View Route Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Rota</DialogTitle>
            <DialogDescription>Visualize os detalhes da rota selecionada.</DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{selectedRoute.name}</h3>
                <p className="text-sm text-gray-600">
                  {establishments.find(e => e.id === selectedRoute.establishmentId)?.name}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
                  {getTypeLabel(selectedRoute.type)}
                </span>
                {selectedRoute.scheduleStart && selectedRoute.scheduleEnd && (
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 flex items-center gap-2">
                    <Clock className="size-4" />
                    {selectedRoute.scheduleStart} - {selectedRoute.scheduleEnd}
                  </span>
                )}
              </div>

              {selectedRoute.daysOfWeek && selectedRoute.daysOfWeek.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Dias Permitidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.daysOfWeek.map((day) => {
                      const dayLabel = daysOfWeekOptions.find(d => d.value === day)?.label;
                      return (
                        <span key={day} className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                          {dayLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Assigned Guards Section */}
              {selectedRoute.assignedGuards && selectedRoute.assignedGuards.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="size-5 text-green-700" />
                    <p className="text-sm font-medium text-green-900">Vigias Atribuídos ({selectedRoute.assignedGuards.length})</p>
                  </div>
                  <div className="space-y-2">
                    {selectedRoute.assignedGuards.map((guardId) => {
                      const guard = employees.find(e => e.id === guardId);
                      return guard ? (
                        <div key={guardId} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-medium">
                            {guard.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{guard.name}</p>
                            <p className="text-sm text-gray-600">{guard.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                              Ativo
                            </span>
                            {guard.phone && (
                              <span className="text-xs text-gray-500">{guard.phone}</span>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Pontos de Verificação ({selectedRoute.points?.length || 0})</h4>
                <div className="space-y-2">
                  {selectedRoute.points?.map((point, index) => (
                    <div key={point.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 text-primary-600">
                        {getPointTypeIcon(point.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{point.name}</p>
                        <p className="text-sm text-gray-500">
                          {point.type === 'qrcode' && `QR Code: ${point.qrCode?.slice(0, 8)}...`}
                          {point.type === 'photo' && 'Verificação por Foto'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Guard Profile Modal */}
      {selectedGuard && (
        <GuardProfileModal
          guard={selectedGuard}
          onClose={() => setSelectedGuard(null)}
        />
      )}
    </div>
  );
}