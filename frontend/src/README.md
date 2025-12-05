# Sistema de Gestão de Rondas de Vigilância

Sistema completo de gestão de rondas para substituir processos manuais baseados em WhatsApp e planilhas.

## 🔑 Acesso Rápido ao Sistema

| Tipo | Email | Senha |
|------|-------|-------|
| 👑 **Admin** | `admin@admin.com` | `admin` |
| 🛡️ **Vigilante** | `vigilante@vigilante.com` | `vigilante` |

> 💡 As credenciais também estão visíveis na tela de login!

## 🚀 Funcionalidades

### Autenticação e Gestão de Usuários
- Sistema de login com dois níveis de acesso:
  - **👑 Administrador**: Visualização de funcionários e relatórios completos
  - **🛡️ Vigilante**: Execução de rondas e registro de ocorrências

### Para Administrador
- **Funcionários da Ronda**: Visualização completa de todos os vigilantes
- **Relatórios das Rondas**: Análise detalhada com filtros e exportação

### Tipos de Ronda
1. **Ronda Interna**: Verificação de perímetro interno
2. **Ronda Externa**: Verificação de perímetro externo
3. **Supervisão**: Acompanhamento de equipes

### Registro de Pontos
Três métodos de verificação de pontos:
- **Geolocalização**: Verificação por GPS
- **QR Code**: Escaneamento de códigos QR
- **Foto**: Registro fotográfico

### Funcionalidade Offline
- Registro de rondas mesmo sem conexão
- Sincronização automática quando a conexão for restabelecida
- Indicador visual de status online/offline

### Sistema de Ocorrências
- Registro detalhado de ocorrências
- Categorias: Segurança, Manutenção, Incidente, Outro
- **Botão de Emergência**: Notificação imediata para supervisores
- Localização GPS automática

### Chat Interno
- Comunicação em tempo real entre equipes
- Canais organizados (Geral, Alertas, Supervisores)
- Histórico de mensagens

### Relatórios
- Geração de relatórios por período, tipo e estabelecimento
- Estatísticas detalhadas
- Exportação para CSV
- Histórico completo de rondas com checkpoints

## 🔒 Segurança e LGPD

- Autenticação segura via Supabase Auth
- Dados criptografados em trânsito
- Controle de acesso por níveis
- Conformidade com princípios da LGPD

## 📱 Interface Responsiva

- Design mobile-first
- Otimizado para uso em smartphones durante as rondas
- Interface web completa para administração

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript
- **Estilização**: Tailwind CSS
- **Backend**: Supabase (Edge Functions + Hono)
- **Banco de Dados**: Supabase KV Store
- **Autenticação**: Supabase Auth

## 🚦 Como Usar

### 👑 Acesso Administrativo

**Credenciais:**
- Email: `admin@admin.com`
- Senha: `admin`

**Funcionalidades:**
1. **Funcionários da Ronda**: Visualize todos os vigilantes cadastrados no sistema
2. **Criar Novo Vigilante**: Cadastre novos vigilantes com formulário completo (demonstração)
3. **Relatórios das Rondas**: Acompanhe estatísticas completas e exporte dados

### 🛡️ Acesso Vigilante

**Credenciais:**
- Email: `vigilante@vigilante.com`
- Senha: `vigilante`

**Executar Rondas:**
1. Acesse o dashboard do vigilante
2. Visualize rotas disponíveis no mapa
3. Inicie uma ronda
4. Verifique pontos por QR Code ou foto
5. Navegue com GPS em tempo real
6. Registre ocorrências quando necessário
7. Use o chat para comunicação com a equipe

### Registro de Ocorrências

1. Acesse "Ocorrências"
2. Clique em "Nova Ocorrência"
3. Preencha título, descrição e tipo
4. A localização GPS será capturada automaticamente
5. Para emergências, use o botão vermelho "Emergência"

### Chat

1. Acesse "Chat"
2. Selecione o canal desejado
3. Digite sua mensagem e envie
4. Mensagens são atualizadas automaticamente

### Relatórios

1. Acesse "Relatórios"
2. Configure os filtros (datas, tipo, estabelecimento)
3. Clique em "Gerar Relatório"
4. Visualize estatísticas e histórico
5. Exporte para CSV se necessário

## ⚠️ Importante

Este é um **protótipo** desenvolvido no Figma Make para demonstração. Para uso em produção:

- Configure um servidor dedicado
- Implemente backup regular dos dados
- Configure notificações push para emergências
- Adicione autenticação de dois fatores
- Realize auditoria de segurança
- Configure monitoramento 24/7
- Implemente políticas de retenção de dados conforme LGPD

## 📝 Suporte

Para mais informações sobre funcionalidades específicas, consulte os supervisores ou administradores do sistema.
