
const express = require('express');
const temPontosRondasService = require('../service/temPontosRondasService');

const temPontosRondasRouter = express.Router();

// POST /temPontosRondas - Criar novo temPontosRondas
temPontosRondasRouter.post("/", temPontosRondasService.criarTemPontosRondas);

// GET /temPontosRondas - Retornar todos os temPontosRondas
temPontosRondasRouter.get("/todos", temPontosRondasService.retornaTodasTemPontosRondas);

// GET /temPontosRondas/:id_ronda - Retornar todas as temPontosRondas do ronda
temPontosRondasRouter.get("/ronda/:id_ronda", temPontosRondasService.retornaTemPontosRondasRonda);

// GET /temPontosRondas/:id_pontoRonda - Retornar todas as temPontosRondas do pontoRonda
temPontosRondasRouter.get("/pontosRondas/:id_pontoRonda", temPontosRondasService.retornaTodasTemPontosRondasPontoRonda);

// PUT /temPontosRondas/:id_ronda - Atualizar temPontosRondas
temPontosRondasRouter.put("/:id_ronda", temPontosRondasService.atualizaTemPontosRondas);

// DELETE /temPontosRondas/:id_ronda - Deletar temPontosRondas
temPontosRondasRouter.delete("/:id_ronda", temPontosRondasService.deletaTemPontosRondas);

module.exports = temPontosRondasRouter;