module.exports = (sequelize, DataTypes) => {
return sequelize.define('LogAcesso', {
idLogA: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
dataL: DataTypes.DATEONLY,
hora: DataTypes.TIME,
sucesso: DataTypes.BOOLEAN,
ip: DataTypes.STRING,
fk_Usuario_idUsuario: DataTypes.INTEGER,
}, { tableName: 'LogAcesso', timestamps: false });
};