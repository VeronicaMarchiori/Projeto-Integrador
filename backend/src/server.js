const app = require('./app');
const { sequelize } = require('./models');


const PORT = process.env.PORT || 3000;


(async () => {
try {
await sequelize.authenticate();
// sincronia automatica: cria tabelas caso nao existam (sem apagar dados)
await sequelize.sync({ alter: true });
console.log('Database connected and synced');


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
console.error('Failed to start server:', err);
}
})();