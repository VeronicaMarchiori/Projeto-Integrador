const model = require("../models");

// Função para obter todos as vigia
const obterTodosVigia = async () => {
    return await model.Vigia.findAll({
        include: [
            {
                model: model.Usuarios,
            },
        ],
    });
};

// Função para obter vigia por ID do aluno   
const obterVigiaPorIdUsuario = async (IdUsuario) => {
    return await model.Vigia.findAll({
        where: {
            IdUsuario: IdUsuario,
        },
        include: [
            {
                model: model.Usuario,
            },
        ],
    });
};

// Função para criar uma nova vigia
const criarVigia = async (vigia) => {
    await model.Vigia.create(vigia);
    return vigia;
};

// Função para atualizar uma vigia
const atualizarVigia = async (vigia) => {
    try {
        // Atualizar o vigia
        await model.Vigia.update(vigia, {
            where: { IdUsuario: vigia.IdUsuario },
        });

        // Retornar a vigia atualizada
        return await model.Vigia.findByPk(vigia.IdUsuario);
    } catch (error) {
        throw error;
    }
};

// Função para deletar uma vigia
const deletarVigia = async (IdUsuario) => {
    try {
        const vigia = await obterVigiaPorIdUsuario(IdUsuario);
        // Deletar o vigia
        await model.Vigia.destroy({ where: { IdUsuario: IdUsuario } });

        return vigia;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosVigia,
    obterVigiaPorIdUsuario,
    criarVigia,
    atualizarVigia,
    deletarVigia,
};
