
const express = require('express');
const logAcessoService = require('../service/logAcessoService');

const logAcessoRouter = express.Router();

// POST /logAcesso - Criar novo logAcesso
logAcessoRouter.post("/", logAcessoService.criarlogAcesso);

// GET /logAcesso - Retornar todos os logAcesso
logAcessoRouter.get("/todos", logAcessoService.retornaTodoslogAcesso);

// GET /logAcesso/:id - Retornar logAcesso por ID
logAcessoRouter.get("/:id", logAcessoService.retornalogAcessoPorId);

// GET /logAcesso/usuario/:id_usuario - Retornar todos os logAcesso de um usuario
logAcessoRouter.get("/usuario/:id_usuario", logAcessoService.retornaLogAcessoPorUsuario);

// PUT /logAcesso/:id - Atualizar logAcesso
logAcessoRouter.put("/:id", logAcessoService.atualizalogAcesso);

// DELETE /logAcesso/:id - Deletar logAcesso
logAcessoRouter.delete("/:id", logAcessoService.deletalogAcesso);

module.exports = logAcessoRouter;