"use strict";

module.exports = (sequelize, DataTypes) => {
	const Administrador = sequelize.define(
		"Administrador",
		{
            idUsuario: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				foreignKey: true,
			},
			nivelAcesso: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "administrador",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Administrador.associate = function (models)  {
		Administrador.belongsTo(models.Usuario, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
		Administrador.hasMany(models.Ronda, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});
	};

	return Administrador;
};