# Design do front-end multipágina da Squad I

## Objetivo

Adicionar ao projeto `squad-i-refatorado` o front-end completo do portfólio da Squad I. O resultado continuará sendo uma aplicação Node.js/Express, manterá os oito documentos HTML separados, utilizará uma folha CSS independente para cada página e disponibilizará o chatbot Gemini em todas as páginas.

## Escopo

Serão incluídas as páginas:

1. `home.html`;
2. `sobre.html`;
3. `habilidades.html`;
4. `projetos.html`;
5. `servicos.html`;
6. `depoimentos.html`;
7. `case-de-sucesso.html`;
8. `contato.html`.

O conteúdo original da equipe, das habilidades, dos serviços, dos projetos, dos depoimentos e dos cases será preservado. Estruturas HTML inválidas, links quebrados, campos sem identificação, navegação inconsistente e referências a imagens não fornecidas serão corrigidos.

## Estrutura de arquivos

```text
squad-i-refatorado/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── repositories/
│   └── main.js
├── assets/
│   ├── home.html
│   ├── sobre.html
│   ├── habilidades.html
│   ├── projetos.html
│   ├── servicos.html
│   ├── depoimentos.html
│   ├── case-de-sucesso.html
│   ├── contato.html
│   ├── styles/
│   │   ├── home.css
│   │   ├── sobre.css
│   │   ├── habilidades.css
│   │   ├── projetos.css
│   │   ├── servicos.css
│   │   ├── depoimentos.css
│   │   ├── case-de-sucesso.css
│   │   └── contato.css
│   └── scripts/
│       └── app.js
├── tests/
├── docs/
├── config/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

Cada HTML importará somente seu CSS específico. As folhas terão os estilos completos necessários para que cada página permaneça visualmente funcional de maneira independente. O JavaScript será compartilhado porque menu, formulário, reações e chatbot possuem o mesmo comportamento nas páginas.

## Identidade visual

O layout terá aparência tecnológica e profissional, com fundo azul-marinho escuro, superfícies translúcidas, bordas iluminadas e degradês entre azul, roxo e lilás. A essência feminina será aplicada por meio de detalhes delicados, cantos arredondados, brilhos suaves e pequenos acentos rosados, sem utilizar estereótipos infantis.

Todas as páginas compartilharão:

- cabeçalho consistente;
- logotipo textual da Squad I;
- navegação com indicação da página atual;
- hierarquia tipográfica equivalente;
- cartões translúcidos;
- rodapé consistente;
- comportamento responsivo.

Como as fotografias e imagens citadas nos HTML originais não foram fornecidas, serão usados avatares com iniciais e composições gráficas em CSS. Assim, nenhuma página apresentará imagens quebradas.

## Páginas

### Início

Apresentará uma introdução da Squad I, resumo de atuação, chamada para os projetos e cartões das quatro integrantes.

### Sobre

Apresentará os perfis individuais preservados do material original em cartões organizados.

### Habilidades

Distribuirá as habilidades das integrantes em uma grade responsiva, mantendo o conteúdo original.

### Projetos

Apresentará três projetos em cartões visuais sem depender do arquivo ausente `imagem.jpg`.

### Serviços

Apresentará website, loja online e blog, com ícones produzidos por texto ou CSS, sem dependência externa.

### Depoimentos

Manterá os quatro depoimentos e disponibilizará reações interativas de gostei e não gostei. Uma reação substituirá a outra no mesmo cartão.

### Cases de sucesso

Manterá os quatro cases e corrigirá a navegação de `sucessos.html` para `case-de-sucesso.html`.

### Contato

Terá campos identificados de nome, e-mail, telefone e mensagem, com validação nativa e retorno visual local. O envio não será conectado a serviço externo porque não existe endpoint de contato no escopo atual.

## Chatbot

Um botão flutuante ficará disponível nas oito páginas. Ao ser acionado, abrirá um painel contendo histórico, campo de texto, botão de envio e controle para fechar.

O script enviará para `POST /api/chat` no máximo as dez mensagens mais recentes nos papéis `user` e `assistant`, respeitando o limite de 500 caracteres já validado pelo backend. O painel mostrará carregamento, falha de comunicação e respostas do modo demonstração.

O prompt do Gemini será ajustado para uma personalidade educada, interativa e levemente bem-humorada. O assistente continuará restrito às informações da Squad I e não poderá inventar preços, prazos, contatos ou experiências.

## Servidor e fluxo

O Express continuará publicando a pasta `assets`. A rota `/` entregará `home.html`, as demais páginas serão acessadas por seus nomes e `/api/chat` manterá o contrato atual.

```text
Página HTML → app.js → POST /api/chat → controller → service → Gemini
```

Caso não exista `GEMINI_API_KEY`, o backend continuará retornando a mensagem de demonstração. Falhas externas continuarão retornando status `502` e mensagens amigáveis.

## Responsividade e acessibilidade

- menu adaptável para telas pequenas;
- grades convertidas para uma coluna quando necessário;
- foco visível em links, botões e campos;
- HTML semântico;
- `aria-label`, `aria-expanded`, regiões de status e associação entre labels e campos;
- contraste legível sobre os degradês;
- suporte a `prefers-reduced-motion`;
- chatbot utilizável por teclado.

## Testes e verificação

Além dos testes existentes do backend, serão adicionados testes para verificar:

- existência dos oito HTML e oito CSS correspondentes;
- vínculo de cada HTML somente com sua folha de estilo;
- navegação consistente e ausência de `sucessos.html`;
- inclusão do script compartilhado e dos elementos do chatbot;
- limite de mensagem no campo do chat;
- entrega de `home.html` pela rota `/`;
- preservação do comportamento de `/api/chat`.

A verificação final executará a suíte `npm test`, checagem de sintaxe JavaScript e validação do novo ZIP.

## Exclusões

Não serão adicionados banco de dados, autenticação, envio real do formulário de contato, bibliotecas visuais externas, imagens inventadas, publicação ou configuração de GitHub. O resultado será entregue como atualização do `squad-i-refatorado.zip`, pronto para ser versionado pela usuária.
