const realizaPercursoRepository = require("../repositories/realizaPercursoRepository");

// Função para retornar todas as realizaPercurso
const retornaTodasRealizaPercurso = async (req, res) => {
    try {
        const realizaPercurso = await realizaPercursoRepository.obterTodasRealizaPercurso();
        res.status(200).json({ realizaPercurso: realizaPercurso });
    } catch (error) {
        console.log("Erro ao buscar realizaPercurso:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todas as realizaPercurso do Vigia
const retornaRealizaPercursoVigia = async (req, res) => {
    try {
        const realizaPercurso = await realizaPercursoRepository.obterRealizaPercursoPorIdVigia(req.params.idVigia);
        res.status(200).json({ realizaPercurso: realizaPercurso });
    } catch (error) {
        console.log("Erro ao buscar realizaPercurso:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todas as realizaPercurso do percurso
const retornaTodasRealizaPercursoPercurso = async (req, res) => {
    try {
        const realizaPercurso = await realizaPercursoRepository.obterRealizaPercursoPorIdPercurso(req.params.idPercurso);
        res.status(200).json({ realizaPercurso: realizaPercurso });
    } catch (error) {
        console.log("Erro ao buscar realizaPercurso:", error);
        res.sendStatus(500);
    }
};

// Função para criar um nova realizaPercurso
const criarRealizaPercurso = async (req, res) => {
    const { idVigia, idPercurso } = req.body;
    try {
        if (!idVigia || !idPercurso) {
            return res
                .status(400)
                .json({ message: "ID do vigia e percurso são obrigatórios." });
        }

        const realizaPercurso = await realizaPercursoRepository.criarRealizaPercurso({
            idVigia,
            idPercurso,
        });
        res.status(201).json(realizaPercurso);
    } catch (error) {
        console.log("Erro ao criar realizaPercurso:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar uma realizaPercurso
const atualizaRealizaPercurso = async (req, res) => {
    const { idVigia } = req.body;
    const idPercurso = parseInt(req.params.idPercurso);

    try {
        const realizaPercursoAtualizada =
            await realizaPercursoRepository.atualizarRealizaPercurso({
                idVigia,
                idPercurso,
            });

        if (realizaPercursoAtualizada) {
            res.status(200).json(realizaPercursoAtualizada);
        } else {
            res.status(404).json({ message: "realizaPercurso não encontrada" });
        }
    } catch (error) {
        console.log("Erro ao atualizar realizaPercurso:", error);
        res.sendStatus(500);
    }
};

// Função para deletar uma realizaPercurso
const deletaRealizaPercurso = async (req, res) => {
    try {
        const idVigia = parseInt(req.params.idVigia);
        const realizaPercursoRemovida = await realizaPercursoRepositories.deletarRealizaPercurso(idVigia);

        if (realizaPercursoRemovida) {
            res.status(200).json({
                message: "realizaPercurso removida com sucesso.",
                realizaPercurso: realizaPercursoRemovida,
            });
        } else {
            res.status(404).json({ message: "realizaPercurso não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao deletar realizaPercurso:", error);
        res.status(500).json({ message: "Erro ao deletar realizaPercurso" });
    }
};

module.exports = {
    retornaTodasRealizaPercurso,
    retornaRealizaPercursoVigia,
    retornaTodasRealizaPercursoPercurso,
    criarRealizaPercurso,
    atualizaRealizaPercurso,
    deletaRealizaPercurso,
};
