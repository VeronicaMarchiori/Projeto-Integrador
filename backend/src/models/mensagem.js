module.exports = (sequelize, DataTypes) => {
return sequelize.define('Mensagem', {
idMensagem: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
conteudo: DataTypes.STRING,
dataM: DataTypes.DATEONLY,
hora: DataTypes.TIME,
fk_Ronda_idRonda: DataTypes.INTEGER,
fk_Usuario_idUsuario: DataTypes.INTEGER,
}, { tableName: 'Mensagem', timestamps: false });
};