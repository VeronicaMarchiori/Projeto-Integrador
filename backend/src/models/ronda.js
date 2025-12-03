module.exports = (sequelize, DataTypes) => {
return sequelize.define('Ronda', {
idRonda: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
nome: DataTypes.STRING,
sequenciaPontos: DataTypes.INTEGER,
tempoEstimado: DataTypes.TIME,
periodo: DataTypes.INTEGER,
fk_Empresa_idEmpresa: DataTypes.INTEGER,
}, { tableName: 'Ronda', timestamps: false });
};