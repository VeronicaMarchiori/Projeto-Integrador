
const express = require('express');
const rondaService = require('../service/rondaService');

const rondaRouter = express.Router();

// POST /ronda - Criar novo ronda
rondaRouter.post("/", rondaService.criarRonda);

// GET /ronda - Retornar todos os ronda
rondaRouter.get("/todos", rondaService.retornaTodasRonda);

// GET /ronda/:id - Retornar ronda por ID
rondaRouter.get("/:id", rondaService.retornaRondaPorId);

// GET /ronda/empresa/:id_empresa - Retornar todos os ronda de um empresa
rondaRouter.get("/empresa/:id_empresa", rondaService.retornaRondaPorEmpresa,);

// GET /ronda/administrador/:id_administrador - Retornar todos os ronda de um administrador
rondaRouter.get("/administrador/:id_administrador", rondaService.retornaRondaPorAdministrador,);

// PUT /ronda/:id - Atualizar ronda
rondaRouter.put("/:id", rondaService.atualizaRonda);

// DELETE /ronda/:id - Deletar ronda
rondaRouter.delete("/:id", rondaService.deletaRonda);

module.exports = rondaRouter;