/**
 * ============================================================
 * Conexão com o Banco de Dados SQLite (node:sqlite)
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: André Luis (Model e Banco de Dados)
 * ============================================================
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

let dbInstance = null;

/**
 * Obtém ou inicializa a conexão com o banco SQLite.
 * Executa o schema DDL automaticamente se as tabelas ainda não existirem.
 * 
 * @param {string} [customPath] Caminho customizado para testes ou uso em memória
 * @returns {DatabaseSync} Instância ativa do banco de dados
 */
function getDatabase(customPath = null) {
  if (dbInstance && !customPath) {
    return dbInstance;
  }

  // Caminho padrão do arquivo de banco de dados
  const dbPath = customPath || path.resolve(__dirname, '../../database.sqlite');
  
  // Cria instância do SQLite
  const db = new DatabaseSync(dbPath);

  // Ativa configurações recomendadas de integridade e desempenho
  db.exec('PRAGMA foreign_keys = ON;');
  if (dbPath !== ':memory:') {
    db.exec('PRAGMA journal_mode = WAL;');
  }

  // Carrega e executa o script DDL (schema.sql)
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  if (!customPath) {
    dbInstance = db;
  }

  return db;
}

/**
 * Encerra a conexão ativa com o banco de dados.
 */
function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

module.exports = {
  getDatabase,
  closeDatabase
};
