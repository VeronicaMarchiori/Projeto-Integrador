"use strict";

module.exports = (sequelize, DataTypes) => {
	const Usuario = sequelize.define(
		"Usuario",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			nome: DataTypes.STRING,
            cpf: DataTypes.STRING,
            telefone: DataTypes.STRING,
            email: DataTypes.STRING,
            loginU: DataTypes.STRING,
            senha: DataTypes.STRING,
            ativo: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			tableName: "usuario",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Usuario.associate = function (models)  {
		Usuario.hasOne(models.Vigia, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
        Usuario.hasOne(models.Administrador, {
			foreignKey: "idUsuario",
			sourceKey: "id",
		});
        Usuario.hasMany(models.Mensagem, {
			foreignKey: "idMensagem",
			sourceKey: "id",
		});
        Usuario.hasMany(models.LogAcesso, {
			foreignKey: "idLogAcesso",
			sourceKey: "id",
		});
	};

	return Usuario;
};