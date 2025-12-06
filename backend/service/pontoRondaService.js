const pontoRondaRepository = require("../repositories/pontoRondaRepository");

// Função para retornar todos os pontoRonda
const retornaTodosPontoRonda = async (req, res) => {
    try {
        const pontoRonda = await pontoRondaRepository.obterTodosPontoRonda();
        res.status(200).json({ pontoRonda: pontoRonda });
    } catch (error) {
        console.log("Erro ao buscar pontoRonda:", error);
        res.sendStatus(500);
    }
};

// Função para buscar pontoRonda por ID
const retornaPontoRondaPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pontoRonda = await pontoRondaRepository.obterPontoRondaPorId({
            id,
        });

        if (pontoRonda) {
            res.status(200).json(pontoRonda);
        } else {
            res.status(404).json({ message: "PontoRonda não encontrado." });
        }
    } catch (error) {
        console.log("Erro ao buscar pontoRonda:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo pontoRonda
const criarPontoRonda = async (req, res) => {
    const { id, descricao, latitude, longitude, qrcode, obrigatoro, Hora, data} = req.body;
    console.log({id, descricao, latitude, longitude, qrcode, obrigatoro, Hora, data});
    try {
        if (!id || !latitude || !longitude || !qrcode || !obrigatoro) {
            return res
                .status(400)
                .json({ message: "ID, latitude, longitude,qrcode e obrigatoro são obrigatórios." });
        }

        const pontoRonda = await pontoRondaRepository.criarPontoRonda({
           id, 
           descricao, 
           latitude, 
           longitude, 
           qrcode, 
           obrigatoro, 
           Hora, 
           data,
        });
        res.status(201).json(pontoRonda);
    } catch (error) {
        console.log("Erro ao criar pontoRonda:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um pontoRonda
const atualizaPontoRonda = async (req, res) => {
    const { descricao, latitude, longitude, qrcode, obrigatoro, Hora, data } = req.body;
    const id = parseInt(req.params.id);
    try {
        const pontoRondaAtualizado = await pontoRondaRepository.atualizarPontoRonda({
           id, 
           descricao, 
           latitude, 
           longitude, 
           qrcode, 
           obrigatoro, 
           Hora, 
           data,
        });

        if (pontoRondaAtualizado) {
            res.status(200).json(pontoRondaAtualizado);
        } else {
            res.status(404).json({ message: "pontoRonda não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao atualizar pontoRonda:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um pontoRonda
const deletaPontoRonda = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pontoRondaRemovido = await pontoRondaRepository.deletarPontoRonda({ id });

        if (pontoRondaRemovido) {
            res.status(200).json({
                message: "pontoRonda removido com sucesso.",
                pontoRonda: pontoRondaRemovido,
            });
        } else {
            res.status(404).json({ message: "PontoRonda não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar pontoRonda:", error);
        res.status(500).json({ message: "Erro ao deletar pontoRonda" });
    }
};


module.exports = {
    retornaTodosPontoRonda,
    retornaPontoRondaPorId,
    criarPontoRonda,
    atualizaPontoRonda,
    deletaPontoRonda,
};
