# 🎯 Guia de Teste - Interface do Vigilante

## 📋 Visão Geral
Sistema completo de gestão de rondas para vigilantes com 3 rotas de demonstração já cadastradas.

## 🚀 Como Testar

### 1️⃣ **Acesso ao Sistema**
- Faça login com um usuário que tenha `role: 'guard'` (vigia)
- O sistema automaticamente carregará o `GuardDashboard`

### 2️⃣ **Tela Principal (Menu de Rotas)**

Você verá **3 rotas disponíveis**:

#### 📍 **Rota 1 - Perímetro Externo**
- **5 pontos** de verificação:
  1. Portão Principal
  2. Muro Lateral Esquerdo
  3. Fundos do Estabelecimento
  4. Muro Lateral Direito
  5. Portão de Serviço

#### 🏢 **Rota 2 - Área Interna**
- **4 pontos** de verificação:
  1. Recepção
  2. Corredor Central
  3. Sala de Reuniões
  4. Almoxarifado

#### 🚗 **Rota 3 - Estacionamento**
- **3 pontos** de verificação:
  1. Entrada do Estacionamento
  2. Área de Veículos Setor A
  3. Área de Veículos Setor B

---

## 🔄 Fluxo Completo de Uma Ronda

### **PASSO 1: Selecionar Rota**
1. Na tela principal, clique em qualquer rota
2. Você verá o botão de **Play** (▶️) preto
3. Ao clicar, entrará nos detalhes da rota

### **PASSO 2: Aba Pontos (MapPin)**

#### **A) Iniciar Ronda**
1. Clique no botão verde **"Iniciar Ronda"**
2. A ronda é iniciada e o botão muda para vermelho **"Faltam X pontos"**
3. Sua localização GPS é capturada automaticamente

#### **B) Verificar Cada Ponto**
Para cada ponto da lista:
1. Clique no botão **QR Code** (vermelho) do ponto
2. Um modal abre com 2 opções:
   - **"Abrir Câmera"** - Escanear QR Code ao vivo
   - **"Enviar Foto do QR Code"** - Upload de imagem

#### **C) Simular Escaneamento**
No modo demonstração:
1. Clique em **"Abrir Câmera"**
2. Clique em **"Capturar"**
3. O sistema simula a leitura do QR Code
4. Aguarde 1 segundo
5. O ponto fica **verde com ✓**

#### **D) Finalizar Ronda**
1. Após verificar **todos os pontos**
2. O botão vermelho muda para **"Finalizar Ronda"**
3. Clique para finalizar
4. Mensagem de sucesso aparece
5. Você volta para o menu principal

---

### **PASSO 3: Aba Chat (MessageSquare)**

1. Clique na aba **"Chat"**
2. Você verá mensagens de exemplo (se houver)
3. Digite uma mensagem no campo inferior
4. Clique no botão **"Enviar"** (✉️)
5. Sua mensagem aparece em **vermelho** (usuário atual)
6. Mensagens de outros aparecem em **branco**

**Recursos do Chat:**
- 📎 Anexar arquivos
- 📷 Enviar fotos
- 🕒 Timestamps automáticos
- 💬 Diferenciação visual de remetentes

---

### **PASSO 4: Aba Ocorrências (AlertTriangle)**

#### **🚨 Botão de EMERGÊNCIA**
1. Botão **vermelho pulsante** no topo
2. Clique para acionar emergência
3. Confirmação: "⚠️ CONFIRMAR EMERGÊNCIA?"
4. Notifica imediatamente supervisores

#### **📝 Registrar Ocorrência**
1. Clique em **"Registrar Nova Ocorrência"**
2. Preencha o formulário:

**Campos obrigatórios:**
- **Tipo**: Atividade Suspeita, Dano, Acidente, Incêndio, etc.
- **Gravidade**: Baixa / Média / Alta / EMERGÊNCIA
- **Descrição**: Texto livre descrevendo o ocorrido

**Campos automáticos:**
- 📍 **GPS**: Localização capturada automaticamente
- 🕒 **Timestamp**: Data e hora do registro

**Opcional:**
- 📷 **Foto**: Tirar foto da ocorrência

3. Clique em **"Registrar"**
4. Ocorrência aparece na lista abaixo

#### **📊 Lista de Ocorrências**
- Visualize todas as ocorrências registradas
- **Tags coloridas** de gravidade e status
- Localização GPS de cada ocorrência
- Fotos anexadas (se houver)

---

## 🎨 Interface Visual

### **Header (Topo)**
- 🔴 Fundo vermelho
- 📸 Foto do usuário
- 👤 Nome completo do vigilante
- 🏷️ Função: "Vigia"
- ☰ Menu hambúrguer

### **Cards de Rota**
- ▶️ Botão Play preto (ou cinza se bloqueado)
- 📋 Nome da rota
- 📊 Status:
  - ✅ "Concluída" (verde)
  - 🕒 "Faltam X pontos" (amarelo)
  - ⏰ "Pronta para iniciar" (cinza)

### **Pontos da Rota**
- 🔢 Badge numerado (1, 2, 3...)
- ✅ Badge verde com check quando verificado
- 📍 Coordenadas GPS
- 🔴 Botão QR Code vermelho

### **Progress Bar**
- Barra de progresso visual
- % de conclusão
- "X de Y pontos verificados"

---

## ✨ Funcionalidades Principais

### ✅ **Validações**
- ❌ Não pode finalizar sem verificar todos os pontos
- ❌ QR Code incorreto não é aceito
- ❌ Ronda fora do horário fica bloqueada
- ✅ Validação de dia da semana

### 📱 **Recursos Mobile**
- Câmera nativa do celular
- Captura de GPS em tempo real
- Interface responsiva
- Botões grandes e fáceis de tocar

### 💾 **Persistência**
- Dados salvos localmente
- Sincronização com backend
- Modo offline funcional

---

## 🧪 Cenários de Teste

### **Cenário 1: Ronda Completa**
1. ✅ Iniciar rota
2. ✅ Verificar todos os pontos (5/4/3)
3. ✅ Finalizar ronda
4. ✅ Retornar ao menu

### **Cenário 2: Chat em Ronda**
1. ✅ Entrar em rota
2. ✅ Ir para aba Chat
3. ✅ Enviar mensagens
4. ✅ Voltar para pontos

### **Cenário 3: Ocorrência**
1. ✅ Entrar em rota
2. ✅ Ir para aba Ocorrências
3. ✅ Registrar ocorrência com foto
4. ✅ Ver na lista

### **Cenário 4: Emergência**
1. ✅ Entrar em rota
2. ✅ Ir para aba Ocorrências
3. ✅ Clicar em EMERGÊNCIA
4. ✅ Confirmar ação

---

## 📊 Dados de Demonstração

### **Rota 1 (route-1)**
- 5 pontos cadastrados
- 1 ocorrência (Lâmpada queimada - Baixa)
- 2 mensagens no chat

### **Rota 2 (route-2)**
- 4 pontos cadastrados
- Sem ocorrências
- Sem mensagens

### **Rota 3 (route-3)**
- 3 pontos cadastrados
- Sem ocorrências
- Sem mensagens

---

## 🔧 QR Codes dos Pontos

Os QR Codes esperados para cada ponto:

### **Rota 1:**
1. `QR_PORTAO_PRINCIPAL_001`
2. `QR_MURO_ESQUERDO_002`
3. `QR_FUNDOS_003`
4. `QR_MURO_DIREITO_004`
5. `QR_PORTAO_SERVICO_005`

### **Rota 2:**
1. `QR_RECEPCAO_001`
2. `QR_CORREDOR_002`
3. `QR_SALA_REUNIOES_003`
4. `QR_ALMOXARIFADO_004`

### **Rota 3:**
1. `QR_ENTRADA_ESTACIONAMENTO_001`
2. `QR_SETOR_A_002`
3. `QR_SETOR_B_003`

---

## 🎯 Próximos Passos

Após testar a interface:
1. ✅ Integração completa com Supabase
2. ✅ Implementação de sincronização offline
3. ✅ Biblioteca de leitura de QR Code real (jsQR)
4. ✅ Upload de fotos para storage
5. ✅ Notificações push para emergências
6. ✅ Relatórios de rondas concluídas

---

**Desenvolvido com ❤️ para segurança e eficiência**
