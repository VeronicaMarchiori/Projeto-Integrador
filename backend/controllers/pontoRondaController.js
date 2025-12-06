const express = require('express');
const pontoRondaService = require('../service/pontoRondaService');

const pontoRondaRouter = express.Router();

// GET /pontos-ronda - Listar todos os pontos de ronda
pontoRondaRouter.get('/', async (req, res) => {
  try {
    const pontos = await pontoRondaService.retornaTodosPontosRonda();
    res.json({ success: true, data: pontos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /pontos-ronda/:id - Buscar ponto de ronda por ID
pontoRondaRouter.get('/:id', async (req, res) => {
  try {
    const ponto = await pontoRondaService.retornaPontoRondaPorId(req.params.id);
    if (!ponto) {
      return res.status(404).json({ success: false, message: 'Ponto de ronda não encontrado' });
    }
    res.json({ success: true, data: ponto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /pontos-ronda - Criar novo ponto de ronda
pontoRondaRouter.post('/', async (req, res) => {
  try {
    const ponto = await pontoRondaService.criaPontoRonda(req.body);
    res.status(201).json({ success: true, data: ponto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /pontos-ronda/:id - Atualizar ponto de ronda
pontoRondaRouter.put('/:id', async (req, res) => {
  try {
    const ponto = await pontoRondaService.atualizaPontoRonda(req.params.id, req.body);
    if (!ponto) {
      return res.status(404).json({ success: false, message: 'Ponto de ronda não encontrado' });
    }
    res.json({ success: true, data: ponto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /pontos-ronda/:id - Deletar ponto de ronda
pontoRondaRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await pontoRondaService.deletaPontoRonda(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Ponto de ronda não encontrado' });
    }
    res.json({ success: true, message: 'Ponto de ronda deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = pontoRondaRouter;
