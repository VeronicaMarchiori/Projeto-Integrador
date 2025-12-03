module.exports = (sequelize, DataTypes) => {
return sequelize.define('TemPontosRotas', {
fk_Ronda_idRonda: { type: DataTypes.INTEGER, primaryKey: false },
fk_PontoRonda_idPontoR: { type: DataTypes.INTEGER, primaryKey: false },
}, { tableName: 'TemPontosRotas', timestamps: false });
};