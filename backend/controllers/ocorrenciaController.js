
const express = require('express');
const ocorrenciaService = require('../service/ocorrenciaService');

const ocorrenciaRouter = express.Router();

// POST /ocorrencia - Criar novo ocorrencia
ocorrenciaRouter.post("/", ocorrenciaService.criarOcorrencia);

// GET /ocorrencia - Retornar todos os ocorrencia
ocorrenciaRouter.get("/todos", ocorrenciaService.retornaTodasOcorrencia);

// GET /ocorrencia/:id - Retornar ocorrencia por ID
ocorrenciaRouter.get("/:id", ocorrenciaService.retornaOcorrenciaPorId);

// GET /ocorrencia/percurso/:id_percurso - Retornar todos os ocorrencia de um percurso
ocorrenciaRouter.get("/percurso/:id_percurso", ocorrenciaService.retornaOcorrenciaPorPercurso);

// PUT /ocorrencia/:id - Atualizar ocorrencia
ocorrenciaRouter.put("/:id", ocorrenciaService.atualizaOcorrencia);

// DELETE /ocorrencia/:id - Deletar ocorrencia
ocorrenciaRouter.delete("/:id", ocorrenciaService.deletaOcorrencia);

module.exports = ocorrenciaRouter;