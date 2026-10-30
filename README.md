# PoC MVC - Cadastro e Gestão de Produtos

**Trabalho da Disciplina:** Análise e Projeto de Software  
**Tema:** Padrão Arquitetural MVC (Model-View-Controller)  
**Equipe:**
- André Luis: *Model, Banco de Dados e Documentação Técnica*
- João André: *Controller, View e Demonstração Prática*
- Eduardo De Melo, Luís Gustavo e Gustavo Martins: *Conceitos, Modelagem e Análise Crítica*

---

## 📂 Estrutura Completa do Projeto

```
poc-mvc-produtos/
├── package.json                   # Dependências (Express, EJS) e scripts
├── database.sqlite                # Banco relacional SQLite persistido
├── src/
│   ├── app.js                     # Configuração do Express e View Engine EJS
│   ├── server.js                  # Ponto de entrada que roda o servidor na porta 3000
│   ├── database/
│   │   ├── connection.js          # Conexão Singleton com node:sqlite
│   │   └── schema.sql             # DDL: Tabela produtos, índices e restrições
│   ├── models/
│   │   ├── Product.js             # Entidade de Domínio: regras e métodos de negócio
│   │   └── ProductRepository.js   # Repositório: Persistência com Prepared Statements
│   ├── controllers/
│   │   └── ProductController.js   # Orquestrador das requisições e fluxo de dados
│   ├── routes/
│   │   └── productRoutes.js       # Mapeamento RESTful de rotas para a Controller
│   └── views/
│       ├── layout/
│       │   ├── header.ejs         # Cabeçalho, navbar e representação do MVC
│       │   └── footer.ejs         # Rodapé e identificação da disciplina
│       └── products/
│           ├── index.ejs          # View: Catálogo geral, métricas e busca
│           ├── new.ejs            # View: Cadastro com feedback de validação
│           ├── edit.ejs           # View: Edição para demonstração prática
│           └── show.ejs           # View: Detalhes e confirmação de atualização
├── scripts/
│   ├── seed.js                    # Popula dados de teste no banco
│   ├── test-model.js              # Bateria de testes do Model (logs para prints)
│   └── test-demo-flow.js          # Teste E2E do fluxo Controller <-> View
└── docs/
    ├── relatorio_model_banco.md   # Relatório técnico do Model e Banco de Dados
    └── roteiro_demonstracao_pratica.md # Roteiro da apresentação oral e demo prática
```

---

## 🚀 Como Executar a Aplicação Web

### 1. Iniciar o Servidor Web
```powershell
npm start
# ou:
node src/server.js
```
Abra no navegador: **`http://localhost:3000`**

### 2. Rodar Teste Integrado de Controller e View
Valida automaticamente todas as rotas e confirma que a alteração de dados no Model é refletida na View:
```powershell
npm run test:demo
# ou:
node scripts/test-demo-flow.js
```

### 3. Rodar Testes de Unidade do Model
```powershell
npm run test:model
# ou:
node scripts/test-model.js
```

### 4. Recarregar Dados Iniciais (Seed)
```powershell
npm run seed
```

---

## 📑 Documentação e Entregáveis do Trabalho

- 📖 **Roteiro da Demonstração Prática:** [docs/roteiro_demonstracao_pratica.md](docs/roteiro_demonstracao_pratica.md)  
  *Guia passo a passo com falas, ações na tela e explicação de como demonstrar a sincronização dos dados para a banca/professor.*

- 📄 **Relatório Técnico do Model e Banco:** [docs/relatorio_model_banco.md](docs/relatorio_model_banco.md)  
  *DER em Mermaid, dicionário de dados, códigos comentados e transcrição de logs para prints.*
