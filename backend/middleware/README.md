# 🔧 MIDDLEWARES

## 📁 Arquivos (2)

```
middleware/
├── auth.js      ← Autenticação JWT + Autorização
└── index.js     ← CORS + Errors + Logger
```

---

## 🛡️ auth.js

### Exports:
- `authMiddleware` - Valida token JWT
- `adminOnly` - Apenas administradores
- `vigiaOnly` - Apenas vigias

### Uso:
```javascript
const { authMiddleware, adminOnly, vigiaOnly } = require("./middleware/auth");

// Proteger rota
router.get("/perfil", authMiddleware, controller.getPerfil);

// Admin apenas
router.post("/empresa", authMiddleware, adminOnly, controller.criar);

// Vigia apenas
router.post("/ronda", authMiddleware, vigiaOnly, controller.iniciar);
```

---

## ⚙️ index.js

### Exports:
- `corsMiddleware` - CORS para frontend
- `errorHandler` - Tratamento de erros
- `notFoundHandler` - Rotas 404
- `requestLogger` - Log de requisições
- `asyncHandler` - Wrapper async

### Uso:
```javascript
const { 
  corsMiddleware, 
  requestLogger, 
  notFoundHandler, 
  errorHandler 
} = require("./middleware");

// Server.js
app.use(corsMiddleware);
app.use(requestLogger);
// ... rotas
app.use(notFoundHandler);
app.use(errorHandler);
```

---

## 📖 Documentação Completa

Ver: `/backend/MIDDLEWARE_SIMPLIFICADO.md`
