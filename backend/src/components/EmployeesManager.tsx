import { useState, useEffect } from 'react';
import { Users, Mail, Shield, UserCircle, Plus, Phone, CreditCard, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface Employee {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'guard';
  cpf: string;
  phone?: string;
  active: boolean;
  createdAt?: string;
}

interface EmployeesManagerProps {
  onNavigateToCreate?: () => void;
}

export function EmployeesManager({ onNavigateToCreate }: EmployeesManagerProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    role: 'guard' as const,
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      // Dados mock de funcionários
      const mockData: Employee[] = [
        {
          id: 'emp-1',
          name: 'Carlos Silva',
          email: 'carlos.silva@vigiasystem.com',
          role: 'guard',
          phone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          active: true,
          createdAt: '2024-01-15',
        },
        {
          id: 'emp-2',
          name: 'Maria Santos',
          email: 'maria.santos@vigiasystem.com',
          role: 'guard',
          phone: '(11) 98765-4322',
          cpf: '123.456.789-01',
          active: true,
          createdAt: '2024-01-20',
        },
        {
          id: 'emp-3',
          name: 'João Oliveira',
          email: 'joao.oliveira@vigiasystem.com',
          role: 'guard',
          phone: '(11) 98765-4323',
          cpf: '123.456.789-02',
          active: true,
          createdAt: '2024-02-01',
        },
        {
          id: 'emp-4',
          name: 'Ana Costa',
          email: 'ana.costa@vigiasystem.com',
          role: 'guard',
          phone: '(11) 98765-4324',
          cpf: '123.456.789-03',
          active: false,
          createdAt: '2024-02-10',
        },
        {
          id: 'emp-5',
          name: 'Roberto Ferreira',
          email: 'roberto.ferreira@vigiasystem.com',
          role: 'supervisor',
          phone: '(11) 98765-4325',
          cpf: '123.456.789-04',
          active: true,
          createdAt: '2024-02-15',
        },
        {
          id: 'admin-001',
          name: 'Administrador',
          email: 'admin@admin.com',
          role: 'admin',
          phone: '(11) 99999-9999',
          cpf: '000.000.000-00',
          active: true,
          createdAt: '2024-01-01',
        },
      ];
      
      setEmployees(mockData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        ...formData,
        active: true,
        createdAt: new Date().toISOString(),
      };
      
      setEmployees([...employees, newEmployee]);
      setDialogOpen(false);
      setFormData({ name: '', email: '', cpf: '', phone: '', role: 'guard' });
      toast.success('Funcionário cadastrado com sucesso!');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Erro ao cadastrar funcionário');
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm('Deseja realmente remover este funcionário?')) return;
    
    try {
      setEmployees(employees.filter(e => e.id !== id));
      toast.success('Funcionário removido com sucesso!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erro ao remover funcionário');
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      guard: 'Vigilante',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      supervisor: 'bg-primary-100 text-primary-700 border-primary-200',
      guard: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[role as keyof typeof colors] || '';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'supervisor':
        return '🔍';
      case 'guard':
        return '🛡️';
      default:
        return '👤';
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.cpf.includes(searchTerm);
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: employees.length,
    admins: employees.filter(e => e.role === 'admin').length,
    supervisors: employees.filter(e => e.role === 'supervisor').length,
    guards: employees.filter(e => e.role === 'guard').length,
    active: employees.filter(e => e.active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funcionários da Ronda</h2>
          <p className="text-gray-600">Gerencie a equipe de vigilância e segurança</p>
        </div>
        {onNavigateToCreate ? (
          <Button 
            className="bg-primary-600 hover:bg-primary-700"
            onClick={onNavigateToCreate}
          >
            <Plus className="size-4 mr-2" />
            Novo Funcionário
          </Button>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="size-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Funcionário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo funcionário do sistema de rondas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do funcionário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guard">
                      <div className="flex items-center gap-2">
                        <span>🛡️</span>
                        <span>Vigilante</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="supervisor">
                      <div className="flex items-center gap-2">
                        <span>🔍</span>
                        <span>Supervisor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <span>👑</span>
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700">
                  Cadastrar
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-sm text-red-600 mb-1">Administradores</p>
          <p className="text-2xl font-bold text-red-700">{stats.admins}</p>
        </div>
        <div className="bg-primary-50 rounded-lg border border-primary-200 p-4">
          <p className="text-sm text-primary-600 mb-1">Supervisores</p>
          <p className="text-2xl font-bold text-primary-700">{stats.supervisors}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-600 mb-1">Vigilantes</p>
          <p className="text-2xl font-bold text-green-700">{stats.guards}</p>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Ativos</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Funções</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="supervisor">Supervisores</SelectItem>
            <SelectItem value="guard">Vigilantes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employees List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando funcionários...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl">
                    {getRoleIcon(employee.role)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-1 ${getRoleColor(employee.role)}`}>
                      {getRoleLabel(employee.role)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <Edit2 className="size-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="size-3.5 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="size-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="size-4" />
                  <span>{employee.cpf}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="size-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                  employee.active ? 'text-green-600' : 'text-gray-500'
                }`}>
                  <div className={`h-2 w-2 rounded-full ${employee.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {employee.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Users className="size-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-900 font-medium mb-1">
            {searchTerm || filterRole !== 'all' 
              ? 'Nenhum funcionário encontrado' 
              : 'Nenhum funcionário cadastrado'}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || filterRole !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Clique em "Novo Funcionário" para começar'}
          </p>
        </div>
      )}
    </div>
  );
}
