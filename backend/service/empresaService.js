const empresaRepository = require("../repositories/empresaRepositories");

// Função para retornar todas as empresas
const retornaTodasEmpresas = async (req, res) => {
  try {
    const empresas = await empresaRepository.obterTodasEmpresas();
    res.status(200).json({ empresas: empresas });
  } catch (error) {
    console.log("Erro ao buscar empresas:", error);
    res.sendStatus(500);
  }
};

// Função para buscar empresa por ID
const retornaEmpresaPorId = async (req, res) => {
  const { id } = req.params;
  const idEmpresa = parseInt(req.params.id);
  
  try {
    const empresa = await empresaRepository.obterEmpresaPorId(idEmpresa);
    
    if (!empresa) {
      res.status(404).json({ message: "Empresa não encontrada" });
    } else {
      res.status(200).json(empresa);
    }
  } catch (error) {
    console.log("Erro ao buscar empresa:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma empresa
const criaEmpresa = async (req, res) => {
  const empresaData = req.body;
  
  try {
    const empresaCriada = await empresaRepository.criaEmpresa(empresaData);
    res.status(201).json(empresaCriada);
  } catch (error) {
    console.log("Erro ao criar empresa:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar uma empresa
const atualizaEmpresa = async (req, res) => {
  const idEmpresa = parseInt(req.params.id);
  const empresaData = req.body;
  
  try {
    const empresaAtualizada = await empresaRepository.atualizaEmpresa(idEmpresa, empresaData);
    
    if (!empresaAtualizada) {
      res.status(404).json({ message: "Empresa não encontrada" });
    } else {
      res.status(200).json(empresaAtualizada);
    }
  } catch (error) {
    console.log("Erro ao atualizar empresa:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma empresa
const deletaEmpresa = async (req, res) => {
  const idEmpresa = parseInt(req.params.id);
  
  try {
    const empresaDeletada = await empresaRepository.deletaEmpresa(idEmpresa);
    
    if (!empresaDeletada) {
      res.status(404).json({ message: "Empresa não encontrada" });
    } else {
      res.status(200).json({ message: "Empresa deletada com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar empresa:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasEmpresas,
  retornaEmpresaPorId,
  criaEmpresa,
  atualizaEmpresa,
  deletaEmpresa,
};
