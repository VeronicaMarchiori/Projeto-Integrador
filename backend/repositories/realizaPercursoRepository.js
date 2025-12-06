const model = require("../models");

// Função para obter todos as realizaPercurso
const obterTodasRealizaPercurso = async () => {
    return await model.realizaPercurso.findAll({
        include:[
            {
                model: model.Vigia,
            },
            {
                model: model.Percurso
            }
        ]
    });
};

// Função para obter realizaPercurso por ID do Vigia
const obterRealizaPercursoPorIdVigia = async (idVigia) => {
    return await model.RealizaPercurso.findAll({
        where: {
            idVigia: idVigia,
        },
        include: [
            {
                model: model.Percurso,
            },
        ],
    });
};

// Função para obter realizaPercurso por ID do Percurso
const obterRealizaPercursoPorIdPercurso = async (idPercurso) => {
    return await model.RealizaPercurso.findAll({
        where: {
            idPercurso: idPercurso,
        },
        include: [
            {
                model: model.Vigia,
            },
        ],
    });
};

// Função para criar uma nova RealizaPercurso
const criarRealizaPercurso = async (realizaPercurso) => {
    const NrealizaPercurso = await model.RealizaPercurso.create(realizaPercurso);
    return NrealizaPercurso;
};

// Função para atualizar uma RealizaPercurso
const atualizarRealizaPercurso = async (realizaPercurso) => {
    try {
        // Atualizar o Vigia
        await model.realizaPercurso.update(realizaPercurso, {
            where: { idVigia: realizaPercurso.idVigia },
        });

        // Retornar a realizaPercurso atualizada
        return await model.RealizaPercurso.findByPk(realizaPercurso.idPercurso);
    } catch (error) {
        throw error;
    }
};

// Função para deletar uma realizaPercurso
const deletarRealizaPercurso = async (idPercurso) => {
    try {
        const realizaPercurso = await obterRealizaPercursoPorIdPercurso(idPercurso);
        // Deletar o Ronda
        await model.RealizaPercurso.destroy({ where: { idPercurso: idPercurso } });

        return realizaPercurso;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodasRealizaPercurso,
    obterRealizaPercursoPorIdVigia,
    obterRealizaPercursoPorIdPercurso,
    criarRealizaPercurso,
    atualizarRealizaPercurso,
    deletarRealizaPercurso,
};
