
const express = require('express');
const percursoService = require('../service/percursoService');

const percursoRouter = express.Router();

// POST /percurso - Criar novo percurso
percursoRouter.post("/", percursoService.criarPercurso);

// GET /percurso - Retornar todos os percurso
percursoRouter.get("/todos", percursoService.retornaTodasPercurso);

// GET /percurso/:id - Retornar percurso por ID
percursoRouter.get("/:id", percursoService.retornaPercursoPorId);

// GET /percurso/ronda/:id_ronda - Retornar todos os percurso de um ronda
percursoRouter.get("/ronda/:id_ronda", percursoService.retornaPercursoPorRonda);

// PUT /percurso/:id - Atualizar percurso
percursoRouter.put("/:id", percursoService.atualizaPercurso);

// DELETE /percurso/:id - Deletar percurso
percursoRouter.delete("/:id", percursoService.deletaPercurso);

module.exports = percursoRouter;