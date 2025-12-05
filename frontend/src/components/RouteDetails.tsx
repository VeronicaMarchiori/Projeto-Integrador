import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, MessageSquare, AlertTriangle, Check, Clock, Camera, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CameraSimulator } from './CameraSimulator';
import { ChatInterface } from './ChatInterface';
import { OccurrenceForm } from './OccurrenceForm';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/api';
import { mockRoutePoints } from '../utils/mockData';
import mapImage from 'figma:asset/09513fc59109059e2378f46b058c952a5910f745.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface RouteDetailsProps {
  route: any;
  onBack: () => void;
}

interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  qrCode: string;
  order: number;
  verified: boolean;
  verifiedAt?: string;
}

export function RouteDetails({ route, onBack }: RouteDetailsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'map' | 'chat' | 'occurrence'>('map');
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [activeRound, setActiveRound] = useState<any>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [showEmergencyFinishDialog, setShowEmergencyFinishDialog] = useState(false);
  const [emergencyFinishConfirmed, setEmergencyFinishConfirmed] = useState(false);

  useEffect(() => {
    loadRoutePoints();
  }, [route.id]);

  const loadRoutePoints = async () => {
    try {
      // Tentar carregar do backend
      const response = await apiClient.getRoutePoints(route.id);
      
      if (response?.points && response.points.length > 0) {
        setPoints(response.points);
      } else {
        // Usar dados mock se não houver pontos
        const mockPoints = mockRoutePoints[route.id as keyof typeof mockRoutePoints] || [];
        setPoints(mockPoints);
      }
    } catch (error) {
      // Em caso de erro (backend não disponível), usar dados mock
      console.log('Backend não disponível, usando dados mock para demonstração');
      const mockPoints = mockRoutePoints[route.id as keyof typeof mockRoutePoints] || [];
      setPoints(mockPoints);
    }
  };

  const startRound = async () => {
    try {
      const roundData = {
        routeId: route.id,
        startedAt: new Date().toISOString(),
        userId: user?.id,
      };

      try {
        const { round } = await apiClient.createRound(roundData);
        setActiveRound(round);
      } catch (error) {
        const mockRound = {
          id: `round-${Date.now()}`,
          ...roundData,
        };
        setActiveRound(mockRound);
      }
    } catch (error) {
      console.error('Error starting round:', error);
      const mockRound = {
        id: `round-${Date.now()}`,
        routeId: route.id,
        startedAt: new Date().toISOString(),
        userId: user?.id,
      };
      setActiveRound(mockRound);
    }
  };

  const verifyPoint = async (pointId: string) => {
    const point = points.find(p => p.id === pointId);
    if (!point) return;

    try {
      await apiClient.verifyCheckpoint({
        roundId: activeRound?.id,
        pointId,
        qrCodeData: point.qrCode,
        verifiedAt: new Date().toISOString(),
      });

      setPoints(points.map(p => 
        p.id === pointId 
          ? { ...p, verified: true, verifiedAt: new Date().toISOString() }
          : p
      ));

      setCameraOpen(false);
      setSelectedPoint(null);
    } catch (error) {
      // Em modo de desenvolvimento/mock, simular sucesso
      console.log('Modo demonstração: Ponto verificado');
      setPoints(points.map(p => 
        p.id === pointId 
          ? { ...p, verified: true, verifiedAt: new Date().toISOString() }
          : p
      ));

      setCameraOpen(false);
      setSelectedPoint(null);
    }
  };

  const finishRound = async (isEmergency: boolean = false) => {
    const allVerified = points.every(p => p.verified);
    if (!allVerified && !isEmergency) {
      alert('Você precisa verificar todos os pontos antes de finalizar a ronda!');
      return;
    }

    try {
      await apiClient.finishRound(activeRound?.id, { isEmergency });
      if (isEmergency) {
        alert('Ronda finalizada em modo emergência!');
      } else {
        alert('Ronda finalizada com sucesso!');
      }
      onBack();
    } catch (error) {
      // Em modo de desenvolvimento/mock, simular sucesso
      console.log('Modo demonstração: Ronda finalizada');
      if (isEmergency) {
        alert('Ronda finalizada em modo emergência! (Modo demonstração)');
      } else {
        alert('Ronda finalizada com sucesso! (Modo demonstração)');
      }
      onBack();
    }
  };

  const handleEmergencyFinish = () => {
    setShowEmergencyFinishDialog(true);
  };

  const confirmEmergencyFinish = () => {
    setShowEmergencyFinishDialog(false);
    setEmergencyFinishConfirmed(true);
    setActiveTab('occurrence');
  };

  const completedPoints = points.filter(p => p.verified).length;
  const progressPercentage = points.length > 0 ? (completedPoints / points.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{route.name}</h2>
              <p className="text-sm text-gray-600">
                {completedPoints} de {points.length} pontos verificados
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{progressPercentage.toFixed(0)}% concluído</span>
              {activeRound && (
                <span className="flex items-center gap-1 text-green-600">
                  <Clock className="size-3" />
                  Ronda em andamento
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'map'
                ? 'border-red-500 text-red-600 bg-red-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MapPin className="size-5" />
            <span className="font-medium">Pontos</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-red-500 text-red-600 bg-red-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="size-5" />
            <span className="font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('occurrence')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'occurrence'
                ? 'border-red-500 text-red-600 bg-red-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <AlertTriangle className="size-5" />
            <span className="font-medium">Ocorrências</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'map' && (
          <div className="p-4 space-y-4">
            {/* Start/Finish Round Button */}
            {!activeRound ? (
              <Button
                onClick={startRound}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                Iniciar Ronda
              </Button>
            ) : completedPoints === points.length ? (
              <Button
                onClick={finishRound}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
              >
                Finalizar Ronda
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const nextPoint = points.find(p => !p.verified);
                  if (nextPoint) {
                    setSelectedPoint(nextPoint);
                    setCameraOpen(true);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg flex items-center justify-center gap-3"
              >
                <Camera className="size-6" />
                Registrar Ponto
              </Button>
            )}

            {/* Route Map Image */}
            {points.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={mapImage}
                    alt="Mapa da Rota"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="font-semibold">Mapa da Rota</p>
                      <p className="text-sm text-white/90">{points.length} pontos de verificação</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Points List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Pontos da Rota</h3>
              
              {points.map((point, index) => {
                const isNextPoint = activeRound && !point.verified && points.slice(0, index).every(p => p.verified);
                
                return (
                  <div
                    key={point.id}
                    className={`bg-white rounded-lg border-2 p-4 transition-all ${
                      point.verified
                        ? 'border-green-200 bg-green-50'
                        : isNextPoint
                        ? 'border-blue-400 bg-blue-50 shadow-md'
                        : 'border-gray-200'
                    }`}
                  >
                  <div className="flex items-start gap-3">
                    {/* Number Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      point.verified
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white'
                    }`}>
                      {point.verified ? (
                        <Check className="size-6" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Point Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{point.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="size-4" />
                        <span>Ponto {index + 1} de {points.length}</span>
                      </div>
                      {point.verified && point.verifiedAt && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="size-3" />
                          Verificado em {new Date(point.verifiedAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                      {isNextPoint && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          → Próximo ponto
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatInterface routeId={route.id} />
        )}

        {activeTab === 'occurrence' && (
          <OccurrenceForm 
            routeId={route.id} 
            roundId={activeRound?.id}
            activeRound={activeRound}
            onEmergencyFinish={handleEmergencyFinish}
            isEmergencyFinish={emergencyFinishConfirmed}
            onEmergencyFinishComplete={() => {
              setEmergencyFinishConfirmed(false);
              finishRound(true);
            }}
          />
        )}
      </div>

      {/* Camera Simulator */}
      {cameraOpen && selectedPoint && (
        <CameraSimulator
          onClose={() => {
            setCameraOpen(false);
            setSelectedPoint(null);
          }}
          onCapture={() => verifyPoint(selectedPoint.id)}
          pointName={selectedPoint.name}
        />
      )}

      {/* Emergency Finish Dialog */}
      <AlertDialog open={showEmergencyFinishDialog} onOpenChange={setShowEmergencyFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="size-6" />
              Finalizar Ronda em Emergência
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Você está prestes a finalizar a ronda SEM completar todos os pontos.</p>
              <p className="font-semibold">Tem certeza que deseja continuar?</p>
              <p className="text-sm text-gray-600">Após confirmar, você precisará registrar uma ocorrência explicando o motivo.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEmergencyFinish}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Finalização de Emergência
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
