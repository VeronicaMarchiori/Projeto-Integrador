const model = require("../models");

// Função para obter todos os Mensagem
const obterTodosMensagem = async () => {
    return await model.Mensagem.findAll({
        include: [
            {
                model: model.Ronda,
            },
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para obter Mensagem por ID
const obterMensagemPorId = async (Mensagem) => {
    return await model.Ronda.findByPk(Mensagem.id, {
        include: [
            {
                model: model.Ronda,
            },
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para obter Mensagem por ID do Ronda
const obterMensagemPorIdRonda = async (idRonda) => {
    return await model.Mensagem.findAll({
        where: {
            idRonda: idRonda,
        },
        include: [
            {
                model: model.Ronda,
            },
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para obter Mensagem por ID do Usuario
const obterMensagemPorIdUsuario = async (idUsuario) => {
    return await model.Mensagem.findAll({
        where: {
            idUsuario: idUsuario,
        },
        include: [
            {
                model: model.Empresa,
            },
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para criar um novo Mensagem
const criarMensagem = async (mensagem) => {
    await model.Mensagem.create(mensagem);
    return mensagem;
};

// Função para atualizar um Mensagem
const atualizarMensagem = async (mensagem) => {
    try {
        // Atualizar o Mensagem
        await model.Mensagem.update(mensagem, { where: { id: mensagem.id } });

        // Retornar o Mensagem atualizado
        return await model.Mensagem.findByPk(mensagem.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um Mensagem
const deletarMensagem = async (mensagem) => {
    try {
        // Deletar o Mensagem
        await model.Mensagem.destroy({ where: { id: mensagem.id } });

        return mensagem;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosMensagem,
    obterMensagemPorId,
    obterMensagemPorIdRonda,
    obterMensagemPorIdUsuario,
    criarMensagem,
    atualizarMensagem,
    deletarMensagem,
};
