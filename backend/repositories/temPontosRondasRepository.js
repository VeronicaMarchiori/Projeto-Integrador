const model = require("../models");

// Função para obter todos as TemPontosRondas
const obterTodasTemPontosRondas = async () => {
	return await model.TemPontosRondas.findAll({
		include:[
			{
				model: model.Ronda,
			},
			{
				model: model.PontoRonda
			}
		]
	});
};

// Função para obter TemPontosRondas por ID do Ronda
const obterTemPontosRondasPorIdRonda = async (idRonda) => {
	return await model.TemPontosRondas.findAll({
		where: {
			idRonda: idRonda,
		},
		include: [
			{
				model: model.PontosRonda,
			},
		],
	});
};

// Função para obter TemPontosRondas por ID do PontosRonda
const obterTemPontosRondasPorIdPontosRonda = async (idPontosRonda) => {
	return await model.TemPontosRondas.findAll({
		where: {
			idPontosRonda: idPontosRonda,
		},
		include: [
			{
				model: model.Ronda,
			},
		],
	});
};

// Função para criar uma nova TemPontosRondas
const criarTemPontosRondas = async (temPontosRondas) => {
	const NtemPontosRondas = await model.TemPontosRondas.create(temPontosRondas);
	return NtemPontosRondas;
};

// Função para atualizar uma TemPontosRondas
const atualizarTemPontosRondas = async (temPontosRondas) => {
	try {
		// Atualizar o Ronda
		await model.TemPontosRondas.update(temPontosRondas, {
			where: { idRonda: temPontosRondas.idRonda },
		});

		// Retornar a TemPontosRondas atualizada
		return await model.TemPontosRondas.findByPk(temPontosRondas.idRonda);
	} catch (error) {
		throw error;
	}
};

// Função para deletar uma TemPontosRondas
const deletarTemPontosRondas = async (idRonda) => {
	try {
		const temPontosRondas = await obterTemPontosRondasPorIdRonda(idRonda);
		// Deletar o Ronda
		await model.TemPontosRondas.destroy({ where: { idRonda: idRonda } });

		return temPontosRondas;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodasTemPontosRondas,
	obterTemPontosRondasPorIdRonda,
	obterTemPontosRondasPorIdPontosRonda,
	criarTemPontosRondas,
	atualizarTemPontosRondas,
	deletarTemPontosRondas,
};
