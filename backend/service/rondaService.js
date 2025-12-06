const rondaRepository = require("../repositories/rondaRepository");

// Função para retornar todos os ronda
const retornaTodasRonda = async (req, res) => {
	try {
		const ronda = await rondaRepository.obterTodosRonda();
		res.status(200).json({ ronda: ronda });
	} catch (error) {
		console.log("Erro ao buscar ronda:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todos os ronda de um Empresa
const retornaRondaPorEmpresa = async (req, res) => {
	try {
		const idEmpresa = parseInt(req.params.idEmpresa);
		const ronda = await empresaRepository.obterRondaPorIdEmpresa(idEmpresa);
		res.status(200).json({ ronda: ronda });
	} catch (error) {
		console.log("Erro ao buscar ronda:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todos os ronda de um Administrador
const retornaRondaPorAdministrador = async (req, res) => {
	try {
		const idAdministrador = parseInt(req.params.idAdministrador);
		const ronda = await empresaRepository.obterRondaPorIdAdministrador(idAdministrador);
		res.status(200).json({ ronda: ronda });
	} catch (error) {
		console.log("Erro ao buscar ronda:", error);
		res.sendStatus(500);
	}
};


// Função para buscar ronda por ID
const retornaRondaPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const ronda = await rondaRepository.obterRondaPorId({
			id,
		});

		if (ronda) {
			res.status(200).json(ronda);
		} else {
			res.status(404).json({ message: "Ronda não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar ronda:", error);
		res.sendStatus(500);
	}
};


// Função para criar um novo ronda
const criarRonda = async (req, res) => {
	const { id,nome, periodo, sequenciaPontos,  tempoEstimado, idEmpresa, idAdministrador } = req.body;
	try {
		if (!id || !nome || !idEmpresa || !idAdministrador) {
			return res
				.status(400)
				.json({
					message: "ID, nome, ID do curso e ID do Administrador são obrigatórios.",
				});
		}

		const ronda = await rondaRepository.criarRonda({
			id,
            nome,
			periodo,
			sequenciaPontos,
			tempoEstimado,
            idEmpresa, 
            idAdministrador,
		});
		res.status(201).json(ronda);
	} catch (error) {
		console.log("Erro ao criar ronda:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um ronda
const atualizaRonda = async (req, res) => {
	const { nome, periodo, sequenciaPontos,  tempoEstimado, idEmpresa, idAdministrador } = req.body;
	const id = parseInt(req.params.id);
	try {
		const rondaAtualizado = await rondaRepository.atualizarRonda({
			id,
            nome,
			periodo,
			sequenciaPontos,
			tempoEstimado,
            idEmpresa, 
            idAdministrador,
		});

		if (rondaAtualizado) {
			res.status(200).json(rondaAtualizado);
		} else {
			res.status(404).json({ message: "ronda não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar ronda:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um ronda
const deletaRonda = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const rondaRemovido = await rondaRepository.deletarRonda({ id });

		if (rondaRemovido) {
			res.status(200).json({
				message: "ronda removido com sucesso.",
				ronda: rondaRemovido,
			});
		} else {
			res.status(404).json({ message: "ronda não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar ronda:", error);
		res.status(500).json({ message: "Erro ao deletar ronda" });
	}
};

module.exports = {
	retornaTodasRonda,
    retornaRondaPorEmpresa,
	retornaRondaPorAdministrador,
    retornaRondaPorId,
	criarRonda,
	atualizaRonda,
	deletaRonda,
};
