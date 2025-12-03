# VigiaSystem - Sistema de Gestão de Rondas

## 📋 Visão Geral
Sistema completo de gestão de rondas de vigilância com design moderno nas cores **azul**, **vermelho** e **branco**.

## 🔐 Sistema de Permissões

### Níveis de Acesso

#### 👑 Administrador (Vermelho)
- **Cadastro completo de rotas** com horários específicos
- Gerenciamento de estabelecimentos
- Gerenciamento de funcionários
- Acesso a todos os relatórios
- Configuração de dias e horários permitidos para rondas

#### 🔍 Supervisor (Azul)
- Visualização de todas as rotas
- Acesso a relatórios
- Monitoramento de rondas em andamento
- Pode cadastrar rotas (permissão compartilhada com admin)

#### 🛡️ Vigilante (Verde)
- **Apenas visualiza** rotas cadastradas pelo admin
- **Executa rondas** nos horários permitidos
- Acesso restrito às funções operacionais
- Não pode cadastrar ou editar rotas

## ✅ Funcionalidades Implementadas

### 1. 🏢 Cadastro de Estabelecimentos
- **Localização**: Menu lateral > Estabelecimentos
- **Funcionalidades**:
  - Cadastro de novos estabelecimentos
  - Visualização em grid de cards
  - Edição e exclusão de estabelecimentos
  - Informações: Nome, endereço, telefone, responsável

### 2. 🗺️ Cadastro de Rotas (ADMIN/SUPERVISOR APENAS)
- **Localização**: Menu lateral > Rotas
- **Permissão**: Apenas Administradores e Supervisores
- **Funcionalidades**:
  - Criação de rotas personalizadas
  - Seleção de estabelecimento
  - Tipo de ronda (Interna, Externa, Supervisão)
  - **⏰ Configuração de Horários**:
    - Horário de início (HH:MM)
    - Horário de término (HH:MM)
    - Dias da semana permitidos (Segunda a Domingo)
  - **Pontos de Verificação**:
    - Geolocalização (GPS)
    - QR Code
    - Foto
  - Visualização detalhada de cada rota
  - Exclusão de rotas
  - Preview dos pontos em cada card de rota
- **Validações**:
  - Vigilantes não podem cadastrar rotas
  - Mensagem informativa para usuários sem permissão

### 3. 👥 Funcionários da Ronda
- **Localização**: Menu lateral > Funcionários
- **Funcionalidades**:
  - Cadastro completo de funcionários
  - Informações: Nome, email, CPF, telefone, função
  - **Tipos de Função**:
    - 👑 Administrador (vermelho)
    - 🔍 Supervisor (azul)
    - 🛡️ Vigilante (verde)
  - **Estatísticas**:
    - Total de funcionários
    - Contagem por função
    - Status ativo/inativo
  - **Filtros**:
    - Busca por nome, email ou CPF
    - Filtro por função
  - Cards com código de cores por função
  - Edição e exclusão de funcionários

### 4. 🚶 Registro de Rondas (Percurso do Vigia)
- **Localização**: Menu lateral > Rondas
- **Acesso**: Todos os usuários
- **Funcionalidades**:
  - **🕐 Validação de Horário em Tempo Real**:
    - Display do horário e data atual
    - Validação automática antes de iniciar
    - Rotas bloqueadas fora do horário permitido
    - Verificação de dia da semana
  - **Status Visual de Rotas**:
    - ✅ Verde: Disponível no horário atual
    - ❌ Vermelho: Fora do horário ou dia não permitido
    - Mensagens explicativas de bloqueio
  - **Durante a ronda**:
    - Visualização do progresso em tempo real
    - Lista de pontos de verificação
    - Verificação de cada ponto:
      - GPS: Captura automática de localização
      - QR Code: Scanner de QR Code
      - Foto: Captura de foto
    - Status visual de pontos verificados (✓)
    - Barra de progresso
  - **Modo Offline**:
    - Funciona sem internet
    - Sincronização automática quando voltar online
    - Indicador visual de modo offline
  - Finalizar ronda (só quando todos os pontos forem verificados)
  - Cancelar ronda
- **Restrições de Horário**:
  - Vigilante só pode iniciar rondas no horário definido pelo admin
  - Mensagens claras de bloqueio com horários permitidos
  - Validação de dia da semana

### 5. 📊 Relatórios das Rondas
- **Localização**: Menu lateral > Relatórios
- **Funcionalidades**:
  - **Filtros**:
    - Data inicial e final
    - Tipo de ronda
    - Estabelecimento
  - **Estatísticas**:
    - Total de rondas
    - Rondas concluídas (verde)
    - Rondas em andamento (amarelo)
    - Total de pontos verificados (azul)
  - **Visualização Detalhada**:
    - Lista completa de rondas
    - Informações de cada ronda:
      - Data e hora
      - Tipo
      - Status
      - Duração
      - Pontos verificados
      - Usuário que executou
    - Timeline de verificação de pontos
  - **Exportação**:
    - Exportar para CSV
    - Dados completos para análise

## 🎯 Fluxo de Trabalho

### Configuração Inicial (Admin)
1. Admin faz login no sistema
2. Cadastra estabelecimentos
3. Cadastra funcionários (vigilantes, supervisores)
4. **Cria rotas com horários específicos**:
   - Define nome e tipo da ronda
   - Seleciona estabelecimento
   - **Configura horário de início e fim**
   - **Seleciona dias da semana permitidos**
   - Adiciona pontos de verificação
5. Rotas ficam disponíveis para vigilantes

### Execução de Ronda (Vigilante)
1. Vigilante faz login
2. Vai para menu "Rondas"
3. **Visualiza horário atual** no topo da tela
4. Vê lista de rotas com indicadores:
   - ✅ **Verde**: Rota disponível agora
   - ❌ **Vermelho**: Fora do horário ou dia bloqueado
5. Clica em rota disponível para iniciar
6. **Sistema valida**:
   - ✓ Horário está dentro do permitido?
   - ✓ Dia da semana está permitido?
   - ✗ Se não: Mostra mensagem de bloqueio
   - ✓ Se sim: Inicia a ronda
7. Verifica cada ponto em ordem
8. Finaliza ronda quando todos os pontos estão completos

### Monitoramento (Admin/Supervisor)
1. Acessa relatórios
2. Filtra por período desejado
3. Visualiza estatísticas
4. Exporta dados para análise

## 🎨 Design System

### Cores Principais
- **🔵 Azul (#2563eb)**: Navegação, botões primários, elementos principais
- **🔴 Vermelho (#dc2626)**: Alertas, emergências, administradores
- **⚪ Branco (#ffffff)**: Background, cards, áreas de conteúdo
- **Cinza**: Textos secundários e bordas

### Componentes
- **Sidebar**: Azul escuro (#1d4ed8) com navegação fixa
- **Cards**: Brancos com bordas cinzas suaves
- **Botões Principais**: Azul (#2563eb)
- **Botão Emergência**: Vermelho com animação pulse
- **Status**: Verde (concluído), Amarelo (pendente), Vermelho (emergência)

## 🔐 Sistema de Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Seleção de função (Admin, Supervisor, Vigilante)
- Design com gradiente azul
- Logo centralizado

## 📱 Interface Principal (Dashboard)

### Sidebar
- Logo do sistema (Shield icon)
- Informações do usuário logado
- Menu de navegação:
  - Dashboard
  - Estabelecimentos
  - Rotas
  - Funcionários
  - Rondas
  - Chat
  - Ocorrências
  - Relatórios
- Botão de logout

### Dashboard Home
- **Cards Estatísticos**:
  - Rondas Ativas (azul)
  - Rondas Concluídas (verde)
  - Ocorrências Abertas (vermelho)
  - Total de Estabelecimentos (roxo)
- **Últimas Atividades**:
  - Últimas rondas realizadas
  - Ocorrências recentes
- **Ações Rápidas**:
  - Nova Ronda
  - Registrar Ocorrência
  - Abrir Chat
  - Gerar Relatório

## 🚨 Sistema de Ocorrências
- Botão de emergência vermelho com animação
- Registro de ocorrências com:
  - Título e descrição
  - Tipo (Segurança, Manutenção, Incidente, Outro)
  - Captura automática de localização
  - Status (Aberta, Em Investigação, Resolvida)
- Cards com destaque visual para emergências

## 💬 Chat Interno
- Sistema de mensagens entre funcionários
- Interface moderna de chat
- (Funcionalidade em desenvolvimento)

## 🌐 Modo Offline
- Sistema funciona sem conexão à internet
- Dados armazenados localmente
- Sincronização automática quando voltar online
- Indicadores visuais de status de conexão
- Fila de ações pendentes

## 📱 Responsividade
- Design mobile-first
- Sidebar colapsável em dispositivos móveis
- Grid responsivo em todas as telas
- Overlay em mobile para sidebar
- Cards adaptáveis

## 🔧 Tecnologias Utilizadas
- React + TypeScript
- Tailwind CSS v4
- Lucide React (ícones)
- Supabase (backend - em configuração)
- shadcn/ui (componentes)

## 📝 Próximos Passos Sugeridos
1. Implementar backend com Supabase Edge Functions
2. Conectar banco de dados PostgreSQL
3. Adicionar notificações em tempo real
4. Implementar captura de fotos
5. Adicionar scanner de QR Code funcional
6. Desenvolver sistema de chat completo
7. Adicionar gráficos nos relatórios (usando Recharts)
8. Implementar autenticação com Supabase Auth
9. Adicionar upload de imagens para Supabase Storage
10. Criar sistema de notificações push para emergências

## 🎯 Conformidade LGPD
- Sistema preparado para armazenamento seguro de dados
- Campos de CPF e informações pessoais protegidos
- Controle de acesso por função
- (Implementação completa de LGPD pendente)