const express = require('express');
const router = express.Router();
const controller = require('../controllers/percursoController');
router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/atribuir-vigia', controller.assignVigia); // body: { vigiaId }
module.exports = router;