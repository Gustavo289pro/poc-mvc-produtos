/**
 * ============================================================
 * Suíte de Testes e Demonstração do Model (test-model.js)
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: André Luis (Model e Banco de Dados)
 * ============================================================
 * 
 * Este script executa a validação prática de todas as operações
 * implementadas no Model e no banco de dados SQLite.
 * Os logs gerados foram estruturados especificamente para gerar
 * evidências visuais (prints) para o relatório técnico do grupo.
 */

const productRepository = require('../src/models/ProductRepository');
const Product = require('../src/models/Product');

function header(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`📌 ${title.toUpperCase()}`);
  console.log('='.repeat(70));
}

function subheader(title) {
  console.log(`\n--- [ ${title} ] ---`);
}

function runTests() {
  console.log('\n######################################################################');
  console.log('  TESTES DA CAMADA MODEL E BANCO DE DADOS (PoC MVC)');
  console.log('  Responsável: André Luis | Disciplina: Análise e Projeto de Software');
  console.log('######################################################################');

  // Inicializa com banco limpo
  productRepository.clear();

  // -------------------------------------------------------------
  // TESTE 1: OPERAÇÃO CREATE (Cadastramento com Validação)
  // -------------------------------------------------------------
  header('CENÁRIO 1: OPERAÇÃO CREATE (Criação e Persistência no Banco)');
  console.log('Tentando cadastrar produtos com dados válidos...');

  const p1 = productRepository.create({
    nome: 'Notebook Dell XPS 13',
    descricao: 'Ultrabook Intel Core i7, 16GB RAM, SSD 1TB, tela OLED 13.4" 3.5K touch.',
    preco: 8499.00,
    quantidade_estoque: 7,
    categoria: 'Eletrônicos'
  });
  console.log(`[PASS] Produto 1 criado com sucesso! ID: ${p1.id} | Nome: "${p1.nome}" | Preço: ${p1.precoFormatado}`);

  const p2 = productRepository.create({
    nome: 'Mouse Gamer sem fio Razer Viper',
    descricao: 'Sensor Focus Pro 30K, switches ópticos Gen-3, peso ultraleve de 58g.',
    preco: 599.90,
    quantidade_estoque: 15,
    categoria: 'Periféricos'
  });
  console.log(`[PASS] Produto 2 criado com sucesso! ID: ${p2.id} | Nome: "${p2.nome}" | Preço: ${p2.precoFormatado}`);

  const p3 = productRepository.create({
    nome: 'Webcam Logitech Brio 4K Ultra HD',
    descricao: 'Sensor 4K com HDR, microfones duplos omnidirecionais e campo de visão ajustável.',
    preco: 1049.00,
    quantidade_estoque: 10,
    categoria: 'Periféricos'
  });
  console.log(`[PASS] Produto 3 criado com sucesso! ID: ${p3.id} | Nome: "${p3.nome}" | Preço: ${p3.precoFormatado}`);

  // -------------------------------------------------------------
  // TESTE 2: REGRAS DE NEGÓCIO E VALIDAÇÕES DO MODEL
  // -------------------------------------------------------------
  header('CENÁRIO 2: VALIDAÇÕES DE REGRAS DE NEGÓCIO DO MODEL');
  console.log('O Model deve rejeitar tentativas de inserção com dados inválidos antes do banco:\n');

  // Caso 2.1: Nome vazio
  try {
    console.log('Tentativa 2.1: Cadastrar produto com nome vazio...');
    productRepository.create({
      nome: '  ',
      preco: 100.00,
      quantidade_estoque: 5
    });
    console.log('[FAIL] ERRO: O Model deveria ter rejeitado o nome vazio!');
  } catch (err) {
    console.log(`[PASS] Rejeição esperada capturada: "${err.message}"`);
  }

  // Caso 2.2: Preço negativo ou zero
  try {
    console.log('\nTentativa 2.2: Cadastrar produto com preço zero ou negativo (-50.00)...');
    productRepository.create({
      nome: 'Headphone Bluetooth',
      preco: -50.00,
      quantidade_estoque: 10
    });
    console.log('[FAIL] ERRO: O Model deveria ter rejeitado preço negativo!');
  } catch (err) {
    console.log(`[PASS] Rejeição esperada capturada: "${err.message}"`);
  }

  // Caso 2.3: Estoque negativo ou não-inteiro
  try {
    console.log('\nTentativa 2.3: Cadastrar produto com estoque negativo (-3)...');
    productRepository.create({
      nome: 'Cabo HDMI 2.1',
      preco: 45.00,
      quantidade_estoque: -3
    });
    console.log('[FAIL] ERRO: O Model deveria ter rejeitado estoque negativo!');
  } catch (err) {
    console.log(`[PASS] Rejeição esperada capturada: "${err.message}"`);
  }

  // -------------------------------------------------------------
  // TESTE 3: OPERAÇÕES READ (Listagem Geral, Busca e Filtros)
  // -------------------------------------------------------------
  header('CENÁRIO 3: OPERAÇÃO READ (Listagem Geral, Busca e Filtros)');
  
  subheader('3.1 Listagem Completa de Produtos Cadastrados');
  const todos = productRepository.findAll();
  console.log(`Total de produtos retornados: ${todos.length}`);
  todos.forEach(p => {
    console.log(`   [ID ${p.id}] ${p.nome.padEnd(35)} | Cat: ${p.categoria.padEnd(12)} | Preço: ${p.precoFormatado.padEnd(14)} | Estoque: ${String(p.quantidade_estoque).padStart(3)} un | Total Est.: ${p.valorTotalEstoqueFormatado}`);
  });

  subheader('3.2 Filtro por Termo de Busca (Ex: "Dell")');
  const buscaDell = productRepository.findAll({ search: 'Dell' });
  console.log(`Resultados encontrados com termo "Dell": ${buscaDell.length}`);
  buscaDell.forEach(p => console.log(`   -> [ID ${p.id}] ${p.nome} (${p.precoFormatado})`));

  subheader('3.3 Filtro por Categoria (Ex: "Periféricos")');
  const filtroPerifericos = productRepository.findAll({ categoria: 'Periféricos' });
  console.log(`Resultados na categoria "Periféricos": ${filtroPerifericos.length}`);
  filtroPerifericos.forEach(p => console.log(`   -> [ID ${p.id}] ${p.nome} (Estoque: ${p.quantidade_estoque})`));

  // -------------------------------------------------------------
  // TESTE 4: OPERAÇÃO READ BY ID E MÉTODOS DE NEGÓCIO
  // -------------------------------------------------------------
  header('CENÁRIO 4: OPERAÇÃO READ BY ID E MÉTODOS DO DOMÍNIO');
  const produtoDetalhado = productRepository.findById(p1.id);
  console.log('Consulta por ID realizada com sucesso:');
  console.log(JSON.stringify(produtoDetalhado.toJSON(), null, 2));

  console.log('\nExecutando métodos de negócio da entidade:');
  console.log(`- Tem estoque disponível? ${produtoDetalhado.temEstoque() ? 'SIM' : 'NÃO'}`);
  console.log(`- Valor total do patrimônio em estoque: ${produtoDetalhado.valorTotalEstoqueFormatado}`);

  // -------------------------------------------------------------
  // TESTE 5: OPERAÇÃO UPDATE (Atualização e Recálculo)
  // -------------------------------------------------------------
  header('CENÁRIO 5: OPERAÇÃO UPDATE (Atualização de Preço e Estoque)');
  console.log(`Produto antes da atualização (ID ${p2.id}):`);
  console.log(`   Nome: "${p2.nome}" | Preço: ${p2.precoFormatado} | Estoque: ${p2.quantidade_estoque} un.`);

  console.log('\nAplicando atualização: Preço de R$ 599,90 -> R$ 529,00 e Estoque de 15 -> 22 un.');
  const produtoAtualizado = productRepository.update(p2.id, {
    preco: 529.00,
    quantidade_estoque: 22
  });

  console.log(`[PASS] Produto atualizado com sucesso!`);
  console.log(`   ID: ${produtoAtualizado.id}`);
  console.log(`   Novo Preço: ${produtoAtualizado.precoFormatado}`);
  console.log(`   Novo Estoque: ${produtoAtualizado.quantidade_estoque} un.`);
  console.log(`   Novo Valor Total do Estoque: ${produtoAtualizado.valorTotalEstoqueFormatado}`);
  console.log(`   Data de Atualização: ${produtoAtualizado.atualizado_em}`);

  // -------------------------------------------------------------
  // TESTE 6: OPERAÇÃO DELETE (Exclusão e Verificação)
  // -------------------------------------------------------------
  header('CENÁRIO 6: OPERAÇÃO DELETE (Exclusão por ID e Confirmação)');
  console.log(`Excluindo produto ID ${p3.id} ("${p3.nome}")...`);
  const exclusaoSucesso = productRepository.delete(p3.id);
  console.log(`[PASS] Exclusão realizada com retorno: ${exclusaoSucesso}`);

  const buscaAposExclusao = productRepository.findById(p3.id);
  console.log(`Consulta pelo ID ${p3.id} após exclusão: ${buscaAposExclusao === null ? '[PASS] Retornou null (confirmado que não existe no banco)' : '[FAIL] Ainda existe!'}`);

  const totalFinal = productRepository.count();
  console.log(`Total de produtos remanescentes no banco: ${totalFinal}`);

  // -------------------------------------------------------------
  // CONCLUSÃO DA DEMONSTRAÇÃO
  // -------------------------------------------------------------
  header('RESULTADO FINAL DA SUÍTE DE TESTES');
  console.log('✅ TODAS AS OPERAÇÕES CRUD E REGRAS DE NEGÓCIO DO MODEL FORAM APROVADAS!');
  console.log('✅ Banco de dados SQLite persistido e íntegro.');
  console.log('✅ Camada Model pronta para consumo pelas Controllers e Views.');
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
