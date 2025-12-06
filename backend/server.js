const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Controllers
const authController = require("./controllers/authController");
const empresaController = require("./controllers/empresaController");
const usuarioController = require("./controllers/usuarioController");
const rondaController = require("./controllers/rondaController");
const pontoRondaController = require("./controllers/pontoRondaController");
const percursoController = require("./controllers/percursoController");
const ocorrenciaController = require("./controllers/ocorrenciaController");
const mensagemController = require("./controllers/mensagemController");
const logAcessoController = require("./controllers/logAcessoController");
const vigiaController = require("./controllers/vigiaController");
const administradorController = require("./controllers/administradorController");

// Models
const db = require("./models");
const app = express();

// Configurar middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configurar express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sistema_rondas_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // false para desenvolvimento (true requer HTTPS)
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de log de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    name: "Sistema de Rondas - API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      auth: "/api/auth",
      empresas: "/api/empresas",
      usuarios: "/api/usuarios",
      rondas: "/api/rondas",
      pontosRonda: "/api/pontos-ronda",
      percursos: "/api/percursos",
      ocorrencias: "/api/ocorrencias",
      mensagens: "/api/mensagens",
      logsAcesso: "/api/logs-acesso",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rotas da API
app.use("/api/auth", authController);
app.use("/api/empresas", empresaController);
app.use("/api/usuarios", usuarioController);
app.use("/api/rondas", rondaController);
app.use("/api/pontos-ronda", pontoRondaController);
app.use("/api/percursos", percursoController);
app.use("/api/ocorrencias", ocorrenciaController);
app.use("/api/mensagens", mensagemController);
app.use("/api/logs-acesso", logAcessoController);
app.use("/api/vigias", vigiaController);
app.use("/api/administradores", administradorController);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Erro interno do servidor",
  });
});

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

// Inicializar servidor
const startServer = async () => {
  try {
    // Sincronizar banco de dados
    await db.sequelize.sync({ alter: true });
    console.log(" Banco de dados sincronizado");

    // Inserir dados iniciais
    await seedDatabase();

    // Iniciar servidor
    app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

  } catch (error) {
    console.error(" Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Função para inserir dados iniciais
const seedDatabase = async () => {
  try {
    const bcrypt = require("bcryptjs");

    // Verificar se já existem usuários
    const userCount = await db.Usuario.count();

    if (userCount === 0) {
      console.log("Inserindo dados iniciais...");

      // Criar usuário administrador
      const senhaAdminHash = await bcrypt.hash("admin", 10);
      const admin = await db.Usuario.create({
        nome: "Administrador",
        cpf: "000.000.000-00",
        telefone: "(11) 99999-9999",
        email: "admin@admin.com",
        login: "admin",
        senha: senhaAdminHash,
        ativo: true,
      });

      await db.Administrador.create({
        idUsuario: admin.idUsuario,
        nivelAcesso: "master",
      });

      // Criar usuário vigilante
      const senhaVigiaHash = await bcrypt.hash("vigilante", 10);
      const vigia = await db.Usuario.create({
        nome: "Vigilante",
        cpf: "111.111.111-11",
        telefone: "(11) 98888-8888",
        email: "vigilante@vigilante.com",
        login: "vigilante",
        senha: senhaVigiaHash,
        ativo: true,
      });

      await db.Vigia.create({
        idUsuario: vigia.idUsuario,
        foto: null,
        EstaRonda: false,
      });

      // Criar empresa exemplo
      await db.Empresa.create({
        nome: "Empresa Exemplo LTDA",
        cnpj: "00.000.000/0001-00",
        endereco: "Rua Exemplo, 123",
        telefone: "(11) 3333-3333",
        email: "contato@empresa.com",
      });

      console.log("Dados iniciais inseridos com sucesso");
      console.log("Admin - Email: admin@admin.com | Senha: admin");
      console.log("Vigia - Email: vigilante@vigilante.com | Senha: vigilante");
    }
  } catch (error) {
    console.error("Erro ao inserir dados iniciais:", error);
  }
};

// Iniciar o servidor
startServer();

module.exports = app;