
const express = require('express');
const administradorService = require('../service/administradorService');

const administradorRouter = express.Router();

// POST /administrador - Criar novo administrador
administradorRouter.post("/", administradorService.criarAdministrador);

// GET /administrador - Retornar todos os administrador
administradorRouter.get("/todos", administradorService.retornaTodosAdministrador);

// GET /administrador/usuario/:id_usuario - Retornar todos os administrador de um usuario
administradorRouter.get("/usuario/:id_usuario", administradorService.retornaAdministradorPorUsuario);

// PUT /administrador/:id_usuario - Atualizar administrador
administradorRouter.put("/:id_usuario", administradorService.atualizaAdministrador);

// DELETE /administrador/:id_usuario - Deletar administrador
administradorRouter.delete("/:id_usuario", administradorService.deletaAdministrador);

module.exports = administradorRouter;