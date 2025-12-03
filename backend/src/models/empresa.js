module.exports = (sequelize, DataTypes) => {
return sequelize.define('Empresa', {
idEmpresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
nome: DataTypes.STRING,
cnpj: DataTypes.STRING,
endereco: DataTypes.STRING,
telefone: DataTypes.STRING,
email: DataTypes.STRING,
}, { tableName: 'Empresa', timestamps: false });
};