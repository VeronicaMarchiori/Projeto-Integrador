const model = require("../models");

// Função para obter todos os percurso
const obterTodosPercurso = async () => {
    return await model.Percurso.findAll({
        include: [
            {
                model: model.Ronda,
            },
        ],
    });
};

// Função para obter percurso por ID
const obterPercursoPorId = async (percurso) => {
    return await model.Percurso.findByPk(percurso.id, {
        include: [
            {
                model: model.Ronda,
            },
        ],
    });
};

// Função para obter percurso por ID do Ronda
const obterPercursoPorIdRonda = async (idRonda) => {
    return await model.Percurso.findAll({
        where: {
            idRonda: idRonda,
        },
        include: [
            {
                model: model.Ronda,
            },
        ],
    });
};

// Função para criar um novo percurso
const criarPercurso = async (percurso) => {
    await model.Percurso.create(percurso);
    return percurso;
};

// Função para atualizar um percurso
const atualizarPercurso = async (percurso) => {
    try {
        // Atualizar o percurso
        await model.Percurso.update(percurso, { where: { id: percurso.id } });

        // Retornar o Percurso atualizado
        return await model.Percurso.findByPk(percurso.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um percurso
const deletarPercurso = async (percurso) => {
    try {
        // Deletar o percurso
        await model.Percurso.destroy({ where: { id: percurso.id } });

        return percurso;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosPercurso,
    obterPercursoPorId,
    obterPercursoPorIdRonda,
    criarPercurso,
    atualizarPercurso,
    deletarPercurso,
};

