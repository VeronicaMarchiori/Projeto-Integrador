const express = require('express');
const router = express.Router();
const controller = require('../controllers/rondaController');
router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/pontos', controller.addPonto); // body: { pontoId }
module.exports = router;