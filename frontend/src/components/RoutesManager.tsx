import { useState, useEffect } from 'react';
import {
  MapPin,
  QrCode,
  Image as ImageIcon,
  Trash2,
  Clock,
  Edit2,
  Eye,
  AlertCircle,
  Plus,
  Route as RouteIcon,
  Users,
  UserCheck,
  Building2,
  Navigation,
  ClipboardCheck,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../hooks/useAuth';

// ========== INTERFACES ==========
interface PontoRonda {
  idPonto?: number;
  nome: string;
  tipo: 'qrcode' | 'photo';
  latitude?: number;
  longitude?: number;
  qrCode?: string;
  ordem: number;
}

interface Ronda {
  idRonda?: number;
  nome: string;
  idCliente: number;
  tipo: 'interna' | 'externa' | 'supervisao';
  horarioInicio?: string;
  horarioFim?: string;
  diasSemana?: string[];
  vigias?: number[]; // IDs dos vigias
  pontos?: PontoRonda[];
  createdAt?: string;
  // Dados relacionados que vêm do backend
  Empresa?: { nomeEmpresa?: string; nome?: string; nomeFantasia?: string };
  PontosRonda?: any[];
  RondaVigias?: any[];
}

interface Cliente {
  idCliente: number;
  nomeEmpresa: string;
  cnpj: string;
  totalRondas?: number;
}

interface Vigia {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: boolean;
}

// ========== CONFIGURAÇÃO DO BACKEND ==========
const API_BASE_URL = 'http://localhost:3001';
const API_RONDAS = `${API_BASE_URL}/rondas`;
const API_PONTOS_RONDA = `${API_BASE_URL}/pontos-ronda`;
const API_PERCURSOS = `${API_BASE_URL}/percursos`;
const API_EMPRESAS = `${API_BASE_URL}/empresas`; 
const API_VIGIAS = `${API_BASE_URL}/vigias`;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('vigiasystem_token')}`,
});

export function RoutesManager() {
  const { user } = useAuth(); // Pegar usuário logado
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vigias, setVigias] = useState<Vigia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRonda, setSelectedRonda] = useState<Ronda | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');

  const [formData, setFormData] = useState<Ronda>({
    nome: '',
    idCliente: 0,
    tipo: 'interna',
    horarioInicio: '',
    horarioFim: '',
    diasSemana: ['0', '1', '2', '3', '4', '5', '6'],
    vigias: [],
    pontos: [],
  });

  const [pontoForm, setPontoForm] = useState<Partial<PontoRonda>>({
    nome: '',
    tipo: 'qrcode',
  });

  useEffect(() => {
    loadData();
  }, []);

  // ========== CARREGAR DADOS DO BACKEND ==========
  const loadData = async () => {
    try {
      const [rondasRes, clientesRes, vigiasRes] = await Promise.all([
        fetch(API_RONDAS, { headers: getAuthHeaders() }),
        fetch(API_EMPRESAS, { headers: getAuthHeaders() }), 
        fetch(API_VIGIAS, { headers: getAuthHeaders() }),
      ]);

      if (rondasRes.ok) {
        const rondasData = await rondasRes.json();
        console.log('📥 Rondas carregadas:', rondasData.data);
        
        // Log detalhado de cada ronda
        if (rondasData.data && rondasData.data.length > 0) {
          console.log('🔍 Primeira ronda completa:', rondasData.data[0]);
          console.log('📊 Tipos de rondas:', rondasData.data.map((r: any) => ({ 
            nome: r.nome, 
            tipo: r.tipo,
            pontos: r.pontos?.length || r.PontosRonda?.length || 0,
            vigias: r.vigias?.length || r.RondaVigias?.length || 0
          })));
        }
        
        setRondas(rondasData.data || []);
      }

      if (clientesRes.ok) {
        const clientesData = await clientesRes.json();
        console.log('🏢 Dados brutos das empresas:', clientesData.data);
        
        const clientesComRondas = (clientesData.data || []).map((empresa: any) => {
          return {
            idCliente: empresa.idEmpresa,
            nomeEmpresa: empresa.nomeEmpresa || empresa.nome || empresa.nomeFantasia,
            cnpj: empresa.cnpj,
            totalRondas: 0, // Será calculado depois
          };
        });
        
        console.log('✅ Clientes mapeados:', clientesComRondas);
        setClientes(clientesComRondas);
      }

      if (vigiasRes.ok) {
        const vigiasData = await vigiasRes.json();
        console.log('👮 Vigias carregados:', vigiasData.data);
        const mappedVigias = (vigiasData.data || []).map((vigia: any) => ({
          idUsuario: vigia.idUsuario,
          nome: vigia.Usuario?.nome || vigia.nome,
          email: vigia.Usuario?.email || vigia.email,
          ativo: vigia.Usuario?.ativo !== undefined ? vigia.Usuario.ativo : true,
        }));
        console.log('✅ Vigias mapeados:', mappedVigias);
        setVigias(mappedVigias);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // ========== CARREGAR DETALHES COMPLETOS DA RONDA ==========
  const loadRondaDetails = async (idRonda: number) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`${API_RONDAS}/${idRonda}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes da ronda');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('📥 Detalhes completos da ronda:', result.data);
        setSelectedRonda(result.data);
        setViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading ronda details:', error);
      toast.error('Erro ao carregar detalhes da ronda');
    } finally {
      setLoadingDetails(false);
    }
  };

  // ========== ADICIONAR PONTO À RONDA ==========
  const addPonto = () => {
    if (!pontoForm.nome) return;

    const novoPonto: PontoRonda = {
      nome: pontoForm.nome!,
      tipo: pontoForm.tipo!,
      ordem: (formData.pontos?.length || 0) + 1,
      ...(pontoForm.tipo === 'qrcode' && { qrCode: crypto.randomUUID() }),
      latitude: pontoForm.latitude,
      longitude: pontoForm.longitude,
    };

    setFormData({
      ...formData,
      pontos: [...(formData.pontos || []), novoPonto],
    });

    setPontoForm({ nome: '', tipo: 'qrcode' });
  };

  // ========== REMOVER PONTO ==========
  const removePonto = (index: number) => {
    setFormData({
      ...formData,
      pontos: formData.pontos?.filter((_, i) => i !== index),
    });
  };

  // ========== CRIAR RONDA ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || formData.idCliente === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.pontos || formData.pontos.length === 0) {
      toast.error('Adicione pelo menos um ponto de verificação');
      return;
    }

    if (!user || !user.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const payload = {
        nome: formData.nome,
        idEmpresa: formData.idCliente,
        fk_Empresa_idEmpresa: formData.idCliente,
        idAdministrador: user.id,
        fk_Administrador_idUsuario: user.id,
        tipo: formData.tipo,
        horarioInicio: formData.horarioInicio || null,
        horarioFim: formData.horarioFim || null,
        diasSemana: formData.diasSemana || [],
        vigias: formData.vigias || [],
        pontos: formData.pontos || [],
      };

      console.log('📤 Enviando payload completo:', payload);
      console.log('📍 Pontos a serem criados:', payload.pontos);
      console.log('👥 Vigias a serem associados:', payload.vigias);
      console.log('📅 Dias da semana:', payload.diasSemana);
      console.log('🕐 Horários:', {
        inicio: payload.horarioInicio,
        fim: payload.horarioFim,
      });

      const response = await fetch(API_RONDAS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro do servidor:', errorData);
        throw new Error(errorData.message || 'Erro ao criar ronda');
      }

      const result = await response.json();
      console.log('✅ Resposta do servidor:', result);
      console.log('📊 Dados da ronda criada:', result.data);

      if (result.success && result.data) {
        // Verificar se os pontos foram criados
        const pontosCount = result.data.pontos?.length || result.data.PontosRonda?.length || 0;
        const vigiasCount = result.data.vigias?.length || result.data.RondaVigias?.length || 0;
        
        console.log(`✅ Ronda criada com ${pontosCount} pontos e ${vigiasCount} vigias`);
        
        if (pontosCount === 0 && formData.pontos.length > 0) {
          console.warn('⚠️ AVISO: Pontos foram enviados mas não foram criados no backend!');
          toast.error('Ronda criada, mas os pontos não foram registrados. Verifique o backend.');
        }
        
        setRondas([result.data, ...rondas]);
        toast.success('Ronda criada com sucesso!');
        setDialogOpen(false);
        setFormData({
          nome: '',
          idCliente: 0,
          tipo: 'interna',
          horarioInicio: '',
          horarioFim: '',
          diasSemana: ['0', '1', '2', '3', '4', '5', '6'],
          vigias: [],
          pontos: [],
        });
        loadData(); // Recarregar dados
      }
    } catch (error: any) {
      console.error('❌ Error creating ronda:', error);
      toast.error(error.message || 'Erro ao criar ronda');
    }
  };

  // ========== DELETAR RONDA ==========
  const deleteRonda = async (idRonda: number) => {
    if (!confirm('ATENÇÃO: Deseja realmente DELETAR permanentemente esta ronda?\n\nEsta ação NÃO PODE ser desfeita!')) {
      return;
    }

    try {
      const response = await fetch(`${API_RONDAS}/${idRonda}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar ronda');
      }

      setRondas(rondas.filter((r) => r.idRonda !== idRonda));
      toast.success('Ronda deletada com sucesso!');
    } catch (error: any) {
      console.error('Error deleting ronda:', error);
      toast.error(error.message || 'Erro ao deletar ronda');
    }
  };

  // ========== HELPERS ==========
  const getTipoLabel = (tipo: string) => {
    const labels = {
      interna: 'Interna',
      externa: 'Externa',
      supervisao: 'Supervisão',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      interna: 'bg-blue-100 text-blue-700 border-blue-200',
      externa: 'bg-green-100 text-green-700 border-green-200',
      supervisao: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[tipo as keyof typeof colors] || '';
  };

  const getPontoTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'qrcode':
        return <QrCode className="size-4" />;
      case 'photo':
        return <ImageIcon className="size-4" />;
      default:
        return <QrCode className="size-4" />;
    }
  };

  const getClienteNome = (idCliente: number) => {
    const cliente = clientes.find((c) => c.idCliente === idCliente);
    return cliente?.nomeEmpresa || 'Cliente não encontrado';
  };

  // ========== OBTER DADOS DA RONDA (com fallback para dados relacionados) ==========
  const getRondaPontos = (ronda: Ronda) => {
    // Tentar pegar dos relacionamentos primeiro
    if (ronda.PontosRonda && ronda.PontosRonda.length > 0) {
      return ronda.PontosRonda;
    }
    // Fallback para o array direto
    return ronda.pontos || [];
  };

  const getRondaVigias = (ronda: Ronda) => {
    // Tentar pegar dos relacionamentos primeiro
    if (ronda.RondaVigias && ronda.RondaVigias.length > 0) {
      return ronda.RondaVigias.map((rv: any) => rv.idVigia || rv.Vigia?.idUsuario).filter(Boolean);
    }
    // Fallback para o array direto
    return ronda.vigias || [];
  };

  const getRondaEmpresa = (ronda: Ronda) => {
    // Tentar pegar do relacionamento primeiro
    if (ronda.Empresa) {
      return ronda.Empresa.nomeEmpresa || ronda.Empresa.nome || ronda.Empresa.nomeFantasia || getClienteNome(ronda.idCliente);
    }
    // Fallback para buscar na lista de clientes
    return getClienteNome(ronda.idCliente);
  };

  const getVigiaNome = (idVigia: number) => {
    const vigia = vigias.find((v) => v.idUsuario === idVigia);
    return vigia?.nome || `Vigia #${idVigia}`;
  };

  const daysOfWeekOptions = [
    { value: '0', label: 'Dom' },
    { value: '1', label: 'Seg' },
    { value: '2', label: 'Ter' },
    { value: '3', label: 'Qua' },
    { value: '4', label: 'Qui' },
    { value: '5', label: 'Sex' },
    { value: '6', label: 'Sáb' },
  ];

  const toggleDayOfWeek = (day: string) => {
    const current = formData.diasSemana || [];
    if (current.includes(day)) {
      setFormData({ ...formData, diasSemana: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, diasSemana: [...current, day] });
    }
  };

  // ========== FILTROS ==========
  const filteredRondas = rondas.filter((ronda) => {
    const matchesSearch =
      ronda.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRondaEmpresa(ronda).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'all' || ronda.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  // ========== ESTATÍSTICAS ==========
  const stats = {
    total: rondas.length,
    internas: rondas.filter((r) => r.tipo === 'interna').length,
    externas: rondas.filter((r) => r.tipo === 'externa').length,
    supervisao: rondas.filter((r) => r.tipo === 'supervisao').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rondas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Rotas</h2>
          <p className="text-gray-600">
            Configure rotas de ronda, associe clientes e vigilantes
          </p>
        </div>

        <Button
          className="bg-primary-600 hover:bg-primary-700"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4 mr-2" />
          Nova Rota
        </Button>
      </div>

      {/* Aviso de Acesso Restrito */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="size-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Acesso Restrito</p>
          <p className="text-sm text-blue-700">
            Apenas <strong>Administradores</strong> podem criar e gerenciar rotas de ronda.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total de Rotas</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-600 mb-1">Internas</p>
          <p className="text-2xl font-bold text-blue-700">{stats.internas}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-600 mb-1">Externas</p>
          <p className="text-2xl font-bold text-green-700">{stats.externas}</p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
          <p className="text-sm text-purple-600 mb-1">Supervisão</p>
          <p className="text-2xl font-bold text-purple-700">{stats.supervisao}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="interna">Internas</SelectItem>
            <SelectItem value="externa">Externas</SelectItem>
            <SelectItem value="supervisao">Supervisão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rondas List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRondas.map((ronda) => {
          const pontos = getRondaPontos(ronda);
          const vigiasIds = getRondaVigias(ronda);
          const empresaNome = getRondaEmpresa(ronda);

          return (
            <div
              key={ronda.idRonda}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{ronda.nome}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTipoColor(ronda.tipo)}`}
                  >
                    {getTipoLabel(ronda.tipo)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => loadRondaDetails(ronda.idRonda!)}
                    disabled={loadingDetails}
                  >
                    <Eye className="size-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteRonda(ronda.idRonda!)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="size-3.5 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="size-4 flex-shrink-0" />
                  <span className="truncate">{empresaNome}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="size-4 flex-shrink-0" />
                  <span>{pontos.length || 0} ponto(s)</span>
                </div>
                {vigiasIds.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="size-4 flex-shrink-0" />
                      <span>{vigiasIds.length} vigilante(s)</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      {vigiasIds.slice(0, 3).map((idVigia: number) => {
                        const vigia = vigias.find((v) => v.idUsuario === idVigia);
                        return (
                          <div
                            key={idVigia}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200"
                            title={vigia?.nome || `Vigia #${idVigia}`}
                          >
                            {vigia ? vigia.nome.charAt(0).toUpperCase() : 'V'}
                          </div>
                        );
                      })}
                      {vigiasIds.length > 3 && (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200"
                          title={`+${vigiasIds.length - 3} vigilante(s)`}
                        >
                          +{vigiasIds.length - 3}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {ronda.horarioInicio && ronda.horarioFim && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="size-4 flex-shrink-0" />
                    <span>
                      {ronda.horarioInicio} - {ronda.horarioFim}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRondas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <RouteIcon className="size-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-900 font-medium mb-1">
            {searchTerm || filterTipo !== 'all'
              ? 'Nenhuma rota encontrada'
              : 'Nenhuma rota cadastrada'}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || filterTipo !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Clique em "Nova Rota" para começar'}
          </p>
        </div>
      )}

      {/* Create Ronda Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Rota de Ronda</DialogTitle>
            <DialogDescription>
              Configure os pontos de verificação, associe um cliente e selecione os vigilantes responsáveis.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Rota *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Ronda Noturna - Bloco A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente/Empresa *</Label>
                <Select
                  value={formData.idCliente.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, idCliente: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                        {cliente.nomeEmpresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Ronda */}
              <div className="border-t pt-4">
                <div className="mb-3">
                  <Label className="text-base">Tipo de Ronda *</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Selecione o tipo de verificação que será realizada
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'interna' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === 'interna'
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.tipo === 'interna' ? 'bg-primary-100' : 'bg-gray-100'
                        }`}
                      >
                        <Building2
                          className={`size-6 ${
                            formData.tipo === 'interna' ? 'text-primary-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            formData.tipo === 'interna' ? 'text-primary-700' : 'text-gray-900'
                          }`}
                        >
                          Interna
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Dentro do estabelecimento</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'externa' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === 'externa'
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.tipo === 'externa' ? 'bg-primary-100' : 'bg-gray-100'
                        }`}
                      >
                        <Navigation
                          className={`size-6 ${
                            formData.tipo === 'externa' ? 'text-primary-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            formData.tipo === 'externa' ? 'text-primary-700' : 'text-gray-900'
                          }`}
                        >
                          Externa
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Perímetro externo</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'supervisao' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === 'supervisao'
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.tipo === 'supervisao' ? 'bg-primary-100' : 'bg-gray-100'
                        }`}
                      >
                        <ClipboardCheck
                          className={`size-6 ${
                            formData.tipo === 'supervisao' ? 'text-primary-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            formData.tipo === 'supervisao' ? 'text-primary-700' : 'text-gray-900'
                          }`}
                        >
                          Supervisão
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Verificação geral</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Horário */}
              <div className="border-t pt-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Horário de Funcionamento</h3>
                  <p className="text-sm text-gray-600">
                    Defina quando os vigilantes podem executar esta ronda
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="horarioInicio">Horário de Início</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="horarioInicio"
                        type="time"
                        value={formData.horarioInicio}
                        onChange={(e) =>
                          setFormData({ ...formData, horarioInicio: e.target.value })
                        }
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horarioFim">Horário de Término</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="horarioFim"
                        type="time"
                        value={formData.horarioFim}
                        onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dias da Semana</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeekOptions.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDayOfWeek(day.value)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          formData.diasSemana?.includes(day.value)
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

              {/* Vigilantes */}
              <div className="border-t pt-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Users className="size-5 text-green-600" />
                    Vigilantes Responsáveis
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecione os vigilantes que poderão executar esta rota
                  </p>
                </div>

                <div className="space-y-3">
                  {vigias.filter((v) => v.ativo).length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                      {vigias
                        .filter((v) => v.ativo)
                        .map((vigia) => (
                          <label
                            key={vigia.idUsuario}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              formData.vigias?.includes(vigia.idUsuario)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <Checkbox
                              checked={formData.vigias?.includes(vigia.idUsuario)}
                              onCheckedChange={(checked) => {
                                const current = formData.vigias || [];
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    vigias: [...current, vigia.idUsuario],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    vigias: current.filter((id) => id !== vigia.idUsuario),
                                  });
                                }
                              }}
                            />
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-medium">
                              {vigia.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{vigia.nome}</p>
                              <p className="text-xs text-gray-500">{vigia.email}</p>
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

                  {formData.vigias && formData.vigias.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
                      <UserCheck className="size-4" />
                      <span className="font-medium">
                        {formData.vigias.length} vigilante(s) selecionado(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pontos de Verificação */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">Pontos de Verificação *</h3>
                <p className="text-sm text-gray-600">
                  Adicione os pontos que devem ser verificados durante a ronda
                </p>
              </div>

              {/* Add Point Form */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
                <div className="grid grid-cols-[1fr,200px,auto] gap-2">
                  <Input
                    placeholder="Nome do ponto (Ex: Portaria Principal)"
                    value={pontoForm.nome}
                    onChange={(e) => setPontoForm({ ...pontoForm, nome: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPonto())}
                  />
                  <Select
                    value={pontoForm.tipo}
                    onValueChange={(value: any) => setPontoForm({ ...pontoForm, tipo: value })}
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
                          <ImageIcon className="size-4" />
                          Foto
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addPonto}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
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
                      value={pontoForm.latitude || ''}
                      onChange={(e) =>
                        setPontoForm({
                          ...pontoForm,
                          latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Longitude (opcional)</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Ex: -46.633308"
                      value={pontoForm.longitude || ''}
                      onChange={(e) =>
                        setPontoForm({
                          ...pontoForm,
                          longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
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
                {formData.pontos && formData.pontos.length > 0 ? (
                  formData.pontos.map((ponto, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 text-primary-600">
                        {getPontoTypeIcon(ponto.tipo)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{ponto.nome}</p>
                        <p className="text-sm text-gray-500">
                          {ponto.tipo === 'qrcode' && 'Verificação por QR Code'}
                          {ponto.tipo === 'photo' && 'Verificação por Foto'}
                        </p>
                        {ponto.latitude && ponto.longitude && (
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            📍 {ponto.latitude.toFixed(6)}, {ponto.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePonto(index)}
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
              <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700">
                Criar Rota
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Ronda Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Rota</DialogTitle>
            <DialogDescription>Visualize todas as informações desta rota de ronda</DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Carregando detalhes...</p>
              </div>
            </div>
          ) : selectedRonda ? (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Nome da Rota</Label>
                <p className="font-medium">{selectedRonda.nome}</p>
              </div>

              <div>
                <Label className="text-gray-600">Cliente/Empresa</Label>
                <p className="font-medium">{getRondaEmpresa(selectedRonda)}</p>
              </div>

              <div>
                <Label className="text-gray-600">Tipo</Label>
                <div className="mt-1">
                  <Badge className={getTipoColor(selectedRonda.tipo)}>
                    {getTipoLabel(selectedRonda.tipo)}
                  </Badge>
                </div>
              </div>

              {selectedRonda.horarioInicio && selectedRonda.horarioFim && (
                <div>
                  <Label className="text-gray-600">Horário</Label>
                  <p className="font-medium">
                    {selectedRonda.horarioInicio} - {selectedRonda.horarioFim}
                  </p>
                </div>
              )}

              {selectedRonda.diasSemana && selectedRonda.diasSemana.length > 0 && (
                <div>
                  <Label className="text-gray-600 mb-2 block">Dias da Semana</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRonda.diasSemana.map((dia) => {
                      const diaInfo = daysOfWeekOptions.find((d) => d.value === dia);
                      return (
                        <span
                          key={dia}
                          className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-sm font-medium"
                        >
                          {diaInfo?.label || dia}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {(() => {
                const vigiasIds = getRondaVigias(selectedRonda);
                return vigiasIds.length > 0 ? (
                  <div>
                    <Label className="text-gray-600 mb-2 block">
                      Vigilantes Responsáveis ({vigiasIds.length})
                    </Label>
                    <div className="space-y-2">
                      {vigiasIds.map((idVigia: number) => {
                        const vigia = vigias.find((v) => v.idUsuario === idVigia);
                        return (
                          <div
                            key={idVigia}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-medium">
                              {vigia ? vigia.nome.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {vigia ? vigia.nome : `Vigia #${idVigia}`}
                              </p>
                              {vigia && (
                                <p className="text-xs text-gray-500">{vigia.email}</p>
                              )}
                            </div>
                            <UserCheck className="size-4 text-green-600" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}

              {(() => {
                const pontos = getRondaPontos(selectedRonda);
                return (
                  <div>
                    <Label className="text-gray-600 mb-2 block">
                      Pontos de Verificação ({pontos.length || 0})
                    </Label>
                    <div className="space-y-2">
                      {pontos.length > 0 ? (
                        pontos.map((ponto: any, index: number) => (
                          <div
                            key={ponto.idPonto || index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                              {ponto.ordem || index + 1}
                            </div>
                            <div className="flex items-center gap-2 text-primary-600">
                              {getPontoTypeIcon(ponto.tipo)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{ponto.nome}</p>
                              {ponto.latitude && ponto.longitude && (
                                <p className="text-xs text-gray-400 font-mono">
                                  📍 {ponto.latitude.toFixed(6)}, {ponto.longitude.toFixed(6)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <MapPin className="size-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Nenhum ponto cadastrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma rota selecionada</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
