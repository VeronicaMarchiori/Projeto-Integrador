import { Building2, ChevronRight, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  address: string;
  activeRoutes: number;
}

interface ClientSelectionProps {
  onSelectClient: (clientId: string) => void;
}

export function ClientSelection({ onSelectClient }: ClientSelectionProps) {
  const clients: Client[] = [
    {
      id: '1',
      name: 'Shopping Center Norte',
      address: 'Av. Principal, 1000 - Centro',
      activeRoutes: 3,
    },
    {
      id: '2',
      name: 'Condomínio Residencial Vista Verde',
      address: 'Rua das Flores, 500 - Jardim América',
      activeRoutes: 2,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Suas Empresas</h1>
        <p className="text-gray-600">
          Selecione a empresa para ver as rotas disponíveis
        </p>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className="w-full bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Building2 className="size-7 text-primary-600" />
                </div>
              </div>

              {/* Client Info */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 mb-1">
                  {client.name}
                </h3>
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                  <span>{client.address}</span>
                </div>
                <div className="text-sm text-primary-600 font-medium">
                  {client.activeRoutes} {client.activeRoutes === 1 ? 'rota ativa' : 'rotas ativas'}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="size-6 text-gray-400 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
