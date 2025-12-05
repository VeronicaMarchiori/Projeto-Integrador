"use strict";

module.exports = (sequelize, DataTypes) => {
	const TemPontosRondas = sequelize.define(
		"TemPontosRondas",
		{
            idRonda: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			idPontoRonda: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: "temPontosRondas",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	TemPontosRondas.associate = function (models)  {
		TemPontosRondas.belongsTo(models.Ronda, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});
		TemPontosRondas.belongsTo(models.PontoRonda, {
			foreignKey: "idPontoR",
			sourceKey: "id",
		});
	};

	return TemPontosRondas;
};