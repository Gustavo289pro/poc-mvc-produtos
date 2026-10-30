/**
 * ============================================================
 * Camada Controller: ProductController.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: João André (Controller e View)
 * ============================================================
 * 
 * No padrão MVC, o Controller é o cérebro que orquestra a aplicação:
 * 1. Recebe as ações e requisições HTTP do usuário vindas da View.
 * 2. Invoca a camada Model para aplicar regras de negócio e persistência.
 * 3. Repassa os dados resultantes para serem renderizados na View adequada.
 * 4. NUNCA executa SQL diretamente, delegando tudo ao Repositório do Model.
 */

const productRepository = require('../models/ProductRepository');

class ProductController {
  /**
   * [GET /produtos]
   * Lista todos os produtos no catálogo da View com suporte a filtros e ordenação.
   */
  async index(req, res) {
    try {
      const { search = '', categoria = '', sortBy = 'id', order = 'ASC', msg, error } = req.query;

      // Chama a camada Model para consultar os dados
      const produtos = productRepository.findAll({
        search,
        categoria,
        sortBy,
        order
      });

      // Cálculo de métricas gerais delegadas à camada Model
      const totalProdutos = productRepository.count();
      const valorTotalGeral = produtos.reduce((acc, p) => acc + p.calcularValorTotalEstoque(), 0);
      const valorTotalFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valorTotalGeral);

      // Renderiza a View index.ejs passando os dados do Model
      res.render('products/index', {
        produtos,
        totalProdutos,
        valorTotalFormatado,
        search,
        categoria,
        sortBy,
        order,
        msg: msg || null,
        error: error || null
      });
    } catch (err) {
      res.status(500).render('products/index', {
        produtos: [],
        totalProdutos: 0,
        valorTotalFormatado: 'R$ 0,00',
        search: '',
        categoria: '',
        sortBy: 'id',
        order: 'ASC',
        msg: null,
        error: 'Erro no Controller ao carregar produtos: ' + err.message
      });
    }
  }

  /**
   * [GET /produtos/novo]
   * Exibe o formulário de cadastro de um novo produto.
   */
  async create(req, res) {
    res.render('products/new', {
      produto: {},
      errors: [],
      error: null
    });
  }

  /**
   * [POST /produtos]
   * Processa os dados do formulário e aciona o Model para criar o produto.
   */
  async store(req, res) {
    const { nome, descricao, preco, quantidade_estoque, categoria } = req.body;

    try {
      // O Controller aciona a validação e persistência do Model
      const novoProduto = productRepository.create({
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade_estoque: parseInt(quantidade_estoque, 10),
        categoria
      });

      // Redireciona para a lista com mensagem de sucesso
      res.redirect(`/produtos?msg=Produto "${novoProduto.nome}" cadastrado com sucesso no Model!`);
    } catch (err) {
      // Captura validações disparadas pelo Model e devolve para a View exibir
      const errors = err.validationErrors || [err.message];
      res.status(422).render('products/new', {
        produto: req.body,
        errors,
        error: 'O Model recusou os dados informados devido a regras de negócio.'
      });
    }
  }

  /**
   * [GET /produtos/:id]
   * Exibe a página de detalhes de um produto específico.
   */
  async show(req, res) {
    const { id } = req.params;
    const { msg } = req.query;

    try {
      const produto = productRepository.findById(id);
      if (!produto) {
        return res.redirect('/produtos?error=Produto não encontrado.');
      }

      res.render('products/show', {
        produto,
        msg: msg || null,
        error: null
      });
    } catch (err) {
      res.redirect('/produtos?error=' + encodeURIComponent(err.message));
    }
  }

  /**
   * [GET /produtos/:id/editar]
   * Exibe o formulário de edição com os dados atuais do produto preenchidos.
   */
  async edit(req, res) {
    const { id } = req.params;

    try {
      const produto = productRepository.findById(id);
      if (!produto) {
        return res.redirect('/produtos?error=Produto não encontrado para edição.');
      }

      res.render('products/edit', {
        produto,
        errors: [],
        error: null
      });
    } catch (err) {
      res.redirect('/produtos?error=' + encodeURIComponent(err.message));
    }
  }

  /**
   * [POST /produtos/:id/editar]
   * Processa as alterações solicitadas e as reflete no Model e na View.
   */
  async update(req, res) {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade_estoque, categoria } = req.body;

    try {
      // O Controller delega a atualização ao Model
      const produtoAtualizado = productRepository.update(id, {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade_estoque: parseInt(quantidade_estoque, 10),
        categoria
      });

      // Redireciona para a tela de detalhes demonstrando a alteração refletida na View
      res.redirect(
        `/produtos/${produtoAtualizado.id}?msg=Alterações salvas com sucesso no Model e refletidas nesta View!`
      );
    } catch (err) {
      const errors = err.validationErrors || [err.message];
      res.status(422).render('products/edit', {
        produto: { ...req.body, id },
        errors,
        error: 'Não foi possível atualizar o produto. Corrija os erros apontados pelo Model.'
      });
    }
  }

  /**
   * [POST /produtos/:id/excluir]
   * Processa a remoção do produto no banco via Model.
   */
  async destroy(req, res) {
    const { id } = req.params;

    try {
      const produto = productRepository.findById(id);
      const nomeRemovido = produto ? produto.nome : `ID ${id}`;

      productRepository.delete(id);
      res.redirect(`/produtos?msg=Produto "${nomeRemovido}" excluído com sucesso do banco de dados!`);
    } catch (err) {
      res.redirect('/produtos?error=' + encodeURIComponent(err.message));
    }
  }
}

module.exports = new ProductController();
