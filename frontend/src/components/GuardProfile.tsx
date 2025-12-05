import { ArrowLeft, User, Building2, Mail, Phone, IdCard, Calendar, MapPin, Shield, Briefcase, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useMemo } from 'react';

interface GuardProfileProps {
  onBack: () => void;
}

export function GuardProfile({ onBack }: GuardProfileProps) {
  const { user } = useAuth();

  // Dados mock do vigilante (em produção viriam do backend)
  const guardData = useMemo(() => ({
    fullName: user?.name || 'Carlos Silva',
    cpf: '123.456.789-00',
    email: user?.email || 'carlos.silva@example.com',
    phone: '(11) 98765-4321',
    position: 'Vigilante Patrimonial',
    admissionDate: '15/03/2023',
    registration: 'VIG-2023-001',
    company: {
      name: 'SecureGuard Vigilância Ltda.',
      cnpj: '12.345.678/0001-99',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      phone: '(11) 3000-0000',
      email: 'contato@secureguard.com.br',
    },
    shift: 'Noturno (22h às 06h)',
    sector: 'Perímetro Externo',
    supervisor: 'João Santos',
    status: 'Ativo',
    avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  }), [user]);

  const handleLogout = () => {
    if (confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('auth_user');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white pb-20">
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="size-5" />
            <span>Voltar</span>
          </button>
          
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={guardData.avatar}
                  alt={guardData.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {guardData.status}
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">{guardData.fullName}</h1>
            <p className="text-blue-100 mb-2">{guardData.position}</p>
            <p className="text-sm text-blue-200">Matrícula: {guardData.registration}</p>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="px-4 -mt-12 pb-6 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Calendar className="size-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2+</p>
            <p className="text-sm text-gray-600">Anos na empresa</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Shield className="size-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{guardData.sector}</p>
            <p className="text-sm text-gray-600">Setor de atuação</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="size-5 text-blue-600" />
              Dados Pessoais
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <InfoRow icon={IdCard} label="CPF" value={guardData.cpf} />
            <InfoRow icon={Mail} label="Email" value={guardData.email} />
            <InfoRow icon={Phone} label="Telefone" value={guardData.phone} />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="size-5 text-purple-600" />
              Informações Profissionais
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <InfoRow icon={Calendar} label="Admissão" value={guardData.admissionDate} />
            <InfoRow icon={Shield} label="Cargo" value={guardData.position} />
            <InfoRow icon={Calendar} label="Turno" value={guardData.shift} />
            <InfoRow icon={User} label="Supervisor" value={guardData.supervisor} />
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="size-5 text-emerald-600" />
              Empresa
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <InfoRow icon={Building2} label="Razão Social" value={guardData.company.name} />
            <InfoRow icon={IdCard} label="CNPJ" value={guardData.company.cnpj} />
            <InfoRow icon={MapPin} label="Endereço" value={guardData.company.address} />
            <InfoRow icon={Phone} label="Telefone" value={guardData.company.phone} />
            <InfoRow icon={Mail} label="Email" value={guardData.company.email} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-200 text-red-600 rounded-xl p-4 font-medium hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <LogOut className="size-5" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}

// Component for info rows
interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="size-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="font-medium text-gray-900 truncate">{value}</p>
      </div>
      <ChevronRight className="size-5 text-gray-300 flex-shrink-0" />
    </div>
  );
}