const pontoRondaRepository = require("../repositories/pontoRondaRepositories");

// Função para retornar todos os pontos de ronda
const retornaTodosPontosRonda = async (req, res) => {
  try {
    const pontosRonda = await pontoRondaRepository.obterTodosPontosRonda();
    res.status(200).json({ pontosRonda: pontosRonda });
  } catch (error) {
    console.log("Erro ao buscar pontos de ronda:", error);
    res.sendStatus(500);
  }
};

// Função para retornar ponto de ronda por ID
const retornaPontoRondaPorId = async (req, res) => {
  const idPontoR = parseInt(req.params.id);
  
  try {
    const pontoRonda = await pontoRondaRepository.obterPontoRondaPorId(idPontoR);
    
    if (!pontoRonda) {
      res.status(404).json({ message: "Ponto de ronda não encontrado" });
    } else {
      res.status(200).json(pontoRonda);
    }
  } catch (error) {
    console.log("Erro ao buscar ponto de ronda:", error);
    res.sendStatus(500);
  }
};

// Função para criar um ponto de ronda
const criaPontoRonda = async (req, res) => {
  const pontoData = req.body;
  
  try {
    const pontoRondaCriado = await pontoRondaRepository.criaPontoRonda(pontoData);
    res.status(201).json(pontoRondaCriado);
  } catch (error) {
    console.log("Erro ao criar ponto de ronda:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar um ponto de ronda
const atualizaPontoRonda = async (req, res) => {
  const idPontoR = parseInt(req.params.id);
  const pontoData = req.body;
  
  try {
    const pontoRondaAtualizado = await pontoRondaRepository.atualizaPontoRonda(idPontoR, pontoData);
    
    if (!pontoRondaAtualizado) {
      res.status(404).json({ message: "Ponto de ronda não encontrado" });
    } else {
      res.status(200).json(pontoRondaAtualizado);
    }
  } catch (error) {
    console.log("Erro ao atualizar ponto de ronda:", error);
    res.sendStatus(500);
  }
};

// Função para deletar um ponto de ronda
const deletaPontoRonda = async (req, res) => {
  const idPontoR = parseInt(req.params.id);
  
  try {
    const pontoRondaDeletado = await pontoRondaRepository.deletaPontoRonda(idPontoR);
    
    if (!pontoRondaDeletado) {
      res.status(404).json({ message: "Ponto de ronda não encontrado" });
    } else {
      res.status(200).json({ message: "Ponto de ronda deletado com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar ponto de ronda:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosPontosRonda,
  retornaPontoRondaPorId,
  criaPontoRonda,
  atualizaPontoRonda,
  deletaPontoRonda,
};
