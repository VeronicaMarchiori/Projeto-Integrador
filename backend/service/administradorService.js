const administradorRepository = require("../repositories/administradorRepository");

// Função para retornar todas as Administrador
const retornaTodosAdministrador = async (req, res) => {
	try {
		const administrador = await administradorRepository.obterTodasAdministrador();
		res.status(200).json({ administrador: administrador });
	} catch (error) {
		console.log("Erro ao buscar administrador:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as administrador do IdUsuario
const retornaAdministradorPorUsuario = async (req, res) => {
	try {
		const administrador = await administradorRepository.obterAdministradorPorIdUsuario(
			req.params.IdUsuario,
		);
		res.status(200).json({ administrador: administrador });
	} catch (error) {
		console.log("Erro ao buscar administrador:", error);
		res.sendStatus(500);
	}
};

// Função para criar um nova administrador
const criarAdministrador = async (req, res) => {
	const { IdUsuario, nivelAcesso } = req.body;
	try {
		if (!IdUsuario || !nivelAcesso) {
			return res
				.status(400)
				.json({ message: "ID do Usuario e o nivel de Acesso são obrigatórios." });
		}

		const administrador = await administradorRepository.criarAdministrador({
			IdUsuario,
			nivelAcesso,
		});
		res.status(201).json(administrador);
	} catch (error) {
		console.log("Erro ao criar administrador:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar uma administrador
const atualizaAdministrador = async (req, res) => {
	const { nivelAcesso } = req.body;
	const IdUsuario = parseInt(req.params.IdUsuario);

	try {
		const administradorAtualizada =
			await administradorRepository.atualizarAdministrador({
				IdUsuario,
				nivelAcesso,
			});

		if (administradorAtualizada) {
			res.status(200).json(administradorAtualizada);
		} else {
			res.status(404).json({ message: "administrador não encontrada" });
		}
	} catch (error) {
		console.log("Erro ao atualizar administrador:", error);
		res.sendStatus(500);
	}
};

// Função para deletar uma administrador
const deletaAdministrador = async (req, res) => {
	try {
		const IdUsuario = parseInt(req.params.IdUsuario);
		const administradorRemovida =
			await administradorRepository.deletarAdministrador(IdUsuario);

		if (administradorRemovida) {
			res.status(200).json({
				message: "administrador removida com sucesso.",
				administrador: administradorRemovida,
			});
		} else {
			res.status(404).json({ message: "administrador não encontrada" });
		}
	} catch (error) {
		console.error("Erro ao deletar administrador:", error);
		res.status(500).json({ message: "Erro ao deletar administrador" });
	}
};

module.exports = {
	retornaTodosAdministrador,
	retornaAdministradorPorUsuario, 
	criarAdministrador,
	atualizaAdministrador,
	deletaAdministrador,
};
