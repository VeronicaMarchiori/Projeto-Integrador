
const express = require('express');
const vigiaService = require('../service/vigiaService');

const vigiaRouter = express.Router();

// POST /vigia - Criar novo vigia
vigiaRouter.post("/", vigiaService.criarVigia);

// GET /vigia - Retornar todos os vigia
vigiaRouter.get("/todos", vigiaService.retornaTodosVigia);

// GET /vigia/usuario/:id_usuario - Retornar todos os vigia de um usuario
vigiaRouter.get("/usuario/:id_usuario", vigiaService.retornaVigiaPorUsuario)

// PUT /vigia/:id_usuario - Atualizar vigia
vigiaRouter.put("/:id_usuario", vigiaService.atualizaVigia);

// DELETE /vigia/:id_usuario - Deletar vigia
vigiaRouter.delete("/:id_usuario", vigiaService.deletaVigia);

module.exports = vigiaRouter;