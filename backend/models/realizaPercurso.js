"use strict";

module.exports = (sequelize, DataTypes) => {
	const RealizaPercurso = sequelize.define(
		"RealizaPercurso",
		{
            idUsuario: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			idPercurso: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: "realizaPercurso",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	RealizaPercurso.associate = function (models)  {
		RealizaPercurso.belongsTo(models.Vigia, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
		RealizaPercurso.belongsTo(models.Percurso, {
			foreignKey: "idPercurso",
			sourceKey: "id",
		});
	};

	return RealizaPercurso;
};