-- BANCO DE DADOS COMPLETO

-- LIMPAR E RECRIAR O BANCO 
 DROP TABLE IF EXISTS LogAcesso CASCADE;
 DROP TABLE IF EXISTS Mensagem CASCADE;
 DROP TABLE IF EXISTS Ocorrencia CASCADE;
 DROP TABLE IF EXISTS realizaPercurso CASCADE;
 DROP TABLE IF EXISTS Percurso CASCADE;
 DROP TABLE IF EXISTS TemPontosRondas CASCADE;
 DROP TABLE IF EXISTS PontoRonda CASCADE;
 DROP TABLE IF EXISTS Ronda CASCADE;
 DROP TABLE IF EXISTS Empresa CASCADE;
 DROP TABLE IF EXISTS Vigia CASCADE;
 DROP TABLE IF EXISTS Administrador CASCADE;
 DROP TABLE IF EXISTS Usuario CASCADE;


-- Tabela Usuario (base para Administrador e Vigia)
CREATE TABLE Usuario (
  idUsuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT true,
  dataNascimento DATE,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Administrador (herança de Usuario)
CREATE TABLE  Administrador (
  idUsuario INTEGER PRIMARY KEY,
  nivelAcesso VARCHAR(20) NOT NULL CHECK (nivelAcesso IN ('padrao', 'supervisor', 'master')),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Tabela Vigia (herança de Usuario)
CREATE TABLE  Vigia (
  idUsuario INTEGER PRIMARY KEY,
  foto TEXT,
  EstaRonda BOOLEAN DEFAULT false,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Tabela Empresa
CREATE TABLE Empresa (
  idEmpresa SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

-- Tabela Ronda
CREATE TABLE  Ronda (
  idRonda SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sequenciaPontos TEXT,
  tempoEstimado VARCHAR(20),
  periodo VARCHAR(50),
  dataInicio TIMESTAMP,
  dataFim TIMESTAMP,
  fk_Empresa_idEmpresa INTEGER NOT NULL,
  fk_Administrador_idUsuario INTEGER NOT NULL,
  FOREIGN KEY (fk_Empresa_idEmpresa) REFERENCES Empresa(idEmpresa) ON DELETE CASCADE,
  FOREIGN KEY (fk_Administrador_idUsuario) REFERENCES Administrador(idUsuario)
);

-- Tabela PontoRonda
CREATE TABLE  PontoRonda (
  idPontoR SERIAL PRIMARY KEY,
  descricao VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  qrcode TEXT,
  obrigatorio BOOLEAN DEFAULT true,
  hora TIME,
  data DATE
);

-- Tabela TemPontosRondas (relacionamento N:N entre Ronda e PontoRonda)
CREATE TABLE  TemPontosRondas (
  fk_Ronda_idRonda INTEGER NOT NULL,
  fk_PontoRonda_idPontoR INTEGER NOT NULL,
  PRIMARY KEY (fk_Ronda_idRonda, fk_PontoRonda_idPontoR),
  FOREIGN KEY (fk_Ronda_idRonda) REFERENCES Ronda(idRonda) ON DELETE CASCADE,
  FOREIGN KEY (fk_PontoRonda_idPontoR) REFERENCES PontoRonda(idPontoR) ON DELETE CASCADE
);

-- Tabela Percurso
CREATE TABLE  Percurso (
  idPercurso SERIAL PRIMARY KEY,
  distancia DECIMAL(10, 2),
  dataInicio TIMESTAMP,
  dataFim TIMESTAMP,
  kmPercorrido DECIMAL(10, 2),
  observacoes TEXT,
  fk_Ronda_idRonda INTEGER NOT NULL,
  FOREIGN KEY (fk_Ronda_idRonda) REFERENCES Ronda(idRonda)
);

-- Tabela realizaPercurso (relacionamento N:N entre Vigia e Percurso)
CREATE TABLE  realizaPercurso (
  fk_Vigia_idUsuario INTEGER NOT NULL,
  fk_Percurso_idPercurso INTEGER NOT NULL,
  PRIMARY KEY (fk_Vigia_idUsuario, fk_Percurso_idPercurso),
  FOREIGN KEY (fk_Vigia_idUsuario) REFERENCES Vigia(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (fk_Percurso_idPercurso) REFERENCES Percurso(idPercurso) ON DELETE CASCADE
);

-- Tabela Ocorrencia
CREATE TABLE  Ocorrencia (
  idOcorrencia SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  data DATE,
  hora TIME,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  fotos TEXT,
  fk_Percurso_idPercurso INTEGER NOT NULL,
  fk_Usuario_idUsuario INTEGER NOT NULL,
  FOREIGN KEY (fk_Percurso_idPercurso) REFERENCES Percurso(idPercurso),
  FOREIGN KEY (fk_Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);

-- Tabela Mensagem
CREATE TABLE  Mensagem (
  idMensagem SERIAL PRIMARY KEY,
  conteudo TEXT NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  hora TIME DEFAULT CURRENT_TIME,
  fk_Ronda_idRonda INTEGER,
  fk_Usuario_idUsuario INTEGER NOT NULL,
  FOREIGN KEY (fk_Ronda_idRonda) REFERENCES Ronda(idRonda),
  FOREIGN KEY (fk_Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);

-- Tabela LogAcesso
CREATE TABLE  LogAcesso (
  idLogA SERIAL PRIMARY KEY,
  data DATE DEFAULT CURRENT_DATE,
  sucesso BOOLEAN NOT NULL,
  ip VARCHAR(45),
  hora TIME DEFAULT CURRENT_TIME,
  fk_Usuario_idUsuario INTEGER NOT NULL,
  FOREIGN KEY (fk_Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);

-- ÍNDICES PARA PERFORMANCE

CREATE INDEX IF NOT EXISTS idx_usuario_email ON Usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_cpf ON Usuario(cpf);
CREATE INDEX IF NOT EXISTS idx_vigia_ronda ON Vigia(EstaRonda);
CREATE INDEX IF NOT EXISTS idx_ronda_empresa ON Ronda(fk_Empresa_idEmpresa);
CREATE INDEX IF NOT EXISTS idx_percurso_ronda ON Percurso(fk_Ronda_idRonda);
CREATE INDEX IF NOT EXISTS idx_ocorrencia_percurso ON Ocorrencia(fk_Percurso_idPercurso);
CREATE INDEX IF NOT EXISTS idx_mensagem_ronda ON Mensagem(fk_Ronda_idRonda);
CREATE INDEX IF NOT EXISTS idx_logacesso_usuario ON LogAcesso(fk_Usuario_idUsuario);

-- DADOS INICIAIS

-- Usuário Administrador Master
-- Login: admin@admin.com | Senha: admin
INSERT INTO Usuario (nome, email, senha, cpf, telefone, status, dataNascimento) 
VALUES (
  'Administrador Master',
  'admin@admin.com',
  '$2a$10$rOzJQjYgV0V1n0Z.HYxYVOGKjYXQXqxZxJnYvVxGxqKXQXqxZxJnY',
  '000.000.000-00',
  '(11) 99999-9999',
  true,
  '1990-01-01'
) ON CONFLICT (email) DO NOTHING;

-- Inserir perfil de Administrador
INSERT INTO Administrador (idUsuario, nivelAcesso)
SELECT idUsuario, 'master'
FROM Usuario
WHERE email = 'admin@admin.com'
ON CONFLICT (idUsuario) DO NOTHING;

-- Usuário Vigilante
-- Login: vigilante@vigilante.com | Senha: vigilante
INSERT INTO Usuario (nome, email, senha, cpf, telefone, status, dataNascimento)
VALUES (
  'Vigilante Exemplo',
  'vigilante@vigilante.com',
  '$2a$10$vigilanteHashExampleOnly.ThisIsNotRealHash12345',
  '111.111.111-11',
  '(11) 98888-8888',
  true,
  '1995-05-15'
) ON CONFLICT (email) DO NOTHING;

-- Inserir perfil de Vigia
INSERT INTO Vigia (idUsuario, foto, EstaRonda)
SELECT idUsuario, NULL, false
FROM Usuario
WHERE email = 'vigilante@vigilante.com'
ON CONFLICT (idUsuario) DO NOTHING;

-- Empresa Exemplo
INSERT INTO Empresa (nome, cnpj, endereco, telefone, email)
VALUES (
  'Empresa Exemplo LTDA',
  '00.000.000/0001-00',
  'Rua Exemplo, 123 - Centro, São Paulo - SP',
  '(11) 3333-3333',
  'contato@empresa.com'
) ON CONFLICT (cnpj) DO NOTHING;

-- Pontos de Ronda Exemplo
INSERT INTO PontoRonda (descricao, latitude, longitude, qrcode, obrigatorio)
VALUES 
  ('Portaria Principal', -23.550520, -46.633308, 'QR001', true),
  ('Estacionamento', -23.550720, -46.633508, 'QR002', true),
  ('Guarita', -23.550920, -46.633708, 'QR003', true),
  ('Sala de Segurança', -23.551120, -46.633908, 'QR004', true),
  ('Perímetro Externo', -23.551320, -46.634108, 'QR005', false)
ON CONFLICT DO NOTHING;

-- MENSAGEM DE SUCESSO
SELECT 'Banco de dados criado e dados iniciais inseridos com sucesso!' AS status;