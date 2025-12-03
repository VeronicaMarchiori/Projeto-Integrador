module.exports = (sequelize, DataTypes) => {
return sequelize.define('PontoRonda', {
idPontoR: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
descricao: DataTypes.STRING,
latitude: DataTypes.DECIMAL(10,7),
longitude: DataTypes.DECIMAL(10,7),
qrcode: DataTypes.STRING,
obrigatoro: DataTypes.BOOLEAN,
dataP: DataTypes.DATEONLY,
hora: DataTypes.TIME,
}, { tableName: 'PontoRonda', timestamps: false });
};