"use strict";

module.exports = (sequelize, DataTypes) => {
	const Empresa = sequelize.define(
		"Empresa",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true 
			},
			nome: DataTypes.STRING,
            cnpj: DataTypes.STRING,
            endereco: DataTypes.STRING,
            telefone: DataTypes.STRING,
            email: DataTypes.STRING,
		
		},
		{
			sequelize,
			tableName: "empresa",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Empresa.associate = function (models)  {
		Empresa.hasMany(models.Ronda, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});
	};

	return Empresa;
};