/**
 * ============================================================
 * Exemplo de Integração: ProductController.example.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Destinado ao integrante: João André (Controller e View)
 * ============================================================
 * 
 * Este arquivo demonstra como a camada Controller interage diretamente
 * com a camada Model (ProductRepository e Product) para atender
 * às requisições do usuário e repassar os dados tratados para as Views.
 */

const productRepository = require('../models/ProductRepository');

class ProductController {
  /**
   * Lista todos os produtos para exibição na View de catálogo/tabela.
   * Suporta filtros opcionais via query parameters.
   */
  async index(req, res) {
    try {
      const { search, categoria, sortBy, order } = req.query || {};
      const produtos = productRepository.findAll({ search, categoria, sortBy, order });

      // No padrão MVC, o Controller envia os dados do Model para a View
      // Exemplo em Express/EJS: res.render('produtos/index', { produtos });
      return { status: 200, data: produtos.map(p => p.toJSON()) };
    } catch (error) {
      return { status: 500, error: 'Erro ao listar produtos: ' + error.message };
    }
  }

  /**
   * Exibe os detalhes de um produto específico na View.
   */
  async show(req, res) {
    try {
      const id = req.params.id;
      const produto = productRepository.findById(id);

      if (!produto) {
        return { status: 404, error: 'Produto não encontrado.' };
      }

      return { status: 200, data: produto.toJSON() };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }

  /**
   * Processa o formulário de cadastro enviado pela View.
   */
  async store(req, res) {
    try {
      const { nome, descricao, preco, quantidade_estoque, categoria } = req.body;
      
      // O Controller delega a persistência e validação para o Model
      const novoProduto = productRepository.create({
        nome,
        descricao,
        preco,
        quantidade_estoque,
        categoria
      });

      // Redireciona ou retorna resposta de sucesso
      return { status: 201, message: 'Produto cadastrado com sucesso!', data: novoProduto.toJSON() };
    } catch (error) {
      // Captura erros de validação disparados pelo Model e retorna para a View exibir
      if (error.name === 'ValidationError') {
        return { status: 400, errors: error.validationErrors };
      }
      return { status: 500, error: error.message };
    }
  }

  /**
   * Processa a atualização de um produto existente.
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const dadosAtualizados = req.body;

      const produto = productRepository.update(id, dadosAtualizados);
      return { status: 200, message: 'Produto atualizado com sucesso!', data: produto.toJSON() };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return { status: 400, errors: error.validationErrors };
      }
      if (error.name === 'NotFoundError') {
        return { status: 404, error: error.message };
      }
      return { status: 500, error: error.message };
    }
  }

  /**
   * Processa a exclusão de um produto.
   */
  async destroy(req, res) {
    try {
      const id = req.params.id;
      productRepository.delete(id);
      return { status: 200, message: 'Produto excluído com sucesso!' };
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return { status: 404, error: error.message };
      }
      return { status: 500, error: error.message };
    }
  }
}

module.exports = new ProductController();
