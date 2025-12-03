module.exports = (sequelize, DataTypes) => {
return sequelize.define('Usuario', {
idUsuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
nome: DataTypes.STRING,
cpf: DataTypes.STRING,
telefone: DataTypes.STRING,
email: DataTypes.STRING,
loginU: DataTypes.STRING,
senha: DataTypes.STRING,
ativo: DataTypes.BOOLEAN,
}, { tableName: 'Usuario', timestamps: false });
};