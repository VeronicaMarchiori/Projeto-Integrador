"use strict";

module.exports = (sequelize, DataTypes) => {
	const Ronda = sequelize.define(
		"Ronda",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			nome: DataTypes.STRING,
            sequenciaPontos: DataTypes.INTEGER,
            tempoEstimado: DataTypes.TIME,
            periodo: DataTypes.INTEGER,

            idEmpresa: {
				type: DataTypes.INTEGER,
				references: {
					model: "empresa",
					key: "id",
				},
			},

            idUsuario: {
				type: DataTypes.INTEGER,
				references: {
					model: "administrador",
					key: "id",
				},
			},
		},
		{
			sequelize,
			tableName: "ronda",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Ronda.associate = function (models)  {
		Ronda.belongsTo(models.Empresa, {
			foreignKey: "idEmpresa",
			sourceKey: "id",
		});
        Ronda.belongsTo(models.Administrador, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
		Ronda.hasMany(models.Mensagem, {
			foreignKey: "idMensagem",
			sourceKey: "id",
		});
        Ronda.hasMany(models.Percurso, {
			foreignKey: "idPercurso",
			sourceKey: "id",
		});
        Ronda.hasMany(models.TemPontosRondas, {
			foreignKey: "idPontoRonda",
			sourceKey: "id",
		});
	};

	return Ronda;
};