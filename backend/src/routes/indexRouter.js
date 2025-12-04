const express = require('express');
const router = express.Router();
const empresa = require('./empresa');
const usuario = require('./usuario');
const ronda = require('./ronda');
const ponto = require('./ponto');
const percurso = require('./percurso');
const mensagem = require('./mensagem');
const ocorrencia = require('./ocorrencia');
const logAcesso = require('./logAcesso');


router.use('/empresas', empresa);
router.use('/usuarios', usuario);
router.use('/rondas', ronda);
router.use('/pontos', ponto);
router.use('/percursos', percurso);
router.use('/mensagens', mensagem);
router.use('/ocorrencias', ocorrencia);
router.use('/logs', logAcesso);


module.exports = router;