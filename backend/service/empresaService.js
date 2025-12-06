const empresaRepository = require("../repositories/empresaRepository");

// Função para retornar todos os Empresa
const retornaTodasEmpresas = async (req, res) => {
	try {
		const empresa = await empresaRepository.obterTodosEmpresa();
		res.status(200).json({ empresa: empresa });
	} catch (error) {
		console.log("Erro ao buscar empresa:", error);
		res.sendStatus(500);
	}
};

// Função para buscar empresa por ID
const retornaEmpresaPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const empresa = await empresaRepository.obterEmpresaPorId({
			id,
		});

		if (empresa) {
			res.status(200).json(empresa);
		} else {
			res.status(404).json({ message: "Empresa não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar empresa:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo Empresa
const criarEmpresa = async (req, res) => {
	const { id, nome, email, cnpj, endereco, telefone} = req.body;
	console.log({ id, nome, email, cnpj, endereco, telefone });
	try {
		if (!id || !nome || !email || !cnpj) {
			return res
				.status(400)
				.json({ message: "ID, nome, email e cnpj são obrigatórios." });
		}

		const empresa = await empresaRepository.criarEmpresa({
			id,
			nome,
			email,
            cnpj,
            endereco,
            telefone,
		});
		res.status(201).json(empresa);
	} catch (error) {
		console.log("Erro ao criar empresa:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um Empresa
const atualizaEmpresa = async (req, res) => {
	const { nome, email, cnpj } = req.body;
	const id = parseInt(req.params.id);
	try {
		const empresaAtualizado = await empresaRepository.atualizarEmpresa({
			id,
			nome,
			email,
            cnpj,
            endereco,
            telefone,
		});

		if (empresaAtualizado) {
			res.status(200).json(empresaAtualizado);
		} else {
			res.status(404).json({ message: "Empresa não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar Empresa:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um empresa
const deletaEmpresa = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const empresaRemovido = await empresaRepository.deletarEmpresa({ id });

		if (empresaRemovido) {
			res.status(200).json({
				message: "empresa removido com sucesso.",
				empresa: empresaRemovido,
			});
		} else {
			res.status(404).json({ message: "Empresa não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar empresa:", error);
		res.status(500).json({ message: "Erro ao deletar empresa" });
	}
};


module.exports = {
	retornaTodasEmpresas,
    retornaEmpresaPorId,
	criarEmpresa,
	atualizaEmpresa,
	deletaEmpresa,
};
