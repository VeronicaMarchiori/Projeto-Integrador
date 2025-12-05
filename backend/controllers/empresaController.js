
const express = require('express');
const empresaService = require('../service/empresaService');

const empresaRouter = express.Router();

// POST /empresa - Criar novo empresa
empresaRouter.post("/", empresaService.criarEmpresa);

// GET /empresa - Retornar todos os empresa
empresaRouter.get("/todos", empresaService.retornaTodasEmpresas);

// GET /empresa/:id - Retornar empresa por ID
empresaRouter.get("/:id", empresaService.retornaEmpresaPorId);

// PUT /empresa/:id - Atualizar empresa
empresaRouter.put("/:id", empresaService.atualizaEmpresa);

// DELETE /empresa/:id - Deletar empresa
empresaRouter.delete("/:id", empresaService.deletaEmpresa);

module.exports = empresaRouter;