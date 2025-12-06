const model = require("../models");

// Função para obter todas as empresas
const obterTodasEmpresas = async () => {
  return await model.Empresa.findAll({
    order: [["nome", "ASC"]],
  });
};

// Função para obter empresa por ID
const obterEmpresaPorId = async (idEmpresa) => {
  return await model.Empresa.findByPk(idEmpresa);
};

// Função para criar uma nova empresa
const criaEmpresa = async (empresaData) => {
  const novaEmpresa = await model.Empresa.create(empresaData);
  return novaEmpresa;
};

// Função para atualizar uma empresa
const atualizaEmpresa = async (empresaData) => {
  try {
    await model.Empresa.update(empresaData, {
      where: { idEmpresa: empresaData.idEmpresa },
    });
    return await obterEmpresaPorId(empresaData.idEmpresa);
  } catch (error) {
    throw error;
  }
};

// Função para deletar uma empresa
const deletaEmpresa = async (idEmpresa) => {
  const empresa = await obterEmpresaPorId(idEmpresa);
  await model.Empresa.destroy({
    where: { idEmpresa: idEmpresa },
  });
  return empresa;
};

module.exports = {
  obterTodasEmpresas,
  obterEmpresaPorId,
  criaEmpresa,
  atualizaEmpresa,
  deletaEmpresa,
};
