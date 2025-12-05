
const express = require('express');
const pontoRondaService = require('../service/pontoRondaService');

const pontoRondaRouter = express.Router();

// POST /pontoRonda - Criar novo pontoRonda
pontoRondaRouter.post("/", pontoRondaService.criarPontoRonda);

// GET /pontoRonda - Retornar todos os pontoRonda
pontoRondaRouter.get("/todos", pontoRondaService.retornaTodasPontoRonda);

// GET /pontoRonda/:id - Retornar pontoRonda por ID
pontoRondaRouter.get("/:id", pontoRondaService.retornaPontoRondaPorId);

// PUT /pontoRonda/:id - Atualizar pontoRonda
pontoRondaRouter.put("/:id", pontoRondaService.atualizaPontoRonda);

// DELETE /pontoRonda/:id - Deletar pontoRonda
pontoRondaRouter.delete("/:id", pontoRondaService.deletaPontoRonda);

module.exports = pontoRondaRouter;