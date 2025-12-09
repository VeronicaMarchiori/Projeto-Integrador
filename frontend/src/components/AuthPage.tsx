import { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';  // ⬅ IMPORTANTE

export function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();  // ⬅ AQUI

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const email = formData.email.trim();
    const password = formData.password.trim();
    
    const { error, userType } = await signIn(email, password);

    if (error) {
      setError(error);
    } else {
      window.location.reload();
    }
  } catch (err: any) {
    setError(err.message || 'Ocorreu um erro. Tente novamente.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
            <Shield className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VigiaSystem</h1>
          <p className="text-primary-100">Sistema de Gestão de Rondas</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Entrar no Sistema
            </h2>
            <p className="text-gray-600">
              Use suas credenciais para acessar
            </p>
          </div>

          {/* Credenciais de acesso */}
          <div className="mb-6 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">👑 Acesso Administrativo</p>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'admin@admin.com', password: 'admin' })}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                >
                  Preencher
                </button>
              </div>
              <p className="text-xs text-blue-700">Email: <span className="font-mono font-semibold">admin@admin.com</span></p>
              <p className="text-xs text-blue-700">Senha: <span className="font-mono font-semibold">admin</span></p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-green-900">🛡️ Acesso Vigilante</p>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'vigilante@vigilante.com', password: 'vigilante' })}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                >
                  Preencher
                </button>
              </div>
              <p className="text-xs text-green-700">Email: <span className="font-mono font-semibold">vigilante@vigilante.com</span></p>
              <p className="text-xs text-green-700">Senha: <span className="font-mono font-semibold">vigilante</span></p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-16"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: '3rem' }}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            >
              {loading ? 'Processando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-primary-100 text-sm">
          <p>© 2024 VigiaSystem. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}