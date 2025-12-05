"use strict";

module.exports = (sequelize, DataTypes) => {
	const PontoRonda = sequelize.define(
		"PontoRonda",
		{
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
                autoIncrement: true
			},
			descricao: DataTypes.STRING,
            latitude: DataTypes.DECIMAL(10,7),
            longitude: DataTypes.DECIMAL(10,7),
            qrcode: DataTypes.STRING,
            obrigatoro: DataTypes.BOOLEAN,
            dataP: DataTypes.DATEONLY,
            hora: DataTypes.TIME,

		},
		{
			sequelize,
			tableName: "pontoRonda",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	PontoRonda.associate = function (models)  {
        PontoRonda.hasMany(models.TemPontosRondas, {
			foreignKey: "idRonda",
			sourceKey: "id",
		});

	};

	return PontoRonda;
};