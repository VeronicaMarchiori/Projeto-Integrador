module.exports = (sequelize, DataTypes) => {
return sequelize.define('Vigia', {
fk_Usuario_idUsuario: { type: DataTypes.INTEGER, primaryKey: true },
disponivel: DataTypes.BOOLEAN,
dataCriacao: DataTypes.DATEONLY,
}, { tableName: 'Vigia', timestamps: false });
};