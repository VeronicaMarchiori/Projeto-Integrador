const temPontosRondasRepository = require("../repositories/temPontosRondasRepository");

// Função para retornar todas as temPontosRondas
const retornaTodasTemPontosRondas = async (req, res) => {
	try {
		const temPontosRondas = await temPontosRondasRepository.obterTodasTemPontosRondas();
		res.status(200).json({ temPontosRondas: temPontosRondas });
	} catch (error) {
		console.log("Erro ao buscar temPontosRondas:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as temPontosRondas do Ronda
const retornaTemPontosRondasRonda = async (req, res) => {
	try {
		const temPontosRondas = await temPontosRondasRepository.obtertemPontosRondasPorIdRonda(req.params.idRonda);
		res.status(200).json({ temPontosRondas: temPontosRondas });
	} catch (error) {
		console.log("Erro ao buscar temPontosRondas:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as temPontosRondas do curso
const retornaTodasTemPontosRondasPontoRonda = async (req, res) => {
	try {
		const matriculas = await matriculaRepository.obterMatriculaPorIdCurso(req.params.id_curso);
		res.status(200).json({ matriculas: matriculas });
	} catch (error) {
		console.log("Erro ao buscar matriculas:", error);
		res.sendStatus(500);
	}
};

// Função para criar um nova matricula
const criarTemPontosRondas = async (req, res) => {
	const { id_aluno, id_curso } = req.body;
	try {
		if (!id_aluno || !id_curso) {
			return res
				.status(400)
				.json({ message: "ID do aluno e curso são obrigatórios." });
		}

		const matricula = await matriculaRepository.criarMatricula({
			id_aluno,
			id_curso,
		});
		res.status(201).json(matricula);
	} catch (error) {
		console.log("Erro ao criar matricula:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar uma matricula
const atualizaTemPontosRondas = async (req, res) => {
	const { id_curso } = req.body;
	const id_aluno = parseInt(req.params.id_aluno);

	try {
		const TemPontosRondasAtualizada =
			await matriculaRepository.atualizarTemPontosRondas({
				id_aluno,
				id_curso,
			});

		if (TemPontosRondasAtualizada) {
			res.status(200).json(TemPontosRondasAtualizada);
		} else {
			res.status(404).json({ message: "TemPontosRondas não encontrada" });
		}
	} catch (error) {
		console.log("Erro ao atualizar TemPontosRondas:", error);
		res.sendStatus(500);
	}
};

// Função para deletar uma TemPontosRondas
const deletaTemPontosRondas = async (req, res) => {
	try {
		const idRonda = parseInt(req.params.idRonda);
		const temPontosRondasRemovida = await temPontosRondasRepositories.deletarTemPontosRondas(idRonda);

		if (temPontosRondasRemovida) {
			res.status(200).json({
				message: "TemPontosRondas removida com sucesso.",
				temPontosRondas: temPontosRondasRemovida,
			});
		} else {
			res.status(404).json({ message: "TemPontosRondas não encontrada" });
		}
	} catch (error) {
		console.error("Erro ao deletar TemPontosRondas:", error);
		res.status(500).json({ message: "Erro ao deletar TemPontosRondas" });
	}
};

module.exports = {
	retornaTodasTemPontosRondas,
	retornaTemPontosRondasRonda,
	retornaTodasTemPontosRondasPontoRonda,
	criarTemPontosRondas,
	atualizaTemPontosRondas,
	deletaTemPontosRondas,
};
