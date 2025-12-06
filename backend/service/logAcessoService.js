const logAcessoRepository = require("../repositories/logAcessoRepository");
logAcesso
// Função para retornar todos os logAcesso
const retornaTodosLogAcesso = async (req, res) => {
    try {
        const logAcesso = await logAcessoRepository.obterTodoslogAcesso();
        res.status(200).json({ logAcesso: logAcesso });
    } catch (error) {
        console.log("Erro ao buscar logAcesso:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todos os logAcesso de um Usuario
const retornaLogAcessoPorUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        const logAcesso = await logAcessoRepository.obterLogAcessoPorIdUsuario(idUsuario);
        res.status(200).json({ logAcesso: logAcesso });
    } catch (error) {
        console.log("Erro ao buscar logAcesso:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo logAcesso
const criarLogAcesso = async (req, res) => {
    const {id,sucesso, ip, hora,idUsuario, Hora, data} = req.body;
    try {
        if (!id || !descricao || !idUsuario) {
            return res
                .status(400)
                .json({
                    message: "ID, descrição e ID do Usuario são obrigatórios.",
                });
        }

        const logAcesso = await logAcessoRepository.criarLogAcesso({
            id,
            sucesso, 
            ip, 
            hora,
            idUsuario, 
            Hora, 
            data
        });
        res.status(201).json(logAcesso);
    } catch (error) {
        console.log("Erro ao criar logAcesso:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um logAcesso
const atualizaLogAcesso = async (req, res) => {
    const { sucesso, ip, hora,idUsuario, Hora, data } = req.body;
    const id = parseInt(req.params.id);
    try {
        const logAcessoAtualizado = await logAcessoRepository.atualizarlogAcesso({
            id,
            sucesso, 
            ip, 
            hora,
            idUsuario, 
            Hora, 
            data
        });

        if (logAcessoAtualizado) {
            res.status(200).json(logAcessoAtualizado);
        } else {
            res.status(404).json({ message: "logAcesso não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao atualizar logAcesso:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um logAcesso
const deletaLogAcesso = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const logAcessoRemovido = await logAcessoRepository.deletarLogAcesso({ id });

        if (logAcessoRemovido) {
            res.status(200).json({
                message: "logAcesso removido com sucesso.",
                logAcesso: logAcessoRemovido,
            });
        } else {
            res.status(404).json({ message: "logAcesso não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar logAcesso:", error);
        res.status(500).json({ message: "Erro ao deletar logAcesso" });
    }
};

// Função para buscar logAcesso por ID
const retornaLogAcessoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const logAcesso = await logAcessoRepository.obterLogAcessoaPorId({
            id,
        });

        if (logAcesso) {
            res.status(200).json(logAcesso);
        } else {
            res.status(404).json({ message: "logAcesso não encontrado." });
        }
    } catch (error) {
        console.log("Erro ao buscar logAcesso:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodosLogAcesso,
    retornaLogAcessoPorUsuario,
    criarLogAcesso,
    atualizaLogAcesso,
    deletaLogAcesso,
    retornaLogAcessoPorId,
};
