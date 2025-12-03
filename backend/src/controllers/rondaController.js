
const express = require('express');
const empresaService = require('../service/empresaService');

const empresaRouter = express.Router();

// POST /aluno - Criar novo aluno
alunoRouter.post("/", empresaService.criarEmpresa);

// GET /alunos - Retornar todos os alunos
alunoRouter.get("/todos", empresaService.retornaTodasEmpresas);

// GET /aluno/:id - Retornar aluno por ID
alunoRouter.get("/:id", empresaService.retornaEmpresaPorId);

// PUT /aluno/:id - Atualizar aluno
alunoRouter.put("/:id", empresaService.atualizaEmpresa);

// DELETE /aluno/:id - Deletar aluno
alunoRouter.delete("/:id", empresaService.deletaEmpresa);

module.exports = empresaRouter;