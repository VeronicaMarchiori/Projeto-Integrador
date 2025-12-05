"use strict";

module.exports = (sequelize, DataTypes) => {
	const Vigia = sequelize.define(
		"Vigia",
		{
            idUsuario: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				foreignKey: true,
			},
			disponivel: DataTypes.BOOLEAN,
            dataCriacao: DataTypes.DATEONLY,
		},
		{
			sequelize,
			tableName: "Vigia",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Vigia.associate = function (models)  {
		Vigia.belongsTo(models.Usuario, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
		Vigia.hasMany(models.RealizaPercurso, {
			foreignKey: "idRealizaPercurso",
			sourceKey: "id",
		});
	};

	return Vigia;
};