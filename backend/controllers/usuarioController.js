
const express = require('express');
const usuarioService = require('../service/usuarioService');

const usuarioRouter = express.Router();

// POST /usuario - Criar novo usuario
usuarioRouter.post("/", usuarioService.criarUsuario);

// GET /usuario - Retornar todos os usuario
usuarioRouter.get("/todos", usuarioService.retornaTodasUsuario);

// GET /usuario/:id - Retornar usuario por ID
usuarioRouter.get("/:id", usuarioService.retornaUsuarioPorId);

// PUT /usuario/:id - Atualizar usuario
usuarioRouter.put("/:id", usuarioService.atualizaUsuario);

// DELETE /usuario/:id - Deletar usuario
usuarioRouter.delete("/:id", usuarioService.deletaUsuario);

module.exports = usuarioRouter;