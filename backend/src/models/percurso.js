module.exports = (sequelize, DataTypes) => {
return sequelize.define('Percurso', {
idPercurso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
dataInicia: DataTypes.DATE,
dataFim: DataTypes.DATE,
kmPercorrido: DataTypes.DECIMAL(10,2),
observacoes: DataTypes.STRING,
fk_Ronda_idRonda: DataTypes.INTEGER,
}, { tableName: 'Percurso', timestamps: false });
};