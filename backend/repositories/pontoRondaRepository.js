const model = require("../models");

// Função para obter todos os PontoRonda
const obterTodosPontoRonda = async () => {
    return await model.PontoRonda.findAll();
};

// Função para obter PontoRonda por ID
const obterPontoRondaPorId = async (pontoRonda) => {
    return await model.PontoRonda.findByPk(pontoRonda.id);
};

// Função para criar um novo PontoRonda
const criarPontoRonda = async (pontoRonda) => {
    await model.PontoRonda.create(pontoRonda);
    return pontoRonda;
};

// Função para atualizar um PontoRonda
const atualizarPontoRonda = async (pontoRonda) => {
    try {
        // Atualizar o PontoRonda
        await model.PontoRonda.update(pontoRonda, { where: { id: pontoRonda.id } });

        // Retornar o PontoRonda atualizado
        return await model.PontoRonda.findByPk(pontoRonda.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um PontoRonda
const deletarPontoRonda = async (pontoRonda) => {
    try {
        // Deletar o PontoRonda
        await model.PontoRonda.destroy({ where: { id: pontoRonda.id } });
        return pontoRonda;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosPontoRonda,
    obterPontoRondaPorId,
    criarPontoRonda,
    atualizarPontoRonda,
    deletarPontoRonda,
};
