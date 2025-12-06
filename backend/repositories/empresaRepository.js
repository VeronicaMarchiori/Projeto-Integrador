const model = require("../models");

// Função para obter todos os Empresa
const obterTodosEmpresa = async () => {
	return await model.Empresa.findAll();
};

// Função para obter Empresa por ID
const obterEmpresaPorId = async (empresa) => {
	return await model.Empresa.findByPk(empresa.id);
};

// Função para criar um novo Empresa
const criarEmpresa = async (empresa) => {
	await model.Empresa.create(empresa);
	return empresa;
};

// Função para atualizar um Empresa
const atualizarEmpresa = async (empresa) => {
	try {
		// Atualizar o Empresa
		await model.Empresa.update(empresa, { where: { id: empresa.id } });

		// Retornar o Empresa atualizado
		return await model.Empresa.findByPk(empresa.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um Empresa
const deletarEmpresa = async (empresa) => {
	try {
		// Deletar o Empresa
		await model.Empresa.destroy({ where: { id: empresa.id } });
		return empresa;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosEmpresa,
	obterEmpresaPorId,
	criarEmpresa,
	atualizarEmpresa,
	deletarEmpresa,
};
