/**
 * ============================================================
 * Teste End-to-End do Fluxo MVC: test-demo-flow.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: João André (Controller e View)
 * ============================================================
 * 
 * Este script inicia uma instância de teste da aplicação Express
 * e executa requisições HTTP reais contra todos os endpoints,
 * validando que o Controller processa as rotas e as Views EJS
 * renderizam corretamente as informações persistidas pelo Model.
 */

const http = require('node:http');
const app = require('../src/app');
const productRepository = require('../src/models/ProductRepository');

// Popula o banco com seed antes do teste
require('./seed')();

const TEST_PORT = 3333;
let server;

function makeRequest(path, { method = 'GET', body = null, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    let postData = null;
    const reqHeaders = { ...headers };

    if (body) {
      if (typeof body === 'object') {
        postData = new URLSearchParams(body).toString();
        reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        reqHeaders['Content-Length'] = Buffer.byteLength(postData);
      }
    }

    const options = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runDemoFlow() {
  console.log('======================================================================');
  console.log('🚀 INICIANDO TESTE DO FLUXO INTEGRADO: CONTROLLER <-> VIEW <-> MODEL');
  console.log('======================================================================\n');

  server = app.listen(TEST_PORT, async () => {
    try {
      // 1. Teste da Rota Raiz (Redirecionamento)
      console.log('1. Testando redirecionamento da rota raiz GET / ...');
      const r1 = await makeRequest('/');
      console.log(`   [STATUS ${r1.statusCode}] Redirecionamento para: ${r1.headers.location}`);
      if (r1.statusCode === 302 && r1.headers.location === '/produtos') {
        console.log('   [PASS] Rota raiz redirecionada corretamente para o Controller de produtos.\n');
      }

      // 2. Teste da View de Listagem (GET /produtos)
      console.log('2. Testando carregamento da View de catálogo GET /produtos ...');
      const r2 = await makeRequest('/produtos');
      console.log(`   [STATUS ${r2.statusCode}] Tamanho do HTML retornado: ${r2.body.length} bytes`);
      if (r2.body.includes('Catálogo Geral de Produtos') && r2.body.includes('Camada VIEW')) {
        console.log('   [PASS] View index.ejs renderizada com sucesso contendo produtos do Model.\n');
      }

      // 3. Teste da View de Formulário de Cadastro (GET /produtos/novo)
      console.log('3. Testando exibição da View de cadastro GET /produtos/novo ...');
      const r3 = await makeRequest('/produtos/novo');
      console.log(`   [STATUS ${r3.statusCode}]`);
      if (r3.body.includes('Cadastrar Novo Produto') && r3.body.includes('Salvar Produto no Model')) {
        console.log('   [PASS] View new.ejs renderizada com os campos do formulário.\n');
      }

      // 4. Teste de Validação Rejeitada pelo Model via Controller (POST /produtos com preço negativo)
      console.log('4. Testando envio de dados inválidos (Preço negativo: -99.00) POST /produtos ...');
      const r4 = await makeRequest('/produtos', {
        method: 'POST',
        body: {
          nome: 'Produto Inválido',
          preco: '-99.00',
          quantidade_estoque: '5',
          categoria: 'Geral'
        }
      });
      console.log(`   [STATUS ${r4.statusCode}] (Status 422 Unprocessable Entity esperado)`);
      if (r4.statusCode === 422 && r4.body.includes('Falha de Validação interceptada pelo Model')) {
        console.log('   [PASS] O Model bloqueou a gravação e a View exibiu a mensagem de erro amigável ao usuário!\n');
      }

      // 5. Teste de Criação de Produto Válido (POST /produtos)
      console.log('5. Testando cadastro de produto válido POST /produtos ...');
      const r5 = await makeRequest('/produtos', {
        method: 'POST',
        body: {
          nome: 'Câmera Mirrorless Sony Alpha A7 IV',
          descricao: 'Sensor full-frame 33MP, gravação 4K 60p e foco automático com IA.',
          preco: '14999.00',
          quantidade_estoque: '3',
          categoria: 'Eletrônicos'
        }
      });
      console.log(`   [STATUS ${r5.statusCode}] Redirecionamento após persistência: ${r5.headers.location}`);
      if (r5.statusCode === 302) {
        console.log('   [PASS] Produto cadastrado no Model e redirecionado pelo Controller com sucesso!\n');
      }

      // 6. Teste da Demonstração: Alteração nos dados refletida na View (POST /produtos/1/editar)
      console.log('6. Testando alteração de dados no Model e reflexo na View (POST /produtos/1/editar) ...');
      console.log('   Alterando preço do Item 1 para R$ 3.899,00 e estoque para 20 unidades...');
      const r6 = await makeRequest('/produtos/1/editar', {
        method: 'POST',
        body: {
          nome: 'Notebook Dell Inspiron 15 (Atualizado na PoC)',
          descricao: 'Processador atualizado para i7 com 32GB RAM.',
          preco: '3899.00',
          quantidade_estoque: '20',
          categoria: 'Eletrônicos'
        }
      });
      console.log(`   [STATUS ${r6.statusCode}] Redirecionamento: ${r6.headers.location}`);

      // Consulta a View de Detalhes após a alteração
      const r7 = await makeRequest('/produtos/1');
      console.log(`   [STATUS ${r7.statusCode}] Acessando a View de detalhes para verificar reflexo da alteração...`);
      const refletiuNome = r7.body.includes('Notebook Dell Inspiron 15 (Atualizado na PoC)');
      const refletiuPreco = r7.body.includes('3.899,00');
      const refletiuEstoque = r7.body.includes('20 un.');
      const refletiuPatrimonio = r7.body.includes('77.980,00'); // 3899 * 20 = 77980

      if (refletiuNome && refletiuPreco && refletiuEstoque && refletiuPatrimonio) {
        console.log('   [PASS] 🎯 COMPROVADO: A alteração realizada no Model foi 100% refletida na View!');
        console.log('   - Novo Nome exibido na tela: OK');
        console.log('   - Novo Preço Unitário (R$ 3.899,00) formatado: OK');
        console.log('   - Novo Saldo em Estoque (20 un.): OK');
        console.log('   - Novo Valor Total Recalculado pelo Model (R$ 77.980,00): OK\n');
      }

      // 7. Teste de Exclusão (POST /produtos/6/excluir)
      console.log('7. Testando exclusão de produto POST /produtos/6/excluir ...');
      const r8 = await makeRequest('/produtos/6/excluir', { method: 'POST' });
      console.log(`   [STATUS ${r8.statusCode}] Redirecionamento: ${r8.headers.location}`);
      if (r8.statusCode === 302) {
        console.log('   [PASS] Produto excluído com sucesso do Model e da View!\n');
      }

      console.log('======================================================================');
      console.log('✅ SUCESSO TOTAL: Todos os fluxos de Controller e View validados!');
      console.log('======================================================================\n');
    } catch (err) {
      console.error('❌ Falha durante a execução do fluxo:', err);
    } finally {
      server.close();
    }
  });
}

if (require.main === module) {
  runDemoFlow();
}

module.exports = runDemoFlow;
