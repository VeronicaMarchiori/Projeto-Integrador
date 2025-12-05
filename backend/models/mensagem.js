"use strict";

module.exports = (sequelize, DataTypes) => {
	const Mensagem = sequelize.define(
		"Mensagem",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			conteudo: DataTypes.STRING,
            dataM: DataTypes.DATEONLY,
            hora: DataTypes.TIME,
            idRonda: {
				type: DataTypes.INTEGER,
				references: {
					model: "ronda",
					key: "id",
				},
			},
            idUsuario: {
				type: DataTypes.INTEGER,
				references: {
					model: "usuario",
					key: "id",
				},
			},


		},
		{
			sequelize,
			tableName: "mensagem",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Mensagem.associate = function (models)  {
		Mensagem.belongsTo(models.Ronda, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});
		Mensagem.belongsTo(models.Usuario, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
	};

	return Mensagem;
};