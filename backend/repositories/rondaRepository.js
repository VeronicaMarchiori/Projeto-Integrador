const model = require("../models");

// Função para obter todos os ronda
const obterTodosRonda = async () => {
	return await model.Ronda.findAll({
		include: [
			{
				model: model.Empresa,
			},
			{
				model: model.Administrador,
			},
		],
	});
};

// Função para obter ronda por ID
const obterRondaPorId = async (ronda) => {
	return await model.Ronda.findByPk(ronda.id, {
		include: [
			{
				model: model.Empresa,
			},
			{
				model: model.Administrador,
			},
		],
	});
};

// Função para obter Ronda por ID do Empresa
const obterRondaPorIdEmpresa = async (idEmpresa) => {
	return await model.Ronda.findAll({
		where: {
			idEmpresa: idEmpresa,
		},
		include: [
			{
				model: model.Empresa,
			},
			{
				model: model.Administrador,
			},
		],
	});
};

// Função para obter Ronda por ID do Administrador
const obterRondaPorIdAdministrador = async (idAdministrador) => {
	return await model.Ronda.findAll({
		where: {
			idAdministrador: idAdministrador,
		},
		include: [
			{
				model: model.Empresa,
			},
			{
				model: model.Administrador,
			},
		],
	});
};

// Função para criar um novo Ronda
const criarRonda = async (ronda) => {
	await model.Ronda.create(ronda);
	return ronda;
};

// Função para atualizar um Ronda
const atualizarRonda = async (ronda) => {
	try {
		// Atualizar o Ronda
		await model.Ronda.update(ronda, { where: { id: ronda.id } });

		// Retornar o Ronda atualizado
		return await model.Ronda.findByPk(ronda.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um Ronda
const deletarRonda = async (ronda) => {
	try {
		// Deletar o Ronda
		await model.Ronda.destroy({ where: { id: ronda.id } });

		return ronda;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosRonda,
	obterRondaPorId,
    obterRondaPorIdEmpresa,
	obterRondaPorIdAdministrador,
	criarRonda,
	atualizarRonda,
	deletarRonda,
};
