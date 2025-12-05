const express = require("express");
const cors = require("cors");
const alunoRouter = require("./controllers/aluno-controller");
const cursoRouter = require("./controllers/curso-controller");
const matriculaRouter = require("./controllers/matricula-controller");
const professorRouter = require("./controllers/professor-controller");
const ccrRouter = require("./controllers/ccr-controller");
const professorCcrRouter = require("./controllers/professor_ccr-controller");
const usuarioPermissaoRouter = require("./controllers/usuario_permissao-controller");
const usuarioRouter = require("./controllers/usuario-controller");
const permissaoRouter = require("./controllers/permissao-controller");
const authRouter = require("./controllers/auth-controller");
const authService = require("./services/auth-service");

const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar express-session ANTES do passport.session()
app.use(
	session({
		secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // false para desenvolvimento (true requer HTTPS)
	}),
);

app.use(passport.initialize());
app.use(passport.session());

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

// Usar o router de autenticação
app.use("/", authRouter);

// Usar o router de alunos
app.use("/Usuario", alunoRouter);
app.use("/curso", cursoRouter);
app.use("/matricula", matriculaRouter);
app.use("/professor", professorRouter);
app.use("/ccr", ccrRouter);
app.use("/professor_ccr", professorCcrRouter);
app.use("/usuario_permissao", usuarioPermissaoRouter);
app.use("/usuario", usuarioRouter);
app.use("/permissao", permissaoRouter);
