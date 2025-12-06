const vigiaRepository = require("../repositories/vigiaRepositories");
const usuarioRepository = require("../repositories/usuarioRepositories");
const bcrypt = require("bcryptjs");

// Função para retornar todos os vigias
const retornaTodosVigias = async (req, res) => {
  try {
    const vigias = await vigiaRepository.obterTodosVigias();
    res.status(200).json({ vigias: vigias });
  } catch (error) {
    console.log("Erro ao buscar vigias:", error);
    res.sendStatus(500);
  }
};

// Função para retornar vigia por ID
const retornaVigiaPorId = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    
    if (!vigia) {
      res.status(404).json({ message: "Vigia não encontrado" });
    } else {
      res.status(200).json(vigia);
    }
  } catch (error) {
    console.log("Erro ao buscar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para retornar vigias ativos
const retornaVigiasAtivos = async (req, res) => {
  try {
    const vigiasAtivos = await vigiaRepository.obterVigiasAtivos();
    res.status(200).json({ vigias: vigiasAtivos });
  } catch (error) {
    console.log("Erro ao buscar vigias ativos:", error);
    res.sendStatus(500);
  }
};

// Função para retornar vigias em ronda
const retornaVigiasEmRonda = async (req, res) => {
  try {
    const vigiasEmRonda = await vigiaRepository.obterVigiasEmRonda();
    res.status(200).json({ vigias: vigiasEmRonda });
  } catch (error) {
    console.log("Erro ao buscar vigias em ronda:", error);
    res.sendStatus(500);
  }
};

// Função para retornar vigias disponíveis (fora de ronda)
const retornaVigiasDisponiveis = async (req, res) => {
  try {
    const vigiasDisponiveis = await vigiaRepository.obterVigiasForaDeRonda();
    res.status(200).json({ vigias: vigiasDisponiveis });
  } catch (error) {
    console.log("Erro ao buscar vigias disponíveis:", error);
    res.sendStatus(500);
  }
};

// Função para criar um novo vigia
const criaVigia = async (req, res) => {
  const { nome, email, senha, telefone, cpf, dataNascimento, foto } = req.body;
  
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

    // Criar perfil de vigia
    await vigiaRepository.criaVigia({
      idUsuario: novoUsuario.idUsuario,
      foto: foto || null,
      EstaRonda: false,
    });

    // Retornar vigia completo
    const vigiaCriado = await vigiaRepository.obterVigiaPorId(novoUsuario.idUsuario);
    res.status(201).json(vigiaCriado);
  } catch (error) {
    console.log("Erro ao criar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar vigia
const atualizaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { nome, email, telefone, cpf, dataNascimento, foto, senha, status } = req.body;
  
  try {
    // Verifica se vigia existe
    const vigiaExistente = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigiaExistente) {
      return res.status(404).json({ message: "Vigia não encontrado" });
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

    // Atualizar dados específicos do vigia
    const dadosVigia = {};
    if (foto !== undefined) dadosVigia.foto = foto;

    if (Object.keys(dadosVigia).length > 0) {
      await vigiaRepository.atualizaVigia(idUsuario, dadosVigia);
    }

    // Retornar vigia atualizado
    const vigiaAtualizado = await vigiaRepository.obterVigiaPorId(idUsuario);
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao atualizar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar foto do vigia
const atualizaFotoVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { foto } = req.body;
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigia) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    const vigiaAtualizado = await vigiaRepository.atualizaFotoVigia(idUsuario, foto);
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao atualizar foto do vigia:", error);
    res.sendStatus(500);
  }
};

// Função para iniciar ronda de um vigia
const iniciaRondaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigia) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    if (vigia.Usuario && !vigia.Usuario.status) {
      return res.status(400).json({ message: "Vigia inativo não pode iniciar ronda" });
    }

    if (vigia.EstaRonda) {
      return res.status(400).json({ message: "Vigia já está em ronda" });
    }

    const vigiaAtualizado = await vigiaRepository.iniciaRondaVigia(idUsuario);
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao iniciar ronda do vigia:", error);
    res.sendStatus(500);
  }
};

// Função para finalizar ronda de um vigia
const finalizaRondaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigia) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    if (!vigia.EstaRonda) {
      return res.status(400).json({ message: "Vigia não está em ronda" });
    }

    const vigiaAtualizado = await vigiaRepository.finalizaRondaVigia(idUsuario);
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao finalizar ronda do vigia:", error);
    res.sendStatus(500);
  }
};

// Função para deletar vigia
const deletaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigia) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    // Verifica se vigia está em ronda
    if (vigia.EstaRonda) {
      return res.status(400).json({ 
        message: "Não é possível deletar vigia que está em ronda. Finalize a ronda primeiro." 
      });
    }

    // Deleta vigia (cascade vai deletar usuário)
    const deletado = await vigiaRepository.deletaVigia(idUsuario);

    if (!deletado) {
      return res.status(500).json({ message: "Erro ao deletar vigia" });
    }

    // Deleta usuário
    await usuarioRepository.deletaUsuario(idUsuario);

    res.status(200).json({ message: "Vigia deletado com sucesso" });
  } catch (error) {
    console.log("Erro ao deletar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para inativar vigia
const inativaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigiaExistente = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigiaExistente) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    await usuarioRepository.atualizaUsuario(idUsuario, { status: false });
    const vigiaAtualizado = await vigiaRepository.obterVigiaPorId(idUsuario);
    
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao inativar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para ativar vigia
const ativaVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigiaExistente = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigiaExistente) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    await usuarioRepository.atualizaUsuario(idUsuario, { status: true });
    const vigiaAtualizado = await vigiaRepository.obterVigiaPorId(idUsuario);
    
    res.status(200).json(vigiaAtualizado);
  } catch (error) {
    console.log("Erro ao ativar vigia:", error);
    res.sendStatus(500);
  }
};

// Função para retornar rondas do vigia
const retornaRondasDoVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    if (!vigia) {
      return res.status(404).json({ message: "Vigia não encontrado" });
    }

    const rondas = await vigiaRepository.obterRondasDoVigia(idUsuario);
    res.status(200).json({ rondas: rondas });
  } catch (error) {
    console.log("Erro ao buscar rondas do vigia:", error);
    res.sendStatus(500);
  }
};

// Função para retornar estatísticas do vigia
const retornaEstatisticasVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const estatisticas = await vigiaRepository.obterEstatisticasVigia(idUsuario);
    
    if (!estatisticas) {
      res.status(404).json({ message: "Vigia não encontrado" });
    } else {
      res.status(200).json(estatisticas);
    }
  } catch (error) {
    console.log("Erro ao buscar estatísticas do vigia:", error);
    res.sendStatus(500);
  }
};

// Função para verificar disponibilidade do vigia
const verificaDisponibilidadeVigia = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  
  try {
    const vigia = await vigiaRepository.obterVigiaPorId(idUsuario);
    
    if (!vigia) {
      return res.status(200).json({ disponivel: false, motivo: "Vigia não encontrado" });
    }

    if (!vigia.Usuario || !vigia.Usuario.status) {
      return res.status(200).json({ disponivel: false, motivo: "Vigia inativo" });
    }

    if (vigia.EstaRonda) {
      return res.status(200).json({ disponivel: false, motivo: "Vigia já está em ronda" });
    }

    res.status(200).json({ disponivel: true, vigia: vigia });
  } catch (error) {
    console.log("Erro ao verificar disponibilidade do vigia:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosVigias,
  retornaVigiaPorId,
  retornaVigiasAtivos,
  retornaVigiasEmRonda,
  retornaVigiasDisponiveis,
  criaVigia,
  atualizaVigia,
  atualizaFotoVigia,
  iniciaRondaVigia,
  finalizaRondaVigia,
  deletaVigia,
  inativaVigia,
  ativaVigia,
  retornaRondasDoVigia,
  retornaEstatisticasVigia,
  verificaDisponibilidadeVigia,
};
