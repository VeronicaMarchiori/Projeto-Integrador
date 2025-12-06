const mensagemRepository = require("../repositories/mensagemRepository");

// Função para retornar todos os mensagem
const retornaTodasMensagem = async (req, res) => {
    try {
        const mensagem = await mensagemRepository.obterTodosMensagem();
        res.status(200).json({ mensagem: mensagem });
    } catch (error) {
        console.log("Erro ao buscar mensagem:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todos os mensagem de um Ronda
const retornaMensagemPorRonda = async (req, res) => {
    try {
        const idEmpresa = parseInt(req.params.idRonda);
        const ronda = await mensagemRepository.obterMensagemPorIdRonda(idRonda);
        res.status(200).json({ mensagem: mensagem });
    } catch (error) {
        console.log("Erro ao buscar mensagem:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todos os mensagem de um Usuario
const retornaMensagemPorUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        const mensagem = await mensagemRepository.obterMensagemPorIdUsuario(idUsuario);
        res.status(200).json({ mensagem: mensagem });
    } catch (error) {
        console.log("Erro ao buscar mensagem:", error);
        res.sendStatus(500);
    }
};


// Função para buscar mensagem por ID
const retornaMensagemPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const mensagem = await mensagemRepository.obterMensagemPorId({
            id,
        });

        if (mensagem) {
            res.status(200).json(mensagem);
        } else {
            res.status(404).json({ message: "mensagem não encontrado." });
        }
    } catch (error) {
        console.log("Erro ao buscar mensagem:", error);
        res.sendStatus(500);
    }
};


// Função para criar um novo mensagem
const criarMensagem = async (req, res) => {
    const { id,conteudo, data, hora,  idRonda, idUsuario } = req.body;
    try {
        if (!id || !conteudo || !idUsuario || !idRonda) {
            return res
                .status(400)
                .json({
                    message: "ID, conteudo, ID do Usuario e ID do Ronda são obrigatórios.",
                });
        }

        const mensagem = await mensagemRepository.criarMensagem({
            id,
            conteudo, 
            data, 
            hora,  
            idRonda, 
            idUsuario,
        });
        res.status(201).json(mensagem);
    } catch (error) {
        console.log("Erro ao criar mensagem:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um mensagem
const atualizaMensagem = async (req, res) => {
    const {conteudo, data, hora,  idRonda, idUsuario} = req.body;
    const id = parseInt(req.params.id);
    try {
        const mensagemAtualizado = await mensagemRepository.atualizarMensagem({
            id,
            conteudo, 
            data, 
            hora,  
            idRonda, 
            idUsuario,
        });

        if (mensagemAtualizado) {
            res.status(200).json(mensagemAtualizado);
        } else {
            res.status(404).json({ message: "mensagem não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao atualizar mensagem:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um mensagem
const deletaMensagem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const mensagemRemovido = await mensagemRepository.deletarMensagem({ id });

        if (mensagemRemovido) {
            res.status(200).json({
                message: "mensagem removido com sucesso.",
                mensagem: mensagemRemovido,
            });
        } else {
            res.status(404).json({ message: "mensagem não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar mensagem:", error);
        res.status(500).json({ message: "Erro ao deletar mensagem" });
    }
};

module.exports = {
    retornaTodasMensagem,
    retornaMensagemPorRonda,
    retornaMensagemPorUsuario,
    retornaMensagemPorId,
    criarMensagem,
    atualizaMensagem,
    deletaMensagem,
};
