module.exports = (sequelize, DataTypes) => {
return sequelize.define('RealizaPercurso', {
fk_Vigia_fk_Usuario_idUsuario: { type: DataTypes.INTEGER, primaryKey: false },
fk_Percurso_idPercurso: { type: DataTypes.INTEGER, primaryKey: false },
}, { tableName: 'realizaPercurso', timestamps: false });
};