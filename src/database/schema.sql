-- ============================================================
-- SCRIPT DDL: Criação da Tabela de Produtos e Índices
-- Trabalho: Padrão Arquitetural MVC - Disciplina Análise e Projeto de Software
-- Responsável: André Luis (Model e Banco de Dados)
-- ============================================================

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL CHECK (preco >= 0),
    quantidade_estoque INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
    categoria TEXT NOT NULL DEFAULT 'Geral',
    criado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    atualizado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Índices para otimização de consultas e ordenações
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos (nome);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos (categoria);
