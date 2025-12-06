const ocorrenciaRepository = require("../repositories/ocorrenciaRepository");

// Função para retornar todos os Ocorrencia
const retornaTodasOcorrencia = async (req, res) => {
	try {
		const ocorrencia = await ocorrenciaRepository.obterTodosOcorrencia();
		res.status(200).json({ ocorrencia: ocorrencia });
	} catch (error) {
		console.log("Erro ao buscar Ocorrencia:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todos os Ocorrencia de um Percurso
const retornaOcorrenciaPorPercurso = async (req, res) => {
	try {
		const idPercurso = parseInt(req.params.idPercurso);
		const ocorrencia = await ocorrenciaRepository.obterOcorrenciaPorIdPercurso(idPercurso);
		res.status(200).json({ ocorrencia: ocorrencia });
	} catch (error) {
		console.log("Erro ao buscar Ocorrencia:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo Ocorrencia
const criarOcorrencia = async (req, res) => {
	const {id,tipo, descricao, latitude, longitude, sos, idPercurso, Hora, data} = req.body;
	try {
		if (!id || !descricao || !idPercurso) {
			return res
				.status(400)
				.json({
					message: "ID, descrição e ID do Percurso são obrigatórios.",
				});
		}

		const ocorrencia = await ocorrenciaRepository.criarOcorrencia({
			id,
            tipo, 
            descricao, 
            latitude, 
            longitude, 
            sos, 
            idPercurso, 
            Hora, 
            data,
		});
		res.status(201).json(ocorrencia);
	} catch (error) {
		console.log("Erro ao criar Ocorrencia:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um ocorrencia
const atualizaOcorrencia = async (req, res) => {
	const { tipo, descricao, latitude, longitude, sos, idPercurso, Hora, data } = req.body;
	const id = parseInt(req.params.id);
	try {
		const ocorrenciaAtualizado = await ocorrenciaRepository.atualizarOcorrencia({
			id,
            tipo, 
            descricao, 
            latitude, 
            longitude, 
            sos, 
            idPercurso, 
            Hora, 
            data,
		});

		if (ocorrenciaAtualizado) {
			res.status(200).json(ocorrenciaAtualizado);
		} else {
			res.status(404).json({ message: "ocorrencia não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar ocorrencia:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um ocorrencia
const deletaOcorrencia = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const ocorrenciaRemovido = await ocorrenciaRepository.deletarOcorrencia({ id });

		if (ocorrenciaRemovido) {
			res.status(200).json({
				message: "ocorrencia removido com sucesso.",
				ocorrencia: ocorrenciaRemovido,
			});
		} else {
			res.status(404).json({ message: "ocorrencia não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar ocorrencia:", error);
		res.status(500).json({ message: "Erro ao deletar ocorrencia" });
	}
};

// Função para buscar ocorrencia por ID
const retornaOcorrenciaPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const ocorrencia = await ocorrenciaRepository.obterOcorrenciaPorId({
			id,
		});

		if (ocorrencia) {
			res.status(200).json(ocorrencia);
		} else {
			res.status(404).json({ message: "ocorrencia não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar ocorrencia:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodasOcorrencia,
	retornaOcorrenciaPorPercurso,
	criarOcorrencia,
	atualizaOcorrencia,
	deletaOcorrencia,
	retornaOcorrenciaPorId,
};
