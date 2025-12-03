# Credenciais teste de acesso ao sistema

## ⚡ Acesso Rápido

| Tipo | Email | Senha |
|------|-------|-------|
| 👑 **Admin** | `admin@admin.com` | `admin` |
| 🛡️ **Vigilante** | `vigilante@vigilante.com` | `vigilante` |


## 📋 Sistema com Dois Níveis de Acesso

### 👑 ADMINISTRADOR
```
Email: admin@admin.com
Senha: admin
```

**Telas Disponíveis:**
- ✅ **Funcionários da Ronda** - Visualização de todos os vigilantes do sistema
- ✅ **Criar Novo Vigilante** - Cadastro de novos vigilantes (tela cosmética)
- ✅ **Relatórios das Rondas** - Análise completa das rondas realizadas

**Recursos:**
- Visualizar lista completa de vigilantes
- Cadastrar novos vigilantes no sistema (demonstração)
- Acompanhar estatísticas da equipe
- Gerar relatórios detalhados por período
- Filtrar rondas por data, vigilante e status
- Exportar dados para análise externa

---

### 🛡️ VIGILANTE
```
Email: vigilante@vigilante.com
Senha: vigilante
```

**Telas Disponíveis:**
- ✅ **Dashboard do Vigilante** - Interface específica para rondas
- ✅ **Mapa GPS** - Navegação em tempo real
- ✅ **Registro de Pontos** - Verificação por QR Code/Foto
- ✅ **Chat** - Comunicação com equipe
- ✅ **Ocorrências** - Registro de incidentes

**Recursos:**
- Visualizar rotas disponíveis
- Iniciar e executar rondas
- Verificar pontos por QR Code ou foto
- Navegação GPS em tempo real
- Registrar ocorrências com localização
- Chat com outros vigilantes
- Botão de emergência
- Histórico de rondas realizadas

---

## 🎯 Teste Rápido - Fluxo Completo

### 👑 Como Administrador
1. **Login**: `admin@admin.com` / `admin`
2. **Funcionários da Ronda**:
   - Veja todos os vigilantes cadastrados
   - Visualize estatísticas da equipe
   - Acesse perfis individuais
3. **Criar Novo Vigilante** (Demonstração):
   - Formulário completo de cadastro
   - Dados pessoais e de acesso
   - Contato de emergência
   - Tela cosmética (não salva dados reais)
4. **Relatórios das Rondas**:
   - Configure filtros de período
   - Veja estatísticas detalhadas
   - Analise rondas por vigilante
   - Exporte dados em CSV

### 🛡️ Como Vigilante
1. **Login**: `vigilante@vigilante.com` / `vigilante`
2. **Dashboard do Vigilante**:
   - Interface específica para rondas
   - Visualização de rotas disponíveis
   - Mapa interativo
3. **Executar Ronda**:
   - Selecione uma rota no mapa
   - Clique em "Iniciar Ronda"
   - Navegue pelos pontos com GPS
   - Verifique cada ponto (QR Code/Foto)
4. **Registrar Ocorrência**:
   - Clique no botão "Ocorrências"
   - Preencha tipo e descrição
   - GPS capturado automaticamente
   - Adicione fotos se necessário
5. **Chat da Equipe**:
   - Acesse o chat integrado
   - Comunique-se com outros vigilantes
   - Histórico de mensagens

---

## 🔄 Armazenamento

- **Credenciais**: Fixas no sistema (hardcoded)
- **Sessão**: Mantida no `localStorage`
- **Dados**: Salvos localmente para demo

**Para Resetar:**
```javascript
// No Console do navegador (F12)
localStorage.clear()
// Depois recarregue a página
```

---

## 📱 Responsividade

- ✅ **Desktop**: Interface completa com sidebar
- ✅ **Tablet**: Layout adaptável
- ✅ **Mobile**: Interface otimizada
  - Menu hambúrguer
  - Navegação simplificada
  - GPS em tela cheia
  - Botões grandes para toque

---

## 🔒 Segurança

- ✅ Autenticação obrigatória
- ✅ Separação de permissões por role
- ✅ Sessão segura
- ✅ Logout automático ao fechar

---

## 🚀 Funcionalidades Principais

### Para Admin
1. **Gestão de Equipe**: Visualização completa dos vigilantes
2. **Cadastro de Vigilantes**: Formulário completo para novos cadastros (cosmético)
3. **Análise de Dados**: Relatórios detalhados e estatísticas
4. **Exportação**: Dados em formato CSV para análise

### Para Vigilante
1. **Execução de Rondas**: Interface intuitiva para rondas
2. **GPS em Tempo Real**: Navegação precisa
3. **Registro de Pontos**: QR Code e fotos
4. **Comunicação**: Chat integrado
5. **Emergência**: Botão de pânico
6. **Offline**: Funciona sem internet, sincroniza depois

---

## 📝 Observações

- ⚠️ Sistema de demonstração (não conectado ao Supabase)
- ⚠️ Dados salvos localmente no navegador
- ⚠️ Credenciais fixas para facilitar testes
- ✅ Pronto para integração com backend real
- ✅ Código preparado para produção
