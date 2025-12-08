import { useState } from 'react';
import { Building2, Plus, Search, MapPin, Phone, Mail, Edit, Trash2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface Client {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  activeRoutes: number;
  createdAt: string;
}

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Shopping Center Norte',
      cnpj: '12.345.678/0001-90',
      address: 'Av. Principal, 1000 - Centro',
      phone: '(11) 3456-7890',
      email: 'contato@shoppingnorte.com.br',
      contactPerson: 'Carlos Silva',
      activeRoutes: 3,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Condomínio Residencial Vista Verde',
      cnpj: '98.765.432/0001-10',
      address: 'Rua das Flores, 500 - Jardim América',
      phone: '(11) 2345-6789',
      email: 'sindico@vistaverde.com.br',
      contactPerson: 'Maria Santos',
      activeRoutes: 2,
      createdAt: '2024-02-20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      activeRoutes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setClients([client, ...clients]);
    setShowCreateDialog(false);
    setNewClient({
      name: '',
      cnpj: '',
      address: '',
      phone: '',
      email: '',
      contactPerson: '',
    });
    alert('Cliente cadastrado com sucesso! (Modo demonstração)');
  };

  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingClient) return;

    setClients(clients.map(client => 
      client.id === editingClient.id 
        ? { 
            ...client, 
            name: editingClient.name,
            cnpj: editingClient.cnpj,
            address: editingClient.address,
            phone: editingClient.phone,
            email: editingClient.email,
            contactPerson: editingClient.contactPerson,
          }
        : client
    ));
    
    setShowEditDialog(false);
    setEditingClient(null);
    alert('Cliente atualizado com sucesso! (Modo demonstração)');
  };

  const openEditDialog = (client: Client) => {
    setEditingClient({ ...client });
    setShowEditDialog(true);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnpj.includes(searchTerm) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Building2 className="size-8 text-primary-600" />
            Gerenciar Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Cadastre e gerencie empresas e estabelecimentos que utilizam o serviço de rondas
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="size-5 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha as informações da empresa ou estabelecimento
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Ex: Shopping Center Norte"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={newClient.cnpj}
                  onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Textarea
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(00) 0000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contato@empresa.com.br"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Pessoa de Contato *</Label>
                <Input
                  id="contactPerson"
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                  placeholder="Nome do responsável"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700">
                  Cadastrar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Altere as informações do cliente
            </DialogDescription>
          </DialogHeader>

          {editingClient && (
            <form onSubmit={handleEditClient} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da Empresa *</Label>
                <Input
                  id="edit-name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="Ex: Shopping Center Norte"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cnpj">CNPJ *</Label>
                <Input
                  id="edit-cnpj"
                  value={editingClient.cnpj}
                  onChange={(e) => setEditingClient({ ...editingClient, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Endereço *</Label>
                <Textarea
                  id="edit-address"
                  value={editingClient.address}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone *</Label>
                  <Input
                    id="edit-phone"
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    placeholder="(00) 0000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    placeholder="contato@empresa.com.br"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Pessoa de Contato *</Label>
                <Input
                  id="edit-contactPerson"
                  value={editingClient.contactPerson}
                  onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                  placeholder="Nome do responsável"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingClient(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <Input
          placeholder="Buscar por nome, CNPJ ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '3rem' }}
        />
      </div>

      {/* Clients List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredClients.map((client) => (
          <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Building2 className="size-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">CNPJ: {client.cnpj}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="size-8 p-0"
                  onClick={() => openEditDialog(client)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" className="size-8 p-0 text-red-600 hover:text-red-700">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{client.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="size-4 flex-shrink-0" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="size-4 flex-shrink-0" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="size-4 flex-shrink-0" />
                <span>Contato: {client.contactPerson}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Rotas ativas: </span>
                <span className="font-semibold text-primary-600">{client.activeRoutes}</span>
              </div>
              <div className="text-xs text-gray-500">
                Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}
