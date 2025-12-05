"use strict";

module.exports = (sequelize, DataTypes) => {
	const Percurso = sequelize.define(
		"Percurso",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			dataInicia: DataTypes.DATE,
            dataFim: DataTypes.DATE,
            kmPercorrido: DataTypes.DECIMAL(10,2),
            observacoes: DataTypes.STRING,
            idRonda: {
				type: DataTypes.INTEGER,
				references: {
					model: "ronda",
					key: "id",
				},
			},

		},
		{
			sequelize,
			tableName: "percurso",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Percurso.associate = function (models)  {
		Percurso.belongsTo(models.Ronda, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});
        Percurso.hasMany(models.Ocorencia, {
			foreignKey: "idPercurso",
			sourceKey: "id",
		});
		Percurso.hasMany(models.realizaPercurso, {
			foreignKey: "idPercurso",
			sourceKey: "id",
		});

	};

	return Percurso;
};