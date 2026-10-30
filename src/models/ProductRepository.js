/**
 * ============================================================
 * Repositório de Persistência: ProductRepository (Model Layer)
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: André Luis (Model e Banco de Dados)
 * ============================================================
 * 
 * Este repositório faz parte da camada Model e encapsula toda a
 * lógica de persistência e comunicação com o banco SQLite.
 * 
 * Vantagens arquiteturais:
 * 1. Desacoplamento: A camada Controller chama métodos de alto nível
 *    (ex.: create, findAll) sem conhecer SQL.
 * 2. Segurança: Uso estrito de Prepared Statements prevenindo SQL Injection.
 * 3. Integridade: Toda inserção ou atualização valida as regras de negócio
 *    da entidade Product antes de gravar no banco.
 */

const { getDatabase } = require('../database/connection');
const Product = require('./Product');

class ProductRepository {
  constructor(customDb = null) {
    this._customDb = customDb;
  }

  /**
   * Obtém a instância ativa do banco de dados SQLite.
   * @private
   */
  get db() {
    return this._customDb || getDatabase();
  }

  /**
   * Cria e persiste um novo produto no banco de dados.
   * Executa a validação de regras de negócio antes da gravação.
   * 
   * @param {Object} productData Dados do produto a cadastrar
   * @returns {Product} Instância do produto recém-criado com ID gerado
   * @throws {Error} Caso os dados violem as regras de negócio do Model
   */
  create(productData) {
    const product = new Product(productData);
    
    // Validação estrita no Model antes da persistência
    product.assertValid();

    const stmt = this.db.prepare(`
      INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, categoria)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      product.nome,
      product.descricao,
      product.preco,
      product.quantidade_estoque,
      product.categoria
    );

    const insertedId = Number(result.lastInsertRowid);
    return this.findById(insertedId);
  }

  /**
   * Busca um produto pelo seu identificador primário.
   * 
   * @param {number|string} id Identificador do produto
   * @returns {Product|null} Instância do Produto ou null se não encontrado
   */
  findById(id) {
    const stmt = this.db.prepare('SELECT * FROM produtos WHERE id = ?');
    const row = stmt.get(Number(id));

    if (!row) {
      return null;
    }

    return new Product(row);
  }

  /**
   * Lista todos os produtos com suporte a busca textual, filtro de categoria e ordenação.
   * 
   * @param {Object} [options] Opções de consulta
   * @param {string} [options.search] Termo para busca em nome ou descrição
   * @param {string} [options.categoria] Filtro por categoria exata
   * @param {string} [options.sortBy='id'] Campo para ordenação ('id', 'nome', 'preco', 'quantidade_estoque')
   * @param {string} [options.order='ASC'] Direção ('ASC' ou 'DESC')
   * @returns {Product[]} Lista de entidades Product
   */
  findAll({ search = null, categoria = null, sortBy = 'id', order = 'ASC' } = {}) {
    // Whitelist de campos permitidos para ordenação para evitar SQL Injection
    const allowedSortFields = ['id', 'nome', 'preco', 'quantidade_estoque', 'categoria', 'criado_em'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];

    if (search && typeof search === 'string' && search.trim()) {
      conditions.push('(nome LIKE ? OR descricao LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (categoria && typeof categoria === 'string' && categoria.trim() && categoria.trim().toLowerCase() !== 'todas') {
      conditions.push('categoria = ?');
      params.push(categoria.trim());
    }

    let query = 'SELECT * FROM produtos';
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => new Product(row));
  }

  /**
   * Atualiza os dados de um produto existente.
   * Valida as regras de negócio com os dados atualizados antes de efetivar.
   * 
   * @param {number|string} id Identificador do produto a atualizar
   * @param {Object} productData Novos campos a atualizar
   * @returns {Product} Produto atualizado
   * @throws {Error} Caso o produto não exista ou viole regras de validação
   */
  update(id, productData) {
    const existing = this.findById(id);
    if (!existing) {
      const err = new Error(`Produto com ID ${id} não foi encontrado.`);
      err.name = 'NotFoundError';
      throw err;
    }

    // Mescla os dados atuais com as alterações recebidas
    const updatedEntity = new Product({
      id: existing.id,
      nome: productData.nome !== undefined ? productData.nome : existing.nome,
      descricao: productData.descricao !== undefined ? productData.descricao : existing.descricao,
      preco: productData.preco !== undefined ? productData.preco : existing.preco,
      quantidade_estoque: productData.quantidade_estoque !== undefined ? productData.quantidade_estoque : existing.quantidade_estoque,
      categoria: productData.categoria !== undefined ? productData.categoria : existing.categoria,
      criado_em: existing.criado_em
    });

    // Validação de regras no Model
    updatedEntity.assertValid();

    const stmt = this.db.prepare(`
      UPDATE produtos
      SET nome = ?,
          descricao = ?,
          preco = ?,
          quantidade_estoque = ?,
          categoria = ?,
          atualizado_em = datetime('now', 'localtime')
      WHERE id = ?
    `);

    stmt.run(
      updatedEntity.nome,
      updatedEntity.descricao,
      updatedEntity.preco,
      updatedEntity.quantidade_estoque,
      updatedEntity.categoria,
      existing.id
    );

    return this.findById(existing.id);
  }

  /**
   * Remove um produto do banco de dados por ID.
   * 
   * @param {number|string} id Identificador do produto
   * @returns {boolean} Retorna true se o produto foi removido com sucesso
   * @throws {Error} Dispara NotFoundError caso o produto não exista
   */
  delete(id) {
    const existing = this.findById(id);
    if (!existing) {
      const err = new Error(`Produto com ID ${id} não foi encontrado.`);
      err.name = 'NotFoundError';
      throw err;
    }

    const stmt = this.db.prepare('DELETE FROM produtos WHERE id = ?');
    const result = stmt.run(Number(id));

    return result.changes > 0;
  }

  /**
   * Retorna o total de produtos cadastrados no banco de dados.
   * @returns {number}
   */
  count() {
    const stmt = this.db.prepare('SELECT COUNT(*) as total FROM produtos');
    const row = stmt.get();
    return Number(row.total);
  }

  /**
   * Limpa todos os registros da tabela (utilizado para reiniciar testes e seeds).
   */
  clear() {
    this.db.exec('DELETE FROM produtos;');
    this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'produtos';");
  }
}

// Exporta instância única (padrão de projeto Singleton para o repositório)
const defaultRepository = new ProductRepository();
defaultRepository.ProductRepository = ProductRepository;

module.exports = defaultRepository;
