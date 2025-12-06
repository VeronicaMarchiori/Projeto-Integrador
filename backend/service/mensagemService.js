const mensagemRepository = require("../repositories/mensagemRepositories");

// Função para retornar todas as mensagens
const retornaTodasMensagens = async (req, res) => {
  const rondaId = req.query.rondaId ? parseInt(req.query.rondaId) : null;
  
  try {
    const mensagens = await mensagemRepository.obterTodasMensagens(rondaId);
    res.status(200).json({ mensagens: mensagens });
  } catch (error) {
    console.log("Erro ao buscar mensagens:", error);
    res.sendStatus(500);
  }
};

// Função para retornar mensagem por ID
const retornaMensagemPorId = async (req, res) => {
  const idMensagem = parseInt(req.params.id);
  
  try {
    const mensagem = await mensagemRepository.obterMensagemPorId(idMensagem);
    
    if (!mensagem) {
      res.status(404).json({ message: "Mensagem não encontrada" });
    } else {
      res.status(200).json(mensagem);
    }
  } catch (error) {
    console.log("Erro ao buscar mensagem:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma mensagem
const criaMensagem = async (req, res) => {
  const mensagemData = req.body;
  
  try {
    const mensagemCriada = await mensagemRepository.criaMensagem(mensagemData);
    res.status(201).json(mensagemCriada);
  } catch (error) {
    console.log("Erro ao criar mensagem:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar uma mensagem
const atualizaMensagem = async (req, res) => {
  const idMensagem = parseInt(req.params.id);
  const mensagemData = req.body;
  
  try {
    const mensagemAtualizada = await mensagemRepository.atualizaMensagem(idMensagem, mensagemData);
    
    if (!mensagemAtualizada) {
      res.status(404).json({ message: "Mensagem não encontrada" });
    } else {
      res.status(200).json(mensagemAtualizada);
    }
  } catch (error) {
    console.log("Erro ao atualizar mensagem:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma mensagem
const deletaMensagem = async (req, res) => {
  const idMensagem = parseInt(req.params.id);
  
  try {
    const mensagemDeletada = await mensagemRepository.deletaMensagem(idMensagem);
    
    if (!mensagemDeletada) {
      res.status(404).json({ message: "Mensagem não encontrada" });
    } else {
      res.status(200).json({ message: "Mensagem deletada com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar mensagem:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasMensagens,
  retornaMensagemPorId,
  criaMensagem,
  atualizaMensagem,
  deletaMensagem,
};
