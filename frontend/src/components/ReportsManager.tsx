import { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  User, 
  Calendar,
  Eye,
  Download,
  Filter,
  TrendingUp,
  XCircle,
  Camera,
  QrCode,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { mockRoundReports, getReportStats } from '../utils/mockData';

export function ReportsManager() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const stats = getReportStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="size-3 mr-1" />
          Concluído
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        <AlertTriangle className="size-3 mr-1" />
        Concluído com Problemas
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      high: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Alta' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Média' },
      low: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Baixa' },
    };
    const style = severityMap[severity as keyof typeof severityMap];
    return (
      <span className={`rounded-full border ${style.border} ${style.bg} px-2 py-0.5 text-xs font-medium ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getPointTypeIcon = (type: string) => {
    switch (type) {
      case 'qrcode':
        return <QrCode className="size-4 text-purple-600" />;
      case 'photo':
        return <Camera className="size-4 text-green-600" />;
      default:
        return <MapPin className="size-4 text-gray-600" />;
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleExportPDF = (report: any) => {
    
    alert(`Exportando pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Relatórios de Rondas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualize e analise os relatórios detalhados das rondas executadas
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
          <Download className="size-4 mr-2" />
          Exportar Relatórios
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Rondas</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <FileText className="size-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Conclusão</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{stats.avgCompletionRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <TrendingUp className="size-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">{formatDuration(stats.avgDuration)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Clock className="size-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Ocorrências</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">{stats.totalOccurrences}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertCircle className="size-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Relatórios Recentes</h3>
          <Button variant="outline" size="sm">
            <Filter className="size-4 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockRoundReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{report.routeName}</h4>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-gray-600">{report.establishmentName}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewReport(report)}
                >
                  <Eye className="size-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>

              {/* Report Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Vigia</p>
                    <p className="font-medium text-gray-900">{report.guardName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Data/Hora Início</p>
                    <p className="font-medium text-gray-900">{formatDate(report.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Duração</p>
                    <p className="font-medium text-gray-900">{formatDuration(report.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="size-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Conclusão</p>
                    <p className="font-medium text-gray-900">{report.completionRate}%</p>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 font-medium">
                    {report.pointsChecked.filter((p: any) => p.status === 'success').length} pontos verificados
                  </span>
                </div>
                {report.occurrences.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700 font-medium">
                      {report.occurrences.length} ocorrência(s)
                    </span>
                  </div>
                )}
                {report.pointsChecked.some((p: any) => p.status === 'failed') && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 font-medium">
                      {report.pointsChecked.filter((p: any) => p.status === 'failed').length} ponto(s) não verificado(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório Detalhado da Ronda</DialogTitle>
            <DialogDescription>Todas as informações sobre a execução da ronda</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedReport.routeName}</h3>
                    <p className="text-sm text-gray-600">{selectedReport.establishmentName}</p>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vigia Responsável</p>
                    <p className="font-medium text-gray-900">{selectedReport.guardName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Início</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedReport.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Término</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedReport.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duração Total</p>
                    <p className="font-medium text-gray-900">{formatDuration(selectedReport.duration)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">
                        Taxa de Conclusão: <span className="font-semibold">{selectedReport.completionRate}%</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        Pontos Verificados: <span className="font-semibold">
                          {selectedReport.pointsChecked.filter((p: any) => p.status === 'success').length}/{selectedReport.pointsChecked.length}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Checked Timeline */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="size-5 text-primary-600" />
                  Pontos de Verificação ({selectedReport.pointsChecked.length})
                </h4>
                <div className="space-y-3">
                  {selectedReport.pointsChecked.map((point: any, index: number) => (
                    <div 
                      key={point.pointId} 
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        point.status === 'success' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
                        point.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getPointTypeIcon(point.type)}
                          <p className="font-medium text-gray-900">{point.pointName}</p>
                          {point.status === 'success' ? (
                            <CheckCircle className="size-4 text-green-600 ml-auto" />
                          ) : (
                            <XCircle className="size-4 text-red-600 ml-auto" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDate(point.checkedAt)}
                          </span>
                          {point.latitude && point.longitude && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                            </span>
                          )}
                          {point.photoUrl && (
                            <a 
                              href={point.photoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary-600 hover:underline"
                            >
                              <Camera className="size-3" />
                              Ver Foto
                            </a>
                          )}
                        </div>
                        {point.note && (
                          <p className="text-sm text-red-600 mt-2 font-medium">⚠️ {point.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occurrences */}
              {selectedReport.occurrences.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="size-5 text-orange-600" />
                    Ocorrências Registradas ({selectedReport.occurrences.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedReport.occurrences.map((occurrence: any) => (
                      <div 
                        key={occurrence.id} 
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{occurrence.type}</p>
                            <p className="text-sm text-gray-600">{occurrence.location}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getSeverityBadge(occurrence.severity)}
                            {occurrence.resolved ? (
                              <span className="text-xs text-green-600 font-medium">✓ Resolvida</span>
                            ) : (
                              <span className="text-xs text-red-600 font-medium">⚠ Pendente</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{occurrence.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Registrado em: {formatDate(occurrence.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedReport.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="size-5" />
                    Observações do Vigia
                  </h4>
                  <p className="text-sm text-blue-800">{selectedReport.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Fechar
                </Button>
                <Button 
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => {
                    handleExportPDF(selectedReport);
                    setViewDialogOpen(false);
                  }}
                >
                  <Download className="size-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}