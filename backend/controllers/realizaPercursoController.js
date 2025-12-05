
const express = require('express');
const realizaPercursoService = require('../service/realizaPercursoService');

const realizaPercursoRouter = express.Router();

// POST /realizaPercurso - Criar novo realizaPercurso
realizaPercursoRouter.post("/", realizaPercursoService.criarRealizaPercurso);

// GET /realizaPercurso - Retornar todos os realizaPercurso
realizaPercursoRouter.get("/todos", realizaPercursoService.retornaTodasRealizaPercurso);

// GET /realizaPercurso/:id_vigia - Retornar todas as realizaPercurso do vigia
realizaPercursoRouter.get("/vigia/:id_vigia", realizaPercursoService.retornaRealizaPercursoVigia);

// GET /realizaPercurso/:id_percurso - Retornar todas as realizaPercurso do percurso
realizaPercursoRouter.get("/percurso/:id_percurso", realizaPercursoService.retornaTodasRealizaPercursoPercurso);

// PUT /realizaPercurso/:id_vigia - Atualizar realizaPercurso
realizaPercursoRouter.put("/:id_vigia", realizaPercursoService.atualizaRealizaPercurso);

// DELETE /realizaPercurso/:id_vigia - Deletar realizaPercurso
realizaPercursoRouter.delete("/:id_vigia", realizaPercursoService.deletaRealizaPercurso);

module.exports = realizaPercursoRouter;