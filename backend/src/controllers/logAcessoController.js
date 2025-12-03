
const express = require('express');
const logAcessoService = require('../service/logAcessoService');

const logAcessoRouter = express.Router();

// POST /aluno - Criar novo aluno
logAcessoRouter.post("/", logAcessoService.criarlogAcesso);

// GET /alunos - Retornar todos os alunos
logAcessoRouter.get("/todos", logAcessoService.retornaTodoslogAcesso);

// GET /aluno/:id - Retornar aluno por ID
logAcessoRouter.get("/:id", logAcessoService.retornalogAcessoPorId);

// PUT /aluno/:id - Atualizar aluno
logAcessoRouter.put("/:id", logAcessoService.atualizalogAcesso);

// DELETE /aluno/:id - Deletar aluno
logAcessoRouter.delete("/:id", logAcessoService.deletalogAcesso);

module.exports = logAcessoRouter;