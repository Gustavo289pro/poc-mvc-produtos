/**
 * ============================================================
 * Script de Carga Inicial (Seed): seed.js
 * Trabalho: Padrão Arquitetural MVC - Análise e Projeto de Software
 * Responsável: André Luis (Model e Banco de Dados)
 * ============================================================
 */

const productRepository = require('../src/models/ProductRepository');

const initialProducts = [
  {
    nome: 'Notebook Dell Inspiron 15',
    descricao: 'Processador Intel Core i7 13ª geração, 16GB RAM, SSD 512GB NVMe, tela 15.6" FHD.',
    preco: 4299.00,
    quantidade_estoque: 12,
    categoria: 'Eletrônicos'
  },
  {
    nome: 'Mouse Sem Fio Logitech MX Master 3S',
    descricao: 'Sensor óptico de 8000 DPI, rolagem silenciosa MagSpeed e conexão Bluetooth/Logi Bolt.',
    preco: 689.90,
    quantidade_estoque: 25,
    categoria: 'Periféricos'
  },
  {
    nome: 'Teclado Mecânico Keychron K2 Wireless',
    descricao: 'Layout 75%, switches Gateron Brown hot-swappable e iluminação RGB com Bluetooth 5.1.',
    preco: 749.50,
    quantidade_estoque: 8,
    categoria: 'Periféricos'
  },
  {
    nome: 'Monitor Dell 27" 4K UHD UltraSharp',
    descricao: 'Painel IPS com 99% sRGB, conectividade USB-C com fornecimento de energia de 90W.',
    preco: 2899.00,
    quantidade_estoque: 5,
    categoria: 'Monitores'
  },
  {
    nome: 'Headset Gamer HyperX Cloud II Red',
    descricao: 'Som surround 7.1 virtual, drivers de 53 mm e almofadas em couro sintético viscoelástico.',
    preco: 549.90,
    quantidade_estoque: 18,
    categoria: 'Áudio'
  },
  {
    nome: 'Cadeira Ergonômica de Escritório',
    descricao: 'Apoio lombar ajustável 2D, encosto em malha mesh respirável e mecanismo relax.',
    preco: 1290.00,
    quantidade_estoque: 4,
    categoria: 'Mobiliário'
  }
];

function runSeed() {
  console.log('============================================================');
  console.log('🌱 INICIANDO CARGA DE DADOS DE TESTE (SEED) NO BANCO');
  console.log('============================================================\n');

  console.log('1. Limpando tabela de produtos para reinicialização...');
  productRepository.clear();

  console.log('2. Inserindo produtos iniciais através do Model...\n');

  initialProducts.forEach((item, index) => {
    const created = productRepository.create(item);
    console.log(`   [OK] Item ${index + 1}: ID ${created.id} | "${created.nome}" | ${created.precoFormatado} | Estoque: ${created.quantidade_estoque} un.`);
  });

  const total = productRepository.count();
  console.log(`\n============================================================`);
  console.log(`✅ SEED CONCLUÍDO COM SUCESSO! Total de produtos cadastrados: ${total}`);
  console.log(`============================================================\n`);
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
