const model = require("../models");

// Função para obter todos os ocorrencia
const obterTodosOcorrencia = async () => {
	return await model.Ocorrencia.findAll({
		include: [
			{
				model: model.Percurso,
			},
		],
	});
};

// Função para obter ocorrencia por ID
const obterOcorrenciaPorId = async (ocorrencia) => {
	return await model.Ocorrencia.findByPk(ocorrencia.id, {
		include: [
			{
				model: model.Percurso,
			},
		],
	});
};

// Função para obter ocorrencia por ID do Percurso
const obterOcorrenciaPorIdPercurso = async (idPercurso) => {
	return await model.Ocorrencia.findAll({
		where: {
			idPercurso: idPercurso,
		},
		include: [
			{
				model: model.Percurso,
			},
		],
	});
};

// Função para criar um novo ocorrencia
const criarOcorrencia = async (ocorrencia) => {
	await model.Ocorrencia.create(ocorrencia);
	return ocorrencia;
};

// Função para atualizar um Ocorrencia
const atualizarOcorrencia = async (ocorrencia) => {
	try {
		// Atualizar o Ocorrencia
		await model.Ocorrencia.update(ocorrencia, { where: { id: ocorrencia.id } });

		// Retornar o Ocorrencia atualizado
		return await model.Ocorrencia.findByPk(ocorrencia.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um Ocorrencia
const deletarOcorrencia = async (ocorrencia) => {
	try {
		// Deletar o Ocorrencia
		await model.Ocorrencia.destroy({ where: { id: ocorrencia.id } });

		return ocorrencia;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosOcorrencia,
	obterOcorrenciaPorId,
	obterOcorrenciaPorIdPercurso,
	criarOcorrencia,
	atualizarOcorrencia,
	deletarOcorrencia,
};
