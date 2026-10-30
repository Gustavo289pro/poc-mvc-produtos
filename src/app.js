/**
 * ============================================================
 * Configuração da Aplicação Express: app.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: João André (Controller e View)
 * ============================================================
 */

const express = require('express');
const path = require('node:path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Configura o motor de visualização (View Engine) EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para tratamento de formulários e requisições JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota raiz redireciona para a tela principal de produtos
app.get('/', (req, res) => {
  res.redirect('/produtos');
});

// Registra as rotas da camada Controller
app.use('/produtos', productRoutes);

// Tratamento de páginas não encontradas (404)
app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>404 - Página Não Encontrada</h1>
      <p>A rota solicitada não existe na aplicação MVC.</p>
      <a href="/produtos" style="color: #0d6efd; text-decoration: none; font-weight: bold;">Voltar para Produtos</a>
    </div>
  `);
});

module.exports = app;
