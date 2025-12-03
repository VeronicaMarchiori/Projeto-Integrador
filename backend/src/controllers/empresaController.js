
const express = require('express');
const empresaService = require('../service/empresaService');

const empresaRouter = express.Router();

// POST /aluno - Criar novo aluno
empresaRouter.post("/", empresaService.criarEmpresa);

// GET /alunos - Retornar todos os alunos
empresaRouter.get("/todos", empresaService.retornaTodasEmpresas);

// GET /aluno/:id - Retornar aluno por ID
empresaRouter.get("/:id", empresaService.retornaEmpresaPorId);

// PUT /aluno/:id - Atualizar aluno
empresaRouter.put("/:id", empresaService.atualizaEmpresa);

// DELETE /aluno/:id - Deletar aluno
empresaRouter.delete("/:id", empresaService.deletaEmpresa);

module.exports = empresaRouter;