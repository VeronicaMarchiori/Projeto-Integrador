const rondaRepository = require("../repositories/rondaRepositories");
const model = require("../models");

// Função para retornar todas as rondas
const retornaTodasRondas = async (req, res) => {
  try {
    const rondas = await rondaRepository.obterTodasRondas();
    res.status(200).json({ rondas: rondas });
  } catch (error) {
    console.log("Erro ao buscar rondas:", error);
    res.sendStatus(500);
  }
};

// Função para retornar ronda por ID
const retornaRondaPorId = async (req, res) => {
  const idRonda = parseInt(req.params.id);
  
  try {
    const ronda = await rondaRepository.obterRondaPorId(idRonda);
    
    if (!ronda) {
      res.status(404).json({ message: "Ronda não encontrada" });
    } else {
      res.status(200).json(ronda);
    }
  } catch (error) {
    console.log("Erro ao buscar ronda:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma ronda
const criaRonda = async (req, res) => {
  const rondaData = req.body;
  const { pontos, ...dadosRonda } = rondaData;
  
  try {
    // Criar ronda
    const ronda = await rondaRepository.criaRonda(dadosRonda);
    
    // Adicionar pontos se fornecidos
    if (pontos && pontos.length > 0) {
      const rondaCompleta = await model.Ronda.findByPk(ronda.idRonda);
      const pontosRonda = await model.PontoRonda.findAll({
        where: {
          idPontoR: pontos,
        },
      });
      
      if (rondaCompleta && pontosRonda.length > 0) {
        await rondaCompleta.addPontoRondas(pontosRonda);
      }
    }
    
    const rondaCriada = await rondaRepository.obterRondaPorId(ronda.idRonda);
    res.status(201).json(rondaCriada);
  } catch (error) {
    console.log("Erro ao criar ronda:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar uma ronda
const atualizaRonda = async (req, res) => {
  const idRonda = parseInt(req.params.id);
  const rondaData = req.body;
  
  try {
    const rondaAtualizada = await rondaRepository.atualizaRonda(idRonda, rondaData);
    
    if (!rondaAtualizada) {
      res.status(404).json({ message: "Ronda não encontrada" });
    } else {
      res.status(200).json(rondaAtualizada);
    }
  } catch (error) {
    console.log("Erro ao atualizar ronda:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma ronda
const deletaRonda = async (req, res) => {
  const idRonda = parseInt(req.params.id);
  
  try {
    const rondaDeletada = await rondaRepository.deletaRonda(idRonda);
    
    if (!rondaDeletada) {
      res.status(404).json({ message: "Ronda não encontrada" });
    } else {
      res.status(200).json({ message: "Ronda deletada com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar ronda:", error);
    res.sendStatus(500);
  }
};

// Função para adicionar ponto a uma ronda
const adicionaPontoRonda = async (req, res) => {
  const idRonda = parseInt(req.params.idRonda);
  const idPonto = parseInt(req.params.idPonto);
  
  try {
    const ronda = await model.Ronda.findByPk(idRonda);
    const ponto = await model.PontoRonda.findByPk(idPonto);
    
    if (!ronda || !ponto) {
      return res.status(404).json({ message: "Ronda ou ponto não encontrado" });
    }
    
    await ronda.addPontoRonda(ponto);
    res.status(200).json({ message: "Ponto adicionado à ronda com sucesso" });
  } catch (error) {
    console.log("Erro ao adicionar ponto à ronda:", error);
    res.sendStatus(500);
  }
};

// Função para remover ponto de uma ronda
const removePontoRonda = async (req, res) => {
  const idRonda = parseInt(req.params.idRonda);
  const idPonto = parseInt(req.params.idPonto);
  
  try {
    const ronda = await model.Ronda.findByPk(idRonda);
    const ponto = await model.PontoRonda.findByPk(idPonto);
    
    if (!ronda || !ponto) {
      return res.status(404).json({ message: "Ronda ou ponto não encontrado" });
    }
    
    await ronda.removePontoRonda(ponto);
    res.status(200).json({ message: "Ponto removido da ronda com sucesso" });
  } catch (error) {
    console.log("Erro ao remover ponto da ronda:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasRondas,
  retornaRondaPorId,
  criaRonda,
  atualizaRonda,
  deletaRonda,
  adicionaPontoRonda,
  removePontoRonda,
};
