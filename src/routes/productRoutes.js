/**
 * ============================================================
 * Módulo de Rotas HTTP: productRoutes.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: João André (Controller e View)
 * ============================================================
 * 
 * As rotas interceptam a URL e o verbo HTTP e encaminham
 * o fluxo diretamente para a ação correspondente do Controller.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Rota de listagem geral (View: index)
router.get('/', (req, res) => productController.index(req, res));

// Rota para formulário de cadastro (View: new)
router.get('/novo', (req, res) => productController.create(req, res));

// Rota de persistência do formulário de cadastro
router.post('/', (req, res) => productController.store(req, res));

// Rota de exibição detalhada de um produto (View: show)
router.get('/:id', (req, res) => productController.show(req, res));

// Rota para formulário de edição (View: edit)
router.get('/:id/editar', (req, res) => productController.edit(req, res));

// Rota de submissão da edição
router.post('/:id/editar', (req, res) => productController.update(req, res));

// Rota de exclusão
router.post('/:id/excluir', (req, res) => productController.destroy(req, res));

module.exports = router;
