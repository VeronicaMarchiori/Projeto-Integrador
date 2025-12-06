const percursoRepository = require("../repositories/percursoRepositories");
const model = require("../models");

// Função para retornar todos os percursos
const retornaTodosPercursos = async (req, res) => {
  try {
    const percursos = await percursoRepository.obterTodosPercursos();
    res.status(200).json({ percursos: percursos });
  } catch (error) {
    console.log("Erro ao buscar percursos:", error);
    res.sendStatus(500);
  }
};

// Função para retornar percurso por ID
const retornaPercursoPorId = async (req, res) => {
  const idPercurso = parseInt(req.params.id);
  
  try {
    const percurso = await percursoRepository.obterPercursoPorId(idPercurso);
    
    if (!percurso) {
      res.status(404).json({ message: "Percurso não encontrado" });
    } else {
      res.status(200).json(percurso);
    }
  } catch (error) {
    console.log("Erro ao buscar percurso:", error);
    res.sendStatus(500);
  }
};

// Função para criar um percurso
const criaPercurso = async (req, res) => {
  const percursoData = req.body;
  const { vigias, ...dadosPercurso } = percursoData;
  
  try {
    // Criar percurso
    const percurso = await percursoRepository.criaPercurso(dadosPercurso);
    
    // Adicionar vigias se fornecidos
    if (vigias && vigias.length > 0) {
      const percursoCompleto = await model.Percurso.findByPk(percurso.idPercurso);
      const vigiasEncontrados = await model.Vigia.findAll({
        where: {
          idUsuario: vigias,
        },
      });
      
      if (percursoCompleto && vigiasEncontrados.length > 0) {
        await percursoCompleto.addVigias(vigiasEncontrados);
      }
    }
    
    const percursoCriado = await percursoRepository.obterPercursoPorId(percurso.idPercurso);
    res.status(201).json(percursoCriado);
  } catch (error) {
    console.log("Erro ao criar percurso:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar um percurso
const atualizaPercurso = async (req, res) => {
  const idPercurso = parseInt(req.params.id);
  const percursoData = req.body;
  
  try {
    const percursoAtualizado = await percursoRepository.atualizaPercurso(idPercurso, percursoData);
    
    if (!percursoAtualizado) {
      res.status(404).json({ message: "Percurso não encontrado" });
    } else {
      res.status(200).json(percursoAtualizado);
    }
  } catch (error) {
    console.log("Erro ao atualizar percurso:", error);
    res.sendStatus(500);
  }
};

// Função para deletar um percurso
const deletaPercurso = async (req, res) => {
  const idPercurso = parseInt(req.params.id);
  
  try {
    const percursoDeletado = await percursoRepository.deletaPercurso(idPercurso);
    
    if (!percursoDeletado) {
      res.status(404).json({ message: "Percurso não encontrado" });
    } else {
      res.status(200).json({ message: "Percurso deletado com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar percurso:", error);
    res.sendStatus(500);
  }
};

// Função para adicionar vigia a um percurso
const adicionaVigiaPercurso = async (req, res) => {
  const idPercurso = parseInt(req.params.idPercurso);
  const idVigia = parseInt(req.params.idVigia);
  
  try {
    const percurso = await model.Percurso.findByPk(idPercurso);
    const vigia = await model.Vigia.findByPk(idVigia);
    
    if (!percurso || !vigia) {
      return res.status(404).json({ message: "Percurso ou vigia não encontrado" });
    }
    
    await percurso.addVigia(vigia);
    res.status(200).json({ message: "Vigia adicionado ao percurso com sucesso" });
  } catch (error) {
    console.log("Erro ao adicionar vigia ao percurso:", error);
    res.sendStatus(500);
  }
};

// Função para remover vigia de um percurso
const removeVigiaPercurso = async (req, res) => {
  const idPercurso = parseInt(req.params.idPercurso);
  const idVigia = parseInt(req.params.idVigia);
  
  try {
    const percurso = await model.Percurso.findByPk(idPercurso);
    const vigia = await model.Vigia.findByPk(idVigia);
    
    if (!percurso || !vigia) {
      return res.status(404).json({ message: "Percurso ou vigia não encontrado" });
    }
    
    await percurso.removeVigia(vigia);
    res.status(200).json({ message: "Vigia removido do percurso com sucesso" });
  } catch (error) {
    console.log("Erro ao remover vigia do percurso:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosPercursos,
  retornaPercursoPorId,
  criaPercurso,
  atualizaPercurso,
  deletaPercurso,
  adicionaVigiaPercurso,
  removeVigiaPercurso,
};
