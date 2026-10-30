/**
 * ============================================================
 * Servidor HTTP Principal: server.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * ============================================================
 */

const app = require('./app');
const productRepository = require('./models/ProductRepository');
const runSeed = require('../scripts/seed');

const PORT = process.env.PORT || 3000;

// Garante que haja dados de demonstração no banco
if (productRepository.count() === 0) {
  console.log('📌 Banco vazio detectado. Populando com dados iniciais de demonstração...');
  runSeed();
}

app.listen(PORT, () => {
  console.log('\n============================================================');
  console.log('🚀 SERVIDOR WEB MVC INICIADO COM SUCESSO!');
  console.log('============================================================');
  console.log(`📡 URL da Aplicação: http://localhost:${PORT}`);
  console.log(`📁 Catálogo de Produtos: http://localhost:${PORT}/produtos`);
  console.log(`➕ Cadastrar Produto:  http://localhost:${PORT}/produtos/novo`);
  console.log('------------------------------------------------------------');
  console.log('🏛️  ARQUITETURA MVC ATIVA:');
  console.log('   - Model:      Product.js / ProductRepository.js (SQLite)');
  console.log('   - Controller: ProductController.js (Express)');
  console.log('   - View:       Templates EJS (Bootstrap 5)');
  console.log('============================================================');
  console.log('Pressione CTRL+C para encerrar o servidor a qualquer momento.\n');
});
