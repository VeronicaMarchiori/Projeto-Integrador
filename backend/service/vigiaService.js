const vigiaRepository = require("../repositories/vigiaRepository");

// Função para retornar todas as vigia
const retornaTodosVigia = async (req, res) => {
    try {
        const vigia = await vigiaRepository.obterTodasVigia();
        res.status(200).json({ vigia: vigia });
    } catch (error) {
        console.log("Erro ao buscar vigia:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todas as adminivigiastrador do IdUsuario
const retornaVigiaPorUsuario = async (req, res) => {
    try {
        const vigia = await vigiaRepository.obterVigiaPorIdUsuario(
            req.params.IdUsuario,
        );
        res.status(200).json({ vigia: vigia });
    } catch (error) {
        console.log("Erro ao buscar vigia:", error);
        res.sendStatus(500);
    }
};

// Função para criar um nova vigia
const criarVigia = async (req, res) => {
    const { IdUsuario, nivelAcesso } = req.body;
    try {
        if (!IdUsuario || !nivelAcesso) {
            return res
                .status(400)
                .json({ message: "ID do Usuario e o nivel de Acesso são obrigatórios." });
        }

        const vigia = await vigiaRepository.criarVigia({
            IdUsuario,
            nivelAcesso,
        });
        res.status(201).json(vigia);
    } catch (error) {
        console.log("Erro ao criar vigia:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar uma vigia
const atualizaVigia = async (req, res) => {
    const { nivelAcesso } = req.body;
    const IdUsuario = parseInt(req.params.IdUsuario);

    try {
        const vigiaAtualizada =
            await vigiaRepository.atualizarVigia({
                IdUsuario,
                nivelAcesso,
            });

        if (vigiaAtualizada) {
            res.status(200).json(vigiaAtualizada);
        } else {
            res.status(404).json({ message: "vigia não encontrada" });
        }
    } catch (error) {
        console.log("Erro ao atualizar vigia:", error);
        res.sendStatus(500);
    }
};

// Função para deletar uma vigia
const deletaVigia = async (req, res) => {
    try {
        const IdUsuario = parseInt(req.params.IdUsuario);
        const vigiaRemovida =
            await vigiaRepository.deletarVigia(IdUsuario);

        if (vigiaRemovida) {
            res.status(200).json({
                message: "vigia removida com sucesso.",
                Vigia: vigiaRemovida,
            });
        } else {
            res.status(404).json({ message: "vigia não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao deletar vigia:", error);
        res.status(500).json({ message: "Erro ao deletar vigia" });
    }
};

module.exports = {
    retornaTodosVigia,
    retornaVigiaPorUsuario, 
    criarVigia,
    atualizaVigia,
    deletaVigia,
};
