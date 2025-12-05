"use strict";

module.exports = (sequelize, DataTypes) => {
	const Ocorrencia = sequelize.define(
		"Ocorrencia",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			tipo: DataTypes.STRING,
            descricao: DataTypes.STRING,
            dataO: DataTypes.DATEONLY,
            Hora: DataTypes.TIME,
            latitude: DataTypes.DECIMAL(10,7),
            longitude: DataTypes.DECIMAL(10,7),
            sos: DataTypes.BOOLEAN,
            idPercurso: {
				type: DataTypes.INTEGER,
				references: {
					model: "percurso",
					key: "id",
				},
			},


		},
		{
			sequelize,
			tableName: "ocorrencia",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Ocorrencia.associate = function (models)  {
		Mensagem.belongsTo(models.Percurso, {
			foreignKey: "idPercurso",
			sourceKey: "id",
		});
	};

	return Ocorrencia;
};