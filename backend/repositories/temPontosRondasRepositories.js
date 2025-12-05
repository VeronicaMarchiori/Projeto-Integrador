const model = require("../models");

// Função para obter todos as matriculas
const obterTodasMatriculas = async () => {
	return await model.Matricula.findAll({
		include:[
			{
				model: model.Curso,
			},
			{
				model: model.Aluno
			}
		]
	});
};

// Função para obter matricula por ID do aluno
const obterMatriculaPorIdAluno = async (id_aluno) => {
	return await model.Matricula.findAll({
		where: {
			id_aluno: id_aluno,
		},
		include: [
			{
				model: model.Curso,
			},
		],
	});
};

// Função para obter matricula por ID do curso
const obterMatriculaPorIdCurso = async (id_curso) => {
	return await model.Matricula.findAll({
		where: {
			id_curso: id_curso,
		},
		include: [
			{
				model: model.Aluno,
			},
		],
	});
};

// Função para criar uma nova matricula
const criarMatricula = async (matricula) => {
	const Nmatricula = await model.Matricula.create(matricula);
	return Nmatricula;
};

// Função para atualizar uma matricula
const atualizarMatricula = async (matricula) => {
	try {
		// Atualizar o aluno
		await model.Matricula.update(matricula, {
			where: { id_aluno: matricula.id_aluno },
		});

		// Retornar a matricula atualizada
		return await model.Matricula.findByPk(matricula.id_aluno);
	} catch (error) {
		throw error;
	}
};

// Função para deletar uma matricula
const deletarMatricula = async (id_aluno) => {
	try {
		const matricula = await obterMatriculaPorIdAluno(id_aluno);
		// Deletar o aluno
		await model.Matricula.destroy({ where: { id_aluno: id_aluno } });

		return matricula;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodasMatriculas,
	obterMatriculaPorIdAluno,
	obterMatriculaPorIdCurso,
	criarMatricula,
	atualizarMatricula,
	deletarMatricula,
};
