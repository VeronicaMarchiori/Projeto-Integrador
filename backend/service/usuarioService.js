const usuarioRepository = require("../repositories/usuarioRepositories");
const bcrypt = require("bcryptjs");

// Função para retornar todos os usuários
const retornaTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioRepository.obterTodosUsuarios();
    res.status(200).json({ usuarios: usuarios });
  } catch (error) {
    console.log("Erro ao buscar usuários:", error);
    res.sendStatus(500);
  }
};

// Função para retornar usuário por ID
const retornaUsuarioPorId = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const usuario = await usuarioRepository.obterUsuarioPorId(idUsuario);
    
    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
    } else {
      res.status(200).json(usuario);
    }
  } catch (error) {
    console.log("Erro ao buscar usuário:", error);
    res.sendStatus(500);
  }
};

// Função para retornar usuário por email
const retornaUsuarioPorEmail = async (req, res) => {
  const { email } = req.params;
  
  try {
    const usuario = await usuarioRepository.obterUsuarioPorEmail(email);
    
    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
    } else {
      res.status(200).json(usuario);
    }
  } catch (error) {
    console.log("Erro ao buscar usuário por email:", error);
    res.sendStatus(500);
  }
};

// Função para criar um usuário
const criaUsuario = async (req, res) => {
  const usuarioData = req.body;
  
  try {
    // Hash da senha
    if (usuarioData.senha) {
      usuarioData.senha = await bcrypt.hash(usuarioData.senha, 10);
    }
    
    // Criar usuário base
    const usuario = await usuarioRepository.criaUsuario(usuarioData);
    
    // Criar perfil específico
    if (usuarioData.tipo === "administrador") {
      await usuarioRepository.criaAdministrador({
        idUsuario: usuario.idUsuario,
        nivelAcesso: usuarioData.nivelAcesso || "padrao",
      });
    } else if (usuarioData.tipo === "vigia") {
      await usuarioRepository.criaVigia({
        idUsuario: usuario.idUsuario,
        foto: usuarioData.foto || null,
        EstaRonda: false,
      });
    }
    
    const usuarioCriado = await usuarioRepository.obterUsuarioPorId(usuario.idUsuario);
    res.status(201).json(usuarioCriado);
  } catch (error) {
    console.log("Erro ao criar usuário:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar um usuário
const atualizaUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const usuarioData = req.body;
  
  try {
    // Hash da senha se for atualizada
    if (usuarioData.senha) {
      usuarioData.senha = await bcrypt.hash(usuarioData.senha, 10);
    }
    
    // Atualizar usuário base
    const usuario = await usuarioRepository.atualizaUsuario(idUsuario, usuarioData);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    // Atualizar perfil específico se fornecido
    if (usuarioData.nivelAcesso) {
      await usuarioRepository.atualizaAdministrador(idUsuario, {
        nivelAcesso: usuarioData.nivelAcesso,
      });
    }
    
    if (usuarioData.foto !== undefined || usuarioData.EstaRonda !== undefined) {
      const vigiaData = {};
      if (usuarioData.foto !== undefined) vigiaData.foto = usuarioData.foto;
      if (usuarioData.EstaRonda !== undefined) vigiaData.EstaRonda = usuarioData.EstaRonda;
      
      await usuarioRepository.atualizaVigia(idUsuario, vigiaData);
    }
    
    const usuarioAtualizado = await usuarioRepository.obterUsuarioPorId(idUsuario);
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.log("Erro ao atualizar usuário:", error);
    res.sendStatus(500);
  }
};

// Função para deletar um usuário
const deletaUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const usuarioDeletado = await usuarioRepository.deletaUsuario(idUsuario);
    
    if (!usuarioDeletado) {
      res.status(404).json({ message: "Usuário não encontrado" });
    } else {
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    }
  } catch (error) {
    console.log("Erro ao deletar usuário:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todos os vigias
const retornaTodosVigias = async (req, res) => {
  try {
    const vigias = await usuarioRepository.obterTodosVigias();
    res.status(200).json({ vigias: vigias });
  } catch (error) {
    console.log("Erro ao buscar vigias:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todos os administradores
const retornaTodosAdministradores = async (req, res) => {
  try {
    const administradores = await usuarioRepository.obterTodosAdministradores();
    res.status(200).json({ administradores: administradores });
  } catch (error) {
    console.log("Erro ao buscar administradores:", error);
    res.sendStatus(500);
  }
};

// Função para verificar senha
const verificaSenha = async (req, res) => {
  const { senhaPlana, senhaHash } = req.body;
  
  try {
    const senhaValida = await bcrypt.compare(senhaPlana, senhaHash);
    res.status(200).json({ valida: senhaValida });
  } catch (error) {
    console.log("Erro ao verificar senha:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosUsuarios,
  retornaUsuarioPorId,
  retornaUsuarioPorEmail,
  criaUsuario,
  atualizaUsuario,
  deletaUsuario,
  retornaTodosVigias,
  retornaTodosAdministradores,
  verificaSenha,
};
