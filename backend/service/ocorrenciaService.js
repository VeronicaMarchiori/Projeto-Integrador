const ocorrenciaRepository = require("../repositories/ocorrenciaRepositories");

// Função para retornar todas as ocorrências
const retornaTodasOcorrencias = async (req, res) => {
  try {
    const ocorrencias = await ocorrenciaRepository.obterTodasOcorrencias();
    res.status(200).json({ ocorrencias: ocorrencias });
  } catch (error) {
    console.log("Erro ao buscar ocorrências:", error);
    res.sendStatus(500);
  }
};

// Função para retornar ocorrência por ID
const retornaOcorrenciaPorId = async (req, res) => {
  const idOcorrencia = parseInt(req.params.id);
  
  try {
    const ocorrencia = await ocorrenciaRepository.obterOcorrenciaPorId(idOcorrencia);
    
    if (!ocorrencia) {
      res.status(404).json({ message: "Ocorrência não encontrada" });
    } else {
      res.status(200).json(ocorrencia);
    }
  } catch (error) {
    console.log("Erro ao buscar ocorrência:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma ocorrência
const criaOcorrencia = async (req, res) => {
  const ocorrenciaData = req.body;
  
  try {
    // Adicionar data e hora atuais se não fornecidas
    if (!ocorrenciaData.data) {
      ocorrenciaData.data = new Date().toISOString().split("T")[0];
    }
    
    if (!ocorrenciaData.hora) {
      ocorrenciaData.hora = new Date().toISOString().split("T")[1].split(".")[0];
    }
    
    const ocorrenciaCriada = await ocorrenciaRepository.criaOcorrencia(ocorrenciaData);
    res.status(201).json(ocorrenciaCriada);
  } catch (error) {
    console.log("Erro ao criar ocorrência:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar uma ocorrência
const atualizaOcorrencia = async (req, res) => {
  const idOcorrencia = parseInt(req.params.id);
  const ocorrenciaData = req.body;
  
  try {
    const ocorrenciaAtualizada = await ocorrenciaRepository.atualizaOcorrencia(idOcorrencia, ocorrenciaData);
    
    if (!ocorrenciaAtualizada) {
      res.status(404).json({ message: "Ocorrência não encontrada" });
    } else {
      res.status(200).json(ocorrenciaAtualizada);
    }
  } catch (error) {
    console.log("Erro ao atualizar ocorrência:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma ocorrência
const deletaOcorrencia = async (req, res) => {
  const idOcorrencia = parseInt(req.params.id);
  
  try {
    const ocorrenciaDeletada = await ocorrenciaRepository.deletaOcorrencia(idOcorrencia);
    
    if (!ocorrenciaDeletada) {
      res.status(404).json({ message: "Ocorrência não encontrada" });
    } else {
      res.status(200).json({ message: "Ocorrência deletada com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar ocorrência:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasOcorrencias,
  retornaOcorrenciaPorId,
  criaOcorrencia,
  atualizaOcorrencia,
  deletaOcorrencia,
};
