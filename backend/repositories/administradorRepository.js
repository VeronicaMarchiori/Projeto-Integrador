const model = require("../models");

// Função para obter todos as administrador
const obterTodasAdministrador = async () => {
	return await model.Administrador.findAll({
		include: [
			{
				model: model.Usuarios,
			},
		],
	});
};

// Função para obter administrador por IdUsuario
const obterMatriculaPorIdUsuario = async (IdUsuario) => {
	return await model.Matricula.findAll({
		where: {
			IdUsuario: IdUsuario,
		},
		include: [
			{
				model: model.Usuario,
			},
		],
	});
};

// Função para criar uma nova administrador
const criarAdministrador = async (administrador) => {
	await model.Administrador.create(administrador);
	return administrador;
};

// Função para atualizar uma administrador
const atualizarAdministrador = async (administrador) => {
	try {

		await model.Administrador.update(administrador, {
			where: { IdUsuario: administrador.IdUsuario },
		});

		// Retornar a administrador atualizada
		return await model.Administrador.findByPk(administrador.IdUsuario);
	} catch (error) {
		throw error;
	}
};

// Função para deletar uma administrador
const deletarAdministrador = async (IdUsuario) => {
	try {
		const administrador = await obterAdministradorPorIdAluno(IdUsuario);
		// Deletar o Administrador
		await model.Administrador.destroy({ where: { IdUsuario: IdUsuario } });

		return administrador;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodasAdministrador,
	obterMatriculaPorIdUsuario,
	criarAdministrador,
	atualizarAdministrador,
	deletarAdministrador,
};
