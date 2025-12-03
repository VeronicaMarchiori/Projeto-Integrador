const express = require('express');
const router = express.Router();
const controller = require('../controllers/logAcessoController');
router.post('/', controller.create);
module.exports = router;