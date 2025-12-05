import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Clock, MapPin, Camera, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { apiClient } from '../utils/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useOfflineSync } from '../hooks/useOfflineSync';

interface Occurrence {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'maintenance' | 'incident' | 'other';
  isEmergency: boolean;
  location?: { latitude: number; longitude: number };
  createdAt: string;
  status: 'open' | 'investigating' | 'resolved';
}

export function OccurrencesManager() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const { location, getCurrentLocation } = useGeolocation();
  const { isOnline, queueAction } = useOfflineSync();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'security' as const,
    isEmergency: false,
  });

  useEffect(() => {
    loadOccurrences();
  }, []);

  const loadOccurrences = async () => {
    try {
      const { occurrences: data } = await apiClient.getOccurrences();
      setOccurrences(data || []);
    } catch (error) {
      console.error('Error loading occurrences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = () => {
    getCurrentLocation();
    setEmergencyDialogOpen(true);
  };

  const submitEmergency = async () => {
    const occurrenceData = {
      title: 'EMERGÊNCIA',
      description: 'Botão de emergência acionado',
      type: 'security' as const,
      isEmergency: true,
      location: location ? { latitude: location.latitude, longitude: location.longitude } : undefined,
    };

    try {
      if (isOnline) {
        const { occurrence } = await apiClient.createOccurrence(occurrenceData);
        setOccurrences([occurrence, ...occurrences]);
      } else {
        const tempOccurrence = { ...occurrenceData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'open' as const };
        setOccurrences([tempOccurrence, ...occurrences]);
        queueAction({ type: 'create', entityType: 'OCCURRENCES', data: tempOccurrence });
      }
      setEmergencyDialogOpen(false);
    } catch (error) {
      console.error('Error creating emergency:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    getCurrentLocation();

    const occurrenceData = {
      ...formData,
      location: location ? { latitude: location.latitude, longitude: location.longitude } : undefined,
    };

    try {
      if (isOnline) {
        const { occurrence } = await apiClient.createOccurrence(occurrenceData);
        setOccurrences([occurrence, ...occurrences]);
      } else {
        const tempOccurrence = { ...occurrenceData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'open' as const };
        setOccurrences([tempOccurrence, ...occurrences]);
        queueAction({ type: 'create', entityType: 'OCCURRENCES', data: tempOccurrence });
      }

      setDialogOpen(false);
      setFormData({ title: '', description: '', type: 'security', isEmergency: false });
    } catch (error) {
      console.error('Error creating occurrence:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      security: 'Segurança',
      maintenance: 'Manutenção',
      incident: 'Incidente',
      other: 'Outro',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-700',
      investigating: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Aberta',
      investigating: 'Em Análise',
      resolved: 'Resolvida',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return <div>Carregando ocorrências...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Emergency Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ocorrências</h2>
          <p className="text-gray-600">Gerencie ocorrências e emergências</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleEmergency}
                className="bg-red-600 hover:bg-red-700 animate-pulse"
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                EMERGÊNCIA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Confirmar Emergência</DialogTitle>
                <DialogDescription>
                  Esta ação enviará uma notificação de emergência para todos os supervisores
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="h-6 w-6" />
                  <p>
                    Ao confirmar, uma notificação de emergência será enviada imediatamente
                    para todos os supervisores e administradores.
                  </p>
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Localização capturada</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEmergencyDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={submitEmergency}
                  >
                    Confirmar Emergência
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova Ocorrência
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Ocorrência</DialogTitle>
                <DialogDescription>
                  Registre uma nova ocorrência durante a ronda
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Resumo da ocorrência"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o que aconteceu..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    className="w-full border rounded-md p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="security">Segurança</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="incident">Incidente</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Registrar Ocorrência
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Occurrences List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando ocorrências...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {occurrences.map((occurrence) => (
            <div
              key={occurrence.id}
              className={`bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow ${
                occurrence.isEmergency
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`rounded-full p-3 ${
                      occurrence.isEmergency
                        ? 'bg-red-100'
                        : 'bg-primary-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`h-6 w-6 ${
                        occurrence.isEmergency
                          ? 'text-red-600'
                          : 'text-primary-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{occurrence.title}</h3>
                      {occurrence.isEmergency && (
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                          EMERGÊNCIA
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          occurrence.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : occurrence.status === 'investigating'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {occurrence.status === 'open' && 'Aberta'}
                        {occurrence.status === 'investigating' && 'Em Investigação'}
                        {occurrence.status === 'resolved' && 'Resolvida'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{occurrence.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(occurrence.createdAt).toLocaleString('pt-BR')}
                      </div>
                      {occurrence.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Localização registrada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {occurrences.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <AlertTriangle className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-900 font-medium mb-1">Nenhuma ocorrência registrada</p>
              <p className="text-sm text-gray-500">Use o botão acima para registrar uma ocorrência</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}