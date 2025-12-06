const model = require("../models");

const obterTodosUsuario = async () => {
	return await model.Usuario.findAll();
};

// Função para obter Usuario por ID
const obterUsuarioPorId = async (usuario) => {
	return await model.Usuario.findByPk(usuario.id);
};

// Função para criar um novo Usuario
const criarUsuario = async (usuario) => {
	await model.Usuario.create(usuario);
	return usuario;
};

// Função para atualizar um Usuario
const atualizarUsuario= async (usuario) => {
	try {
		// Atualizar o Usuario
		await model.Usuario.update(usuario, { where: { id: usuario.id } });

		// Retornar o Usuario atualizado
		return await model.Usuario.findByPk(usuario.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um Usuario
const deletarUsuario = async (usuario) => {
	try {
		// Deletar o Usuario
		await model.Usuario.destroy({ where: { id: usuario.id } });

		return usuario;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosUsuario,
	obterUsuarioPorId,
	criarUsuario,
	atualizarUsuario,
	deletarUsuario,
};
