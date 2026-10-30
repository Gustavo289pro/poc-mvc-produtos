/**
 * ============================================================
 * Entidade de Domínio: Product (Model)
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: André Luis (Model e Banco de Dados)
 * ============================================================
 * 
 * No padrão MVC, o Model é o coração da aplicação:
 * 1. Representa o estado e a estrutura do dado no domínio.
 * 2. Encapsula as regras de negócio e validações de integridade.
 * 3. É completamente desacoplado de Views e de protocolos HTTP.
 */

class Product {
  /**
   * Construtor da entidade Produto.
   * 
   * @param {Object} data Dados para inicialização
   * @param {number} [data.id] Identificador único (gerado pelo banco)
   * @param {string} data.nome Nome do produto
   * @param {string} [data.descricao] Descrição detalhada
   * @param {number} data.preco Preço unitário (deve ser > 0)
   * @param {number} [data.quantidade_estoque=0] Quantidade disponível (>= 0)
   * @param {string} [data.categoria='Geral'] Categoria do produto
   * @param {string} [data.criado_em] Data de cadastro
   * @param {string} [data.atualizado_em] Data da última alteração
   */
  constructor({
    id = null,
    nome = '',
    descricao = '',
    preco = 0,
    quantidade_estoque = 0,
    categoria = 'Geral',
    criado_em = null,
    atualizado_em = null
  } = {}) {
    this.id = id !== null ? Number(id) : null;
    this.nome = typeof nome === 'string' ? nome.trim() : '';
    this.descricao = typeof descricao === 'string' ? descricao.trim() : '';
    this.preco = Number(preco);
    this.quantidade_estoque = Number(quantidade_estoque);
    this.categoria = typeof categoria === 'string' && categoria.trim() ? categoria.trim() : 'Geral';
    this.criado_em = criado_em;
    this.atualizado_em = atualizado_em;
  }

  /**
   * Valida as regras de negócio da entidade Produto.
   * Regras implementadas:
   * - Nome: obrigatório e deve ter pelo menos 2 caracteres.
   * - Preço: obrigatório, numérico e estritamente positivo (> 0).
   * - Quantidade em Estoque: deve ser um número inteiro maior ou igual a zero (>= 0).
   * - Categoria: não pode ultrapassar 50 caracteres.
   * 
   * @returns {{ isValid: boolean, errors: string[] }} Resultado da validação
   */
  validate() {
    const errors = [];

    if (!this.nome || this.nome.length < 2) {
      errors.push('O nome do produto é obrigatório e deve ter no mínimo 2 caracteres.');
    }

    if (this.nome && this.nome.length > 100) {
      errors.push('O nome do produto não pode exceder 100 caracteres.');
    }

    if (isNaN(this.preco) || this.preco <= 0) {
      errors.push('O preço deve ser um valor numérico positivo maior que zero (R$ 0,00).');
    }

    if (isNaN(this.quantidade_estoque) || !Number.isInteger(this.quantidade_estoque) || this.quantidade_estoque < 0) {
      errors.push('A quantidade em estoque deve ser um número inteiro maior ou igual a zero.');
    }

    if (this.categoria && this.categoria.length > 50) {
      errors.push('A categoria não pode exceder 50 caracteres.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Garante a validade da entidade, disparando uma exceção caso haja violações.
   * @throws {Error} Dispara exceção com os detalhes dos erros de validação
   */
  assertValid() {
    const { isValid, errors } = this.validate();
    if (!isValid) {
      const error = new Error(`Falha de validação no Model: ${errors.join(' | ')}`);
      error.name = 'ValidationError';
      error.validationErrors = errors;
      throw error;
    }
  }

  /**
   * Regra de negócio: verifica se o produto possui itens disponíveis para venda.
   * @returns {boolean}
   */
  temEstoque() {
    return this.quantidade_estoque > 0;
  }

  /**
   * Regra de negócio: calcula o valor patrimonial total deste item no estoque.
   * @returns {number}
   */
  calcularValorTotalEstoque() {
    return Number((this.preco * this.quantidade_estoque).toFixed(2));
  }

  /**
   * Retorna o preço formatado em Real brasileiro (R$).
   * @returns {string} Ex: "R$ 1.499,90"
   */
  get precoFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.preco);
  }

  /**
   * Retorna o valor patrimonial total formatado em Real brasileiro (R$).
   * @returns {string}
   */
  get valorTotalEstoqueFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.calcularValorTotalEstoque());
  }

  /**
   * Retorna representação em objeto plano seguro para envio a Controllers/Views.
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      precoFormatado: this.precoFormatado,
      quantidade_estoque: this.quantidade_estoque,
      categoria: this.categoria,
      temEstoque: this.temEstoque(),
      valorTotalEstoque: this.calcularValorTotalEstoque(),
      valorTotalEstoqueFormatado: this.valorTotalEstoqueFormatado,
      criado_em: this.criado_em,
      atualizado_em: this.atualizado_em
    };
  }
}

module.exports = Product;
