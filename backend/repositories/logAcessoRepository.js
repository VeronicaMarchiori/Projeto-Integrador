const model = require("../models");

// Função para obter todos os logAcesso
const obterTodosLogAcesso = async () => {
    return await model.LogAcesso.findAll({
        include: [
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para obter logAcesso por ID
const obterLogAcessoPorId = async (logAcesso) => {
    return await model.LogAcesso.findByPk(logAcesso.id, {
        include: [
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para obter logAcesso por ID do usuario
const obterLogAcessoPorIdUsuario = async (idUsuario) => {
    return await model.LogAcesso.findAll({
        where: {
            idUsuario: idUsuario,
        },
        include: [
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para criar um novo logAcesso
const criarLogAcesso = async (logAcesso) => {
    await model.LogAcesso.create(logAcesso);
    return logAcesso;
};

// Função para atualizar um logAcesso
const atualizarLogAcesso = async (logAcesso) => {
    try {
        // Atualizar o logAcesso
        await model.LogAcesso.update(logAcesso, { where: { id: logAcesso.id } });

        // Retornar o logAcesso atualizado
        return await model.LogAcesso.findByPk(logAcesso.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um logAcesso
const deletarLogAcesso = async (logAcesso) => {
    try {
        // Deletar o logAcesso
        await model.LogAcesso.destroy({ where: { id: logAcesso.id } });

        return logAcesso;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosLogAcesso,
    obterLogAcessoPorId,
    obterLogAcessoPorIdUsuario,
    criarLogAcesso,
    atualizarLogAcesso,
    deletarLogAcesso,
};
