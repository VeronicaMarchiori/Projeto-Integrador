const usuarioRepository = require("../repositories/usuarioRepository");

// Função para retornar todos os usuario
const retornaTodosUsuario = async (req, res) => {
	try {
		const usuario = await usuarioRepository.obterTodosUsuario();
		res.status(200).json({ usuario: usuario });
	} catch (error) {
		console.log("Erro ao buscar usuario:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo usuario
const criarUsuario = async (req, res) => {
	const { id,nome,cpf, telefone, email, login, senha, ativo, dataCriacao } = req.body;
	try {
		if (!id || !nome || !login || !senha) {
			return res
				.status(400)
				.json({ message: "ID,nome, login e senha são obrigatórios." });
		}

		const usuario = await usuarioRepository.criarUsuario({
			id,
            nome,
            cpf, 
            telefone, 
            email, 
            login, 
            senha, 
            ativo, 
            dataCriacao,
		});
		res.status(201).json(usuario);
	} catch (error) {
		console.log("Erro ao criar usuario:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um usuario
const atualizaUsuario = async (req, res) => {
	const { nome,cpf, telefone, email, login, senha, ativo, dataCriacao } = req.body;
	const id = parseInt(req.params.id);
	try {
		const usuarioAtualizado = await usuarioRepository.atualizarUsuario({
			id,
            nome,
            cpf, 
            telefone, 
            email, 
            login, 
            senha, 
            ativo, 
            dataCriacao,
		});

		if (usuarioAtualizado) {
			res.status(200).json(usuarioAtualizado);
		} else {
			res.status(404).json({ message: "usuario não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar usuario:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um usuario
const deletaUsuario = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuarioRemovido = await usuarioRepository.deletarUsuario({ id });

		if (usuarioRemovido) {
			res.status(200).json({
				message: "usuario removido com sucesso.",
				usuario: usuarioRemovido,
			});
		} else {
			res.status(404).json({ message: "usuario não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar usuario:", error);
		res.status(500).json({ message: "Erro ao deletar usuario" });
	}
};

// Função para buscar usuario por ID
const retornaUsuarioPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuario = await usuarioRepository.obterUsuarioPorId({
			id,
		});

		if (usuario) {
			res.status(200).json(usuario);
		} else {
			res.status(404).json({ message: "usuario não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar usuario:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosUsuario,
	criarUsuario,
	atualizaUsuario,
	deletaUsuario,
	retornaUsuarioPorId,
};
