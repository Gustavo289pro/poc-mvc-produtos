# ROTEIRO DE DEMONSTRAÇÃO PRÁTICA: CONTROLLER, VIEW E O PADRÃO MVC
**Disciplina:** Análise e Projeto de Software  
**Tema 2:** Padrão Arquitetural MVC (Model-View-Controller)  
**Responsável pelo Módulo:** João André (Controller, View e Demonstração da PoC)  
**Módulo Integrado:** Model e Banco de Dados (André Luis)  
**Aplicação:** Sistema de Cadastro e Gestão de Produtos  
**Data da Entrega:** 23 de outubro de 2026  

---

## 1. OBJETIVO DA DEMONSTRAÇÃO PRÁTICA

Este documento fornece um guia passo a passo estruturado para a **apresentação oral e demonstração ao vivo** da Prova de Conceito (PoC). O objetivo central exigido pelo cronograma acadêmico é:

> *"Demonstrar na aplicação que uma alteração nos dados no Model é refletida na View por intermédio do Controller, evidenciando o desacoplamento e a responsabilidade de cada camada."*

---

## 2. PREPARAÇÃO DO AMBIENTE (COMO INICIAR A APLICAÇÃO)

### Passo 1: Abrir o terminal no diretório do projeto
```powershell
cd C:\Users\andre.alves\Documents\poc-mvc-produtos
```

### Passo 2: (Opcional) Reinicializar o banco com os dados limpos de demonstração
```powershell
npm run seed
```

### Passo 3: Iniciar o servidor HTTP da aplicação MVC
```powershell
npm start
# ou:
node src/server.js
```
O console exibirá o banner confirmando a inicialização:
```text
============================================================
🚀 SERVIDOR WEB MVC INICIADO COM SUCESSO!
============================================================
📡 URL da Aplicação: http://localhost:3000
📁 Catálogo de Produtos: http://localhost:3000/produtos
➕ Cadastrar Produto:  http://localhost:3000/produtos/novo
------------------------------------------------------------
🏛️  ARQUITETURA MVC ATIVA:
   - Model:      Product.js / ProductRepository.js (SQLite)
   - Controller: ProductController.js (Express)
   - View:       Templates EJS (Bootstrap 5)
============================================================
```

### Passo 4: Abrir o navegador
Acesse no navegador: **`http://localhost:3000`** (redireciona automaticamente para `/produtos`).

---

## 3. ROTEIRO PASSO A PASSO DA APRESENTAÇÃO AO VIVO

### CENÁRIO 1: Visão Geral da Interface e Arquitetura MVC
- **Ação na tela:** Exibir a página inicial do catálogo (`http://localhost:3000/produtos`).
- **O que explicar para o professor / banca:**
  > *"Aqui temos a camada **View** (construída em EJS com estilização em Bootstrap 5). Os dados que vocês estão vendo nesta tabela não foram consultados pela tela. Quando acessamos a URL `/produtos`, a requisição foi capturada pelo arquivo de rotas, que acionou o **Controller** (`ProductController.index`). O Controller solicitou os registros à camada **Model** (`ProductRepository.findAll`), que por sua vez consultou o SQLite de forma segura. Em seguida, o Controller entregou os objetos de domínio prontos para a View renderizar."*
- **Pontos visuais a destacar:**
  - O card de métricas no topo mostrando o cálculo do **Valor Total em Estoque**;
  - As badges coloridas de disponibilidade de estoque (calculadas pelo método `temEstoque()` do Model);
  - A barra superior didática que mapeia o fluxo *Model <---> Controller <---> View*.

---

### CENÁRIO 2: Cadastro de Novo Produto (Fluxo View -> Controller -> Model -> View)
- **Ação na tela:**
  1. Clicar no botão verde **"+ Novo"** ou no menu **"Cadastrar Produto"**.
  2. Preencher o formulário:
     - **Nome:** `Smart TV 55" 4K UHD`
     - **Categoria:** `Eletrônicos`
     - **Preço Unitário:** `2599.00`
     - **Quantidade em Estoque:** `8`
     - **Descrição:** `Painel Crystal 4K, HDR, comando de voz e design sem bordas.`
  3. Clicar em **"Salvar Produto no Model"**.
- **O que explicar para a banca:**
  > *"Ao enviar o formulário, a **View** dispara um `POST /produtos`. O **Controller** (`ProductController.store`) recebe os dados, instancia a entidade do **Model** (`Product`), valida todas as regras de negócio e aciona o repositório para salvar no banco SQLite com Prepared Statements. Após a gravação, o Controller redireciona de volta para a View de listagem com uma mensagem de confirmação."*
- **Resultado esperado na tela:**
  - Alerta verde de sucesso: *"Produto 'Smart TV 55" 4K UHD' cadastrado com sucesso no Model!"*;
  - A TV aparece imediatamente na tabela;
  - O contador total de produtos aumenta de 6 para 7;
  - O valor total do patrimônio no topo é recalculado automaticamente pelo Model e refletido na View.

---

### CENÁRIO 3 (O PONTO CENTRAL): Evidência de que a Alteração no Model é Refletida na View
- **Ação na tela:**
  1. Na linha do produto **"Notebook Dell Inspiron 15"** (ID 1), clicar no botão amarelo **"Editar"** (ícone de lápis).
  2. Apresentar os dados atuais:
     - Preço atual: **R$ 4.299,00**
     - Estoque atual: **12 un.**
     - Valor do lote: **R$ 51.588,00**
  3. Realizar as seguintes modificações:
     - Alterar o Preço para: **`3899.00`** *(desconto promocional)*
     - Alterar o Estoque para: **`20`** *(recebimento de nova remessa)*
  4. Clicar no botão **"Atualizar Dados no Model"**.
- **O que explicar para a banca:**
  > *"Este é o momento crucial que comprova a sincronização e o desacoplamento do MVC: Nós alteramos os dados na interface e enviamos para o **Controller**. O Controller acionou o método `update` da camada **Model**, que atualizou os registros no SQLite. O Controller então nos encaminhou para a View de detalhes (`show.ejs`). Notem que não apenas o preço e o estoque foram alterados, mas o Model recalculou em tempo de execução o método de negócio `calcularValorTotalEstoque()`, resultando em exatamente R$ 77.980,00 refletidos na tela."*
- **Resultado esperado na tela:**
  - Alerta verde: *"Efeito Refletido na View! Alterações salvas com sucesso no Model e refletidas nesta View!"*;
  - Preço unitário exibido: **R$ 3.899,00**;
  - Saldo em estoque: **20 un.**;
  - Valor total recalculado: **R$ 77.980,00**;
  - Timestamp de "Última atualização" sincronizado com o horário da operação.

---

### CENÁRIO 4: Integridade do Domínio (Validação no Model Bloqueando Entrada Inválida)
- **Ação na tela:**
  1. Clicar em **"+ Cadastrar Produto"**.
  2. Preencher com dados inválidos intencionais:
     - **Nome:** `X` *(menos de 2 caracteres)*
     - **Preço:** `-150.00` *(preço negativo)*
     - **Estoque:** `-5` *(estoque negativo)*
  3. Clicar em **"Salvar Produto no Model"**.
- **O que explicar para a banca:**
  > *"O que acontece quando um usuário tenta violar as regras de negócio da empresa? No padrão MVC clássico, a validação de domínio não fica em scripts soltos no navegador: ela pertence estritamente ao **Model**. Quando o Controller submeteu os dados ao Model, o método `assertValid()` barrou a operação antes mesmo de tocar no banco de dados. O Controller capturou o `ValidationError` e devolveu para a View com código HTTP 422, renderizando uma caixa de alerta vermelha com os motivos da recusa."*
- **Resultado esperado na tela:**
  - Alerta vermelho: *"Falha de Validação interceptada pelo Model"*;
  - Lista com os erros específicos:
    - *O nome do produto é obrigatório e deve ter no mínimo 2 caracteres.*
    - *O preço deve ser um valor numérico positivo maior que zero.*
    - *A quantidade em estoque deve ser um número inteiro maior ou igual a zero.*
  - O banco de dados permaneceu intacto e protegido.

---

### CENÁRIO 5: Filtro Dinâmico e Busca (Desacoplamento de Consulta)
- **Ação na tela:**
  1. Voltar para `/produtos`.
  2. No campo de busca, digitar **`Logitech`** e clicar em **"Filtrar"**.
  3. Em seguida, selecionar a categoria **`Periféricos`**.
- **O que explicar para a banca:**
  > *"A View coleta os parâmetros de filtro do formulário e repassa para o Controller via query string. O Controller delega a consulta para o `ProductRepository.findAll({ search, categoria })`, que monta uma consulta parametrizada segura contra SQL Injection, e a View apenas desenha os produtos retornados."*

---

### CENÁRIO 6: Exclusão Segura
- **Ação na tela:**
  1. Na tabela, localizar um produto de teste e clicar no botão vermelho de lixeira.
  2. O navegador exibe uma caixa de confirmação JavaScript: *"Deseja realmente excluir o produto...?"*.
  3. Clicar em **OK**.
- **O que explicar para a banca:**
  > *"A View dispara um `POST /produtos/:id/excluir`. O Controller aciona o método `delete` do Model, que remove o registro fisicamente do SQLite. O Controller então atualiza a listagem e a View reflete a remoção imediata do item."*

---

## 4. MAPA ARQUITETURAL DE RESPONSABILIDADES NA APLICAÇÃO

| Componente | Arquivo no Projeto | Responsabilidade no MVC |
| :--- | :--- | :--- |
| **Model (Entidade)** | `src/models/Product.js` | Representa o Produto, valida invariantes e executa regras de negócio |
| **Model (Repositório)** | `src/models/ProductRepository.js` | Executa a persistência com Prepared Statements no banco SQLite |
| **Controller** | `src/controllers/ProductController.js` | Recebe requisições HTTP, orquestra o Model e escolhe a View |
| **Rotas** | `src/routes/productRoutes.js` | Mapeia URLs e verbos HTTP para os métodos correspondentes do Controller |
| **View (Listagem)** | `src/views/products/index.ejs` | Apresenta a tabela geral, métricas de estoque e filtros de busca |
| **View (Cadastro)** | `src/views/products/new.ejs` | Formulário para criação de produtos com feedback de validação |
| **View (Edição)** | `src/views/products/edit.ejs` | Formulário para alteração de valores de produtos |
| **View (Detalhes)** | `src/views/products/show.ejs` | Exibe dados detalhados e confirmação visual de atualizações |

---

## 5. TRECHOS DE CÓDIGO CHAVE PARA O RELATÓRIO DO GRUPO

### 5.1 O Controller orquestrando a atualização e o reflexo na View:
```javascript
// Trecho de ProductController.js
async update(req, res) {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade_estoque, categoria } = req.body;

  try {
    // 1. Controller aciona o Model para validar e atualizar
    const produtoAtualizado = productRepository.update(id, {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade_estoque: parseInt(quantidade_estoque, 10),
      categoria
    });

    // 2. Controller redireciona para a View de detalhes refletindo os novos dados
    res.redirect(`/produtos/${produtoAtualizado.id}?msg=Alterações salvas com sucesso no Model e refletidas nesta View!`);
  } catch (err) {
    const errors = err.validationErrors || [err.message];
    res.status(422).render('products/edit', {
      produto: { ...req.body, id },
      errors,
      error: 'Não foi possível atualizar o produto. Corrija os erros apontados pelo Model.'
    });
  }
}
```

### 5.2 A View renderizando dados calculados pelo Model:
```html
<!-- Trecho de show.ejs -->
<div class="p-3 bg-light rounded-3 border">
  <span class="text-muted small fw-bold d-block">VALOR TOTAL DO LOTE</span>
  <!-- O dado é calculado dinamicamente pelo método do Model -->
  <span class="fs-4 fw-bold text-success"><%= produto.valorTotalEstoqueFormatado %></span>
</div>
```

---

## 6. CONCLUSÃO DA DEMONSTRAÇÃO

A execução deste roteiro atende integralmente a todas as exigências do trabalho:
1. **Separação estrita de responsabilidades:** nenhuma lógica de banco reside na View e nenhuma lógica de interface reside no Model;
2. **Ciclo completo de CRUD:** todas as operações foram demonstradas com sucesso;
3. **Reflexo dinâmico de dados:** alterações de preço e estoque no Model recalculam métricas patrimoniais refletidas imediatamente na View;
4. **Resiliência a erros:** o Model protege a consistência da aplicação, e o Controller assegura que a View informe o usuário com clareza.
