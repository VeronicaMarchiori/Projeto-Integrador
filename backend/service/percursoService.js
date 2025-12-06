const percursoRepository = require("../repositories/percursoRepository");

// Função para retornar todos os percurso
const retornaTodasPercurso = async (req, res) => {
    try {
        const percurso = await percursoRepository.obterTodosPercurso();
        res.status(200).json({ percurso: percurso });
    } catch (error) {
        console.log("Erro ao buscar percurso:", error);
        res.sendStatus(500);
    }
};

// Função para retornar todos os Percurso de um ronda
const retornaPercursoPorRonda = async (req, res) => {
    try {
        const idRonda = parseInt(req.params.idRonda);
        const percurso = await percursoRepository.obtePercursoPorIdRonda(idRonda);
        res.status(200).json({ percurso: percurso });
    } catch (error) {
        console.log("Erro ao buscar Percurso:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo Percurso
const criarPercurso = async (req, res) => {
    const {id,dataInicio, dataFim, kmPercorrido, observacoes, idRonda} = req.body;
    try {
        if (!id || !kmPercorrido || !idRonda) {
            return res
                .status(400)
                .json({
                    message: "ID, kmPercorrido e ID do Ronda são obrigatórios.",
                });
        }

        const percurso = await percursoRepository.criarPercurso({
            id,
            dataInicio, 
            dataFim, 
            kmPercorrido, 
            observacoes, 
            idRonda,
        });
        res.status(201).json(percurso);
    } catch (error) {
        console.log("Erro ao criar Percurso:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um percurso
const atualizaPercurso = async (req, res) => {
    const {dataInicio, dataFim, kmPercorrido, observacoes, idRonda } = req.body;
    const id = parseInt(req.params.id);
    try {
        const percursoAtualizado = await percursoRepository.atualizarPercurso({
            id,
            dataInicio, 
            dataFim, 
            kmPercorrido, 
            observacoes, 
            idRonda,
        });

        if (percursoAtualizado) {
            res.status(200).json(percursoAtualizado);
        } else {
            res.status(404).json({ message: "percurso não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao atualizar percurso:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um percurso
const deletaPercurso = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const percursoRemovido = await percursoRepository.deletarPercurso({ id });

        if (percursoRemovido) {
            res.status(200).json({
                message: "percurso removido com sucesso.",
                percurso: percursoRemovido,
            });
        } else {
            res.status(404).json({ message: "percurso não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar percurso:", error);
        res.status(500).json({ message: "Erro ao deletar percurso" });
    }
};

// Função para buscar percurso por ID
const retornaPercursoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const percurso = await percursoRepository.obterPercursoPorId({
            id,
        });

        if (percurso) {
            res.status(200).json(percurso);
        } else {
            res.status(404).json({ message: "percurso não encontrado." });
        }
    } catch (error) {
        console.log("Erro ao buscar percurso:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodasPercurso,
    retornaPercursoPorRonda,
    criarPercurso,
    atualizaPercurso,
    deletaPercurso,
    retornaPercursoPorId,
};
