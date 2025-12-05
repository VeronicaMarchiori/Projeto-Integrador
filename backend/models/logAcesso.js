"use strict";

module.exports = (sequelize, DataTypes) => {
	const LogAcesso = sequelize.define(
		"LogAcesso",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true 
			},
			dataL: DataTypes.DATEONLY,
            hora: DataTypes.TIME,
            sucesso: DataTypes.BOOLEAN,
            ip: DataTypes.STRING,
            idUsuario: {
				type: DataTypes.INTEGER,
				references: {
					model: "Usuario",
					key: "id",
				},
			},
		
		},
		{
			sequelize,
			tableName: "LogAcesso",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	LogAcesso.associate = function (models)  {
		LogAcesso.belongsTo(models.Usuario, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
	};

	return LogAcesso;
};