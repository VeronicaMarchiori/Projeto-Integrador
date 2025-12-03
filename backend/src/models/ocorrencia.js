module.exports = (sequelize, DataTypes) => {
return sequelize.define('Ocorrencia', {
idOcorrencia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
tipo: DataTypes.STRING,
descricao: DataTypes.STRING,
dataO: DataTypes.DATEONLY,
Hora: DataTypes.TIME,
latitude: DataTypes.DECIMAL(10,7),
longitude: DataTypes.DECIMAL(10,7),
fk_Percurso_idPercurso: DataTypes.INTEGER,
sos: DataTypes.BOOLEAN,
}, { tableName: 'Ocorrencia', timestamps: false });
};