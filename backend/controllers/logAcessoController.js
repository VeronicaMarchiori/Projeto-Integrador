
const express = require('express');
const logAcessoService = require('../service/logAcessoService');

const logAcessoRouter = express.Router();

// POST /logAcesso - Criar novo logAcesso
logAcessoRouter.post("/", logAcessoService.criarLogAcesso);

// GET /logAcesso - Retornar todos os logAcesso
logAcessoRouter.get("/todos", logAcessoService.retornaTodosLogAcesso);

// GET /logAcesso/:id - Retornar logAcesso por ID
logAcessoRouter.get("/:id", logAcessoService.retornaLogAcessoPorId);

// GET /logAcesso/usuario/:id_usuario - Retornar todos os logAcesso de um usuario
logAcessoRouter.get("/usuario/:id_usuario", logAcessoService.retornaLogAcessoPorUsuario);

// PUT /logAcesso/:id - Atualizar logAcesso
logAcessoRouter.put("/:id", logAcessoService.atualizaLogAcesso);

// DELETE /logAcesso/:id - Deletar logAcesso
logAcessoRouter.delete("/:id", logAcessoService.deletaLogAcesso);

module.exports = logAcessoRouter;