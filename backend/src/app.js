const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);


app.get('/', (req, res) => res.json({ ok: true, message: 'Vigia monitoramento backend' }));


module.exports = app;