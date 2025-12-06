const administradorRepository = require("../repositories/administradorRepositories");
const usuarioRepository = require("../repositories/usuarioRepositories");
const bcrypt = require("bcryptjs");

// Função para retornar todos os administradores
const retornaTodosAdministradores = async (req, res) => {
  try {
    const administradores = await administradorRepository.obterTodosAdministradores();
    res.status(200).json({ administradores: administradores });
  } catch (error) {
    console.log("Erro ao buscar administradores:", error);
    res.sendStatus(500);
  }
};

// Função para retornar administrador por ID
const retornaAdministradorPorId = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const administrador = await administradorRepository.obterAdministradorPorId(idUsuario);
    
    if (!administrador) {
      res.status(404).json({ message: "Administrador não encontrado" });
    } else {
      res.status(200).json(administrador);
    }
  } catch (error) {
    console.log("Erro ao buscar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para retornar administradores ativos
const retornaAdministradoresAtivos = async (req, res) => {
  try {
    const administradoresAtivos = await administradorRepository.obterAdministradoresAtivos();
    res.status(200).json({ administradores: administradoresAtivos });
  } catch (error) {
    console.log("Erro ao buscar administradores ativos:", error);
    res.sendStatus(500);
  }
};

// Função para retornar administradores por nível de acesso
const retornaAdministradoresPorNivel = async (req, res) => {
  const { nivel } = req.params;
  const niveisValidos = ["padrao", "supervisor", "master"];
  
  try {
    if (!niveisValidos.includes(nivel)) {
      return res.status(400).json({ 
        message: "Nível de acesso inválido. Use: padrao, supervisor ou master" 
      });
    }

    const administradores = await administradorRepository.obterAdministradoresPorNivel(nivel);
    res.status(200).json({ administradores: administradores });
  } catch (error) {
    console.log("Erro ao buscar administradores por nível:", error);
    res.sendStatus(500);
  }
};

// Função para criar um novo administrador
const criaAdministrador = async (req, res) => {
  const { nome, email, senha, telefone, cpf, dataNascimento, nivelAcesso } = req.body;
  
  try {
    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }

    // Verifica se email já existe
    const usuarioExistente = await usuarioRepository.obterUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: "Email já cadastrado no sistema" });
    }

    // Valida nível de acesso
    const niveisValidos = ["padrao", "supervisor", "master"];
    const nivelFinal = nivelAcesso && niveisValidos.includes(nivelAcesso) 
      ? nivelAcesso 
      : "padrao";

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário base
    const novoUsuario = await usuarioRepository.criaUsuario({
      nome,
      email,
      senha: senhaHash,
      telefone: telefone || null,
      cpf: cpf || null,
      dataNascimento: dataNascimento || null,
      status: true,
    });

    // Criar perfil de administrador
    await administradorRepository.criaAdministrador({
      idUsuario: novoUsuario.idUsuario,
      nivelAcesso: nivelFinal,
    });

    // Retornar administrador completo
    const administradorCriado = await administradorRepository.obterAdministradorPorId(novoUsuario.idUsuario);
    res.status(201).json(administradorCriado);
  } catch (error) {
    console.log("Erro ao criar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar administrador
const atualizaAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { nome, email, telefone, cpf, dataNascimento, nivelAcesso, senha, status } = req.body;
  
  try {
    // Verifica se administrador existe
    const adminExistente = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!adminExistente) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    // Atualizar dados do usuário se fornecidos
    const dadosUsuario = {};
    if (nome) dadosUsuario.nome = nome;
    if (email) {
      // Verifica se email já está em uso por outro usuário
      const usuarioComEmail = await usuarioRepository.obterUsuarioPorEmail(email);
      if (usuarioComEmail && usuarioComEmail.idUsuario !== idUsuario) {
        return res.status(400).json({ message: "Email já está em uso por outro usuário" });
      }
      dadosUsuario.email = email;
    }
    if (telefone !== undefined) dadosUsuario.telefone = telefone;
    if (cpf !== undefined) dadosUsuario.cpf = cpf;
    if (dataNascimento !== undefined) dadosUsuario.dataNascimento = dataNascimento;
    if (status !== undefined) dadosUsuario.status = status;
    if (senha) {
      dadosUsuario.senha = await bcrypt.hash(senha, 10);
    }

    if (Object.keys(dadosUsuario).length > 0) {
      await usuarioRepository.atualizaUsuario(idUsuario, dadosUsuario);
    }

    // Atualizar dados específicos do administrador
    if (nivelAcesso) {
      const niveisValidos = ["padrao", "supervisor", "master"];
      if (!niveisValidos.includes(nivelAcesso)) {
        return res.status(400).json({ 
          message: "Nível de acesso inválido. Use: padrao, supervisor ou master" 
        });
      }

      await administradorRepository.atualizaNivelAcesso(idUsuario, nivelAcesso);
    }

    // Retornar administrador atualizado
    const administradorAtualizado = await administradorRepository.obterAdministradorPorId(idUsuario);
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao atualizar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar nível de acesso
const atualizaNivelAcesso = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { nivelAcesso } = req.body;
  const niveisValidos = ["padrao", "supervisor", "master"];
  
  try {
    if (!niveisValidos.includes(nivelAcesso)) {
      return res.status(400).json({ 
        message: "Nível de acesso inválido. Use: padrao, supervisor ou master" 
      });
    }

    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    const administradorAtualizado = await administradorRepository.atualizaNivelAcesso(idUsuario, nivelAcesso);
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao atualizar nível de acesso:", error);
    res.sendStatus(500);
  }
};

// Função para deletar administrador
const deletaAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    // Verifica se é o último administrador master
    if (admin.nivelAcesso === "master") {
      const adminsMaster = await administradorRepository.obterAdministradoresPorNivel("master");
      if (adminsMaster.length === 1) {
        return res.status(400).json({ 
          message: "Não é possível deletar o último administrador master do sistema" 
        });
      }
    }

    // Deleta administrador (cascade vai deletar usuário)
    const deletado = await administradorRepository.deletaAdministrador(idUsuario);

    if (!deletado) {
      return res.status(500).json({ message: "Erro ao deletar administrador" });
    }

    // Deleta usuário
    await usuarioRepository.deletaUsuario(idUsuario);

    res.status(200).json({ message: "Administrador deletado com sucesso" });
  } catch (error) {
    console.log("Erro ao deletar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para inativar administrador
const inativaAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const adminExistente = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!adminExistente) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    await usuarioRepository.atualizaUsuario(idUsuario, { status: false });
    const administradorAtualizado = await administradorRepository.obterAdministradorPorId(idUsuario);
    
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao inativar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para ativar administrador
const ativaAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const adminExistente = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!adminExistente) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    await usuarioRepository.atualizaUsuario(idUsuario, { status: true });
    const administradorAtualizado = await administradorRepository.obterAdministradorPorId(idUsuario);
    
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao ativar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para retornar rondas criadas pelo administrador
const retornaRondasDoAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    const rondas = await administradorRepository.obterRondasDoAdministrador(idUsuario);
    res.status(200).json({ rondas: rondas });
  } catch (error) {
    console.log("Erro ao buscar rondas do administrador:", error);
    res.sendStatus(500);
  }
};

// Função para retornar estatísticas do administrador
const retornaEstatisticasAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const estatisticas = await administradorRepository.obterEstatisticasAdministrador(idUsuario);
    
    if (!estatisticas) {
      res.status(404).json({ message: "Administrador não encontrado" });
    } else {
      res.status(200).json(estatisticas);
    }
  } catch (error) {
    console.log("Erro ao buscar estatísticas do administrador:", error);
    res.sendStatus(500);
  }
};

// Função para verificar se é administrador master
const verificaAdministradorMaster = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const isMaster = await administradorRepository.isAdministradorMaster(idUsuario);
    res.status(200).json({ isMaster: isMaster });
  } catch (error) {
    console.log("Erro ao verificar administrador master:", error);
    res.sendStatus(500);
  }
};

// Função para retornar dashboard do administrador
const retornaDashboardAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const dashboard = await administradorRepository.obterDashboardAdministrador(idUsuario);
    
    if (!dashboard) {
      res.status(404).json({ message: "Administrador não encontrado" });
    } else {
      res.status(200).json(dashboard);
    }
  } catch (error) {
    console.log("Erro ao buscar dashboard do administrador:", error);
    res.sendStatus(500);
  }
};

// Função para promover administrador para nível superior
const promoveAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    let novoNivel;
    switch (admin.nivelAcesso) {
      case "padrao":
        novoNivel = "supervisor";
        break;
      case "supervisor":
        novoNivel = "master";
        break;
      case "master":
        return res.status(400).json({ message: "Administrador já está no nível máximo" });
      default:
        return res.status(400).json({ message: "Nível de acesso inválido" });
    }

    const administradorAtualizado = await administradorRepository.atualizaNivelAcesso(idUsuario, novoNivel);
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao promover administrador:", error);
    res.sendStatus(500);
  }
};

// Função para rebaixar administrador para nível inferior
const rebaixaAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    // Verifica se é o último master
    if (admin.nivelAcesso === "master") {
      const adminsMaster = await administradorRepository.obterAdministradoresPorNivel("master");
      if (adminsMaster.length === 1) {
        return res.status(400).json({ 
          message: "Não é possível rebaixar o último administrador master do sistema" 
        });
      }
    }

    let novoNivel;
    switch (admin.nivelAcesso) {
      case "master":
        novoNivel = "supervisor";
        break;
      case "supervisor":
        novoNivel = "padrao";
        break;
      case "padrao":
        return res.status(400).json({ message: "Administrador já está no nível mínimo" });
      default:
        return res.status(400).json({ message: "Nível de acesso inválido" });
    }

    const administradorAtualizado = await administradorRepository.atualizaNivelAcesso(idUsuario, novoNivel);
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    console.log("Erro ao rebaixar administrador:", error);
    res.sendStatus(500);
  }
};

// Função para validar permissões do administrador
const validaPermissoesAdministrador = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { acaoRequerida } = req.body;
  
  try {
    const admin = await administradorRepository.obterAdministradorPorId(idUsuario);
    
    if (!admin) {
      return res.status(200).json({ 
        permitido: false, 
        motivo: "Administrador não encontrado" 
      });
    }

    if (!admin.Usuario || !admin.Usuario.status) {
      return res.status(200).json({ 
        permitido: false, 
        motivo: "Administrador inativo" 
      });
    }

    // Define permissões por nível
    const permissoes = {
      padrao: ["visualizar", "criar_ronda", "editar_ronda"],
      supervisor: ["visualizar", "criar_ronda", "editar_ronda", "gerenciar_vigias", "visualizar_relatorios"],
      master: ["todas"], // Master tem todas as permissões
    };

    const permissoesNivel = permissoes[admin.nivelAcesso] || [];

    if (permissoesNivel.includes("todas") || permissoesNivel.includes(acaoRequerida)) {
      return res.status(200).json({ permitido: true, nivel: admin.nivelAcesso });
    }

    res.status(200).json({ 
      permitido: false, 
      motivo: `Nível ${admin.nivelAcesso} não tem permissão para: ${acaoRequerida}` 
    });
  } catch (error) {
    console.log("Erro ao validar permissões do administrador:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosAdministradores,
  retornaAdministradorPorId,
  retornaAdministradoresAtivos,
  retornaAdministradoresPorNivel,
  criaAdministrador,
  atualizaAdministrador,
  atualizaNivelAcesso,
  deletaAdministrador,
  inativaAdministrador,
  ativaAdministrador,
  retornaRondasDoAdministrador,
  retornaEstatisticasAdministrador,
  verificaAdministradorMaster,
  retornaDashboardAdministrador,
  promoveAdministrador,
  rebaixaAdministrador,
  validaPermissoesAdministrador,
};
