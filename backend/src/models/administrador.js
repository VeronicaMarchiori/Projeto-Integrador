"use strict";

module.exports = (sequelize, DataTypes) => {
	const Administrador = sequelize.define(
		"Administrador",
		{
            fk_Usuario_idUsuario: {
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

	Administrador.associate = function (models) {
		Administrador.belongsTo(models.Usuario {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
	};

	return Administrador;
};