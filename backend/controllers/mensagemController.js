
const express = require('express');
const mensagemService = require('../service/mensagemService');

const mensagemRouter = express.Router();

// POST /mensagem - Criar novo mensagem
mensagemRouter.post("/", mensagemService.criarMensagem);

// GET /mensagem - Retornar todos os mensagem
mensagemRouter.get("/todos", mensagemService.retornaTodasMensagem);

// GET /mensagem/:id - Retornar mensagem por ID
mensagemRouter.get("/:id", mensagemService.retornaMensagemPorId);

// GET /mensagem/ronda/:id_ronda - Retornar todos os mensagem de um ronda
mensagemRouter.get("/ronda/:id_ronda", mensagemService.retornaMensagemPorRonda,);

// GET /mensagem/usuario/:id_usuario - Retornar todos os mensagem de um usuario
mensagemRouter.get("/usuario/:id_usuario", mensagemService.retornaMensagemPorUsuario,);

// PUT /mensagem/:id - Atualizar mensagem
mensagemRouter.put("/:id", mensagemService.atualizaMensagem);

// DELETE /mensagem/:id - Deletar mensagem
mensagemRouter.delete("/:id", mensagemService.deletaMensagem);

module.exports = mensagemRouter;