const logAcessoRepository = require("../repositories/logAcessoRepositories");

// Função para retornar todos os logs de acesso
const retornaTodosLogsAcesso = async (req, res) => {
  const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId) : null;
  const sucesso = req.query.sucesso !== undefined ? req.query.sucesso === 'true' : null;
  
  try {
    const logsAcesso = await logAcessoRepository.obterTodosLogsAcesso(usuarioId, sucesso);
    res.status(200).json({ logsAcesso: logsAcesso });
  } catch (error) {
    console.log("Erro ao buscar logs de acesso:", error);
    res.sendStatus(500);
  }
};

// Função para retornar log de acesso por ID
const retornaLogAcessoPorId = async (req, res) => {
  const idLogA = parseInt(req.params.id);
  
  try {
    const logAcesso = await logAcessoRepository.obterLogAcessoPorId(idLogA);
    
    if (!logAcesso) {
      res.status(404).json({ message: "Log de acesso não encontrado" });
    } else {
      res.status(200).json(logAcesso);
    }
  } catch (error) {
    console.log("Erro ao buscar log de acesso:", error);
    res.sendStatus(500);
  }
};

// Função para criar um log de acesso
const criaLogAcesso = async (req, res) => {
  const logData = req.body;
  
  try {
    const logAcessoCriado = await logAcessoRepository.criaLogAcesso(logData);
    res.status(201).json(logAcessoCriado);
  } catch (error) {
    console.log("Erro ao criar log de acesso:", error);
    res.sendStatus(500);
  }
};

// Função para deletar um log de acesso
const deletaLogAcesso = async (req, res) => {
  const idLogA = parseInt(req.params.id);
  
  try {
    const logAcessoDeletado = await logAcessoRepository.deletaLogAcesso(idLogA);
    
    if (!logAcessoDeletado) {
      res.status(404).json({ message: "Log de acesso não encontrado" });
    } else {
      res.status(200).json({ message: "Log de acesso deletado com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar log de acesso:", error);
    res.sendStatus(500);
  }
};

// Função para limpar logs antigos
const limparLogsAntigos = async (req, res) => {
  try {
    const logsLimpos = await logAcessoRepository.limparLogsAntigos();
    res.status(200).json({ 
      message: "Logs antigos limpos com sucesso",
      quantidade: logsLimpos 
    });
  } catch (error) {
    console.log("Erro ao limpar logs antigos:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosLogsAcesso,
  retornaLogAcessoPorId,
  criaLogAcesso,
  deletaLogAcesso,
  limparLogsAntigos,
};
