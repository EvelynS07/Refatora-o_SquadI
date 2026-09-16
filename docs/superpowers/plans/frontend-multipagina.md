# Front-end multipágina da Squad I — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar oito páginas responsivas com CSS independente e um chatbot flutuante integrado à rota Gemini existente.

**Architecture:** O Express publicará os arquivos estáticos de `assets/` e entregará `home.html` na raiz. Cada HTML terá seu próprio CSS completo; `assets/scripts/app.js` concentrará menu, reações, formulário e chat, comunicando-se apenas com `POST /api/chat`.

**Tech Stack:** HTML5, CSS3, JavaScript no navegador, Node.js 20+, Express, `@google/genai`, `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-16-frontend-multipagina-design.md`

## Global Constraints

- Manter oito HTML separados e oito CSS independentes.
- Usar identidade tecnológica com degradê azul, roxo, lilás e acentos rosados.
- Preservar o conteúdo original da Squad I sem criar fatos, contatos, preços ou experiências.
- Não depender de imagens, fontes, ícones ou bibliotecas externas.
- Exibir o chatbot em todas as páginas e limitar cada mensagem a 500 caracteres.
- Reutilizar a rota `POST /api/chat` e enviar no máximo dez mensagens.
- Manter Node.js 20 ou superior e CommonJS no backend.
- Não adicionar banco de dados, autenticação nem envio externo do formulário.

---

### Task 1: Contrato dos arquivos estáticos

**Files:**
- Create: `tests/frontend.test.js`
- Create: `assets/home.html`
- Create: `assets/sobre.html`
- Create: `assets/habilidades.html`
- Create: `assets/projetos.html`
- Create: `assets/servicos.html`
- Create: `assets/depoimentos.html`
- Create: `assets/case-de-sucesso.html`
- Create: `assets/contato.html`
- Create: `assets/styles/home.css`
- Create: `assets/styles/sobre.css`
- Create: `assets/styles/habilidades.css`
- Create: `assets/styles/projetos.css`
- Create: `assets/styles/servicos.css`
- Create: `assets/styles/depoimentos.css`
- Create: `assets/styles/case-de-sucesso.css`
- Create: `assets/styles/contato.css`
- Create: `assets/scripts/app.js`

**Interfaces:**
- Consumes: pasta estática `assets/` publicada pelo Express.
- Produces: oito páginas com links relativos `styles/<pagina>.css` e `scripts/app.js`.

- [ ] **Step 1: Escrever o teste estrutural que falha**

Criar um teste com listas literais de páginas e verificar, para cada item, a existência do HTML/CSS, o vínculo com o CSS correspondente, `data-page`, `data-chat`, `maxlength="500"`, `scripts/app.js` e os oito links de navegação. Verificar também que nenhum HTML contém `sucessos.html`.

- [ ] **Step 2: Executar o teste vermelho**

Run: `node --test tests/frontend.test.js`

Expected: FAIL porque `assets/home.html` e os demais arquivos ainda não existem.

- [ ] **Step 3: Criar os oito HTML semânticos**

Cada página deve conter `header`, `nav`, `main`, `footer`, botão de menu, link ativo com `aria-current="page"`, botão flutuante do chat, painel do chat com região de mensagens, formulário e script compartilhado. Preservar o conteúdo original de cada seção e usar avatares de iniciais e composições CSS onde faltam imagens.

- [ ] **Step 4: Criar os oito CSS completos**

Cada arquivo deve declarar seus próprios tokens em `:root`, reset, fundo, cabeçalho, navegação, conteúdo, cartões, rodapé, chatbot, breakpoints em `900px` e `640px`, estados de foco e `prefers-reduced-motion`. Não importar um CSS compartilhado.

- [ ] **Step 5: Criar o JavaScript compartilhado mínimo**

O arquivo deverá inicializar menu, reações, contato e chat somente quando os elementos correspondentes existirem. Nesta tarefa, criar seletores e alternância visual; o envio para a API será concluído na Task 2.

- [ ] **Step 6: Executar o teste estrutural**

Run: `node --test tests/frontend.test.js`

Expected: PASS para existência, vínculos, navegação e elementos comuns.

### Task 2: Comportamento do chatbot no navegador

**Files:**
- Modify: `assets/scripts/app.js`
- Modify: `src/main.js`
- Modify: `tests/main.test.js`
- Test: `tests/frontend.test.js`

**Interfaces:**
- Consumes: `POST /api/chat` com `{ messages: Array<{ role, content }> }`.
- Produces: painel flutuante que mantém histórico local de até dez mensagens e mostra `reply` ou `error`.

- [ ] **Step 1: Adicionar testes que falham**

Adicionar teste da rota `GET /` esperando HTML com título `Squad I` e teste estrutural de `app.js` por execução em contexto controlado apenas para os comportamentos públicos exportados em `window.SquadApp`: `limitarHistorico`, `criarMensagem` e `enviarConversa`.

- [ ] **Step 2: Executar os testes vermelhos**

Run: `node --test tests/main.test.js tests/frontend.test.js`

Expected: FAIL porque `/` ainda não entrega explicitamente `home.html` e as funções do navegador ainda não estão expostas.

- [ ] **Step 3: Implementar a rota inicial**

Em `src/main.js`, adicionar `aplicacao.get('/', (_requisicao, resposta) => resposta.sendFile(path.join(__dirname, '..', 'assets', 'home.html')));` antes da rota do chat.

- [ ] **Step 4: Implementar o chat**

Em `app.js`, manter `historico.slice(-10)`, bloquear conteúdo vazio, limitar a 500 caracteres, renderizar a mensagem do usuário, mostrar estado de digitação, chamar `fetch('/api/chat')`, renderizar `reply`, tratar respostas não OK e restaurar o formulário em `finally`. Abrir o painel com foco no campo e atualizar `aria-expanded`/`aria-hidden`.

- [ ] **Step 5: Implementar as interações auxiliares**

Fechar o menu após navegação; tornar gostei/não gostei mutuamente exclusivos; validar o formulário de contato e mostrar retorno local sem enviar dados externamente.

- [ ] **Step 6: Executar os testes**

Run: `npm test`

Expected: todos os testes PASS.

### Task 3: Personalidade Gemini e documentação

**Files:**
- Modify: `src/main.js`
- Modify: `README.md`
- Modify: `docs/RELATORIO-DA-ATIVIDADE.md`
- Test: `tests/main.test.js`

**Interfaces:**
- Consumes: mensagens validadas do navegador.
- Produces: respostas em português, educadas, interativas, breves e levemente bem-humoradas.

- [ ] **Step 1: Registrar o comportamento esperado**

Adicionar teste de integração com cliente Gemini injetável que capture a configuração enviada e confirme que a instrução restringe o assunto à Squad I e solicita tom educado e bem-humorado.

- [ ] **Step 2: Executar o teste vermelho**

Run: `node --test tests/main.test.js`

Expected: FAIL porque `criarAplicacao` ainda não aceita a fábrica do cliente e o prompt ainda não contém a personalidade completa.

- [ ] **Step 3: Atualizar a composição do backend**

Permitir `criarClienteGemini` como dependência opcional de `criarAplicacao`, mantendo `new GoogleGenAI({ apiKey })` como padrão. Atualizar `INSTRUCAO_SISTEMA` para o tom aprovado, preservando as proibições de inventar informações.

- [ ] **Step 4: Atualizar documentação**

Documentar estrutura completa, páginas, CSS independentes, chat flutuante, instalação, `.env`, execução e testes. Atualizar o relatório com as correções realizadas.

- [ ] **Step 5: Executar a suíte completa**

Run: `npm test`

Expected: todos os testes PASS sem falhas.

### Task 4: Verificação visual, empacotamento e entrega

**Files:**
- Modify when necessary: `assets/*.html`, `assets/styles/*.css`, `assets/scripts/app.js`
- Replace deliverable: `squad-i-refatorado.zip`

**Interfaces:**
- Consumes: aplicação completa executável com `npm start`.
- Produces: ZIP validado, sem `node_modules`, pronto para GitHub.

- [ ] **Step 1: Verificar sintaxe e testes**

Run: `find src tests config assets/scripts -name '*.js' -print0 | xargs -0 -n1 node --check && npm test`

Expected: exit code `0` e todos os testes PASS.

- [ ] **Step 2: Executar e inspecionar as páginas**

Iniciar a aplicação sem chave, abrir `/`, percorrer as oito páginas em largura desktop e móvel, testar menu, links, formulário, reações e chatbot em modo demonstração. Corrigir apenas defeitos observados e repetir a inspeção.

- [ ] **Step 3: Conferir a estrutura versionável**

Confirmar que não existem chaves reais, referências a OpenAI, links para `sucessos.html`, imagens quebradas ou `node_modules` no pacote. Manter `.env` ignorado e `.env.example` disponível.

- [ ] **Step 4: Atualizar o ZIP**

Compactar `squad-i-refatorado/` excluindo `node_modules/`. Executar `unzip -t squad-i-refatorado.zip` e exigir `No errors detected`.

- [ ] **Step 5: Preparar versionamento**

Não inicializar Git dentro do ZIP. Entregar mensagens sugeridas para commits separados: `feat: adicionar frontend multipagina responsivo`, `feat: integrar chatbot Gemini ao frontend` e `docs: atualizar estrutura e execução do projeto`.
