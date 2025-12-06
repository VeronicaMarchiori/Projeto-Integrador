
-- DADOS INICIAIS 

-- Limpar dados existentes 
-- TRUNCATE TABLE LogAcesso, Mensagem, Ocorrencia, realizaPercurso, Percurso, 
-- TemPontosRondas, PontoRonda, Ronda, Empresa, Vigia, Administrador, Usuario RESTART IDENTITY CASCADE;

-- ============================================
-- USUÁRIOS BASE

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

-- ============================================
-- EMPRESA EXEMPLO

INSERT INTO Empresa (nome, cnpj, endereco, telefone, email)
VALUES (
  'Empresa Exemplo LTDA',
  '00.000.000/0001-00',
  'Rua Exemplo, 123 - Centro, São Paulo - SP',
  '(11) 3333-3333',
  'contato@empresa.com'
) ON CONFLICT (cnpj) DO NOTHING;

-- ============================================
-- PONTOS DE RONDA EXEMPLO

INSERT INTO PontoRonda (descricao, latitude, longitude, qrcode, obrigatorio)
VALUES 
  ('Portaria Principal', -23.550520, -46.633308, 'QR001', true),
  ('Estacionamento', -23.550720, -46.633508, 'QR002', true),
  ('Guarita', -23.550920, -46.633708, 'QR003', true),
  ('Sala de Segurança', -23.551120, -46.633908, 'QR004', true),
  ('Perímetro Externo', -23.551320, -46.634108, 'QR005', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- MENSAGEM DE SUCESSO

SELECT 'Dados iniciais inseridos com sucesso!' AS status;