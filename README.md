# Portfólio Squad I — refatorado com Gemini

Aplicação multipágina Node.js/Express do portfólio da Squad I. O projeto possui oito páginas responsivas, identidade visual tecnológica em azul e roxo e um chatbot flutuante integrado à API Gemini.

## Tecnologias utilizadas

- Node.js 20 ou superior;
- Express;
- SDK oficial `@google/genai`;
- dotenv;
- HTML5, CSS3 e JavaScript;
- `node:test` para testes automatizados.

## Instalação

Na pasta raiz do projeto, instale as dependências:

```bash
npm install
```

Crie o arquivo local de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Preencha somente a chave no arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

O arquivo `.env` está no `.gitignore` e não deve ser enviado ao GitHub.

## Execução

Para executar normalmente:

```bash
npm start
```

Para executar com reinicialização automática durante o desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`. A API do chatbot utiliza `http://localhost:3000/api/chat`. Sem uma chave configurada, o chat funciona em modo demonstração.

## Páginas e chatbot

- `home.html`: apresentação da equipe;
- `sobre.html`: perfis das integrantes;
- `habilidades.html`: conhecimentos da equipe;
- `projetos.html`: projetos em destaque;
- `servicos.html`: serviços oferecidos;
- `depoimentos.html`: avaliações com reações interativas;
- `case-de-sucesso.html`: cases desenvolvidos;
- `contato.html`: formulário com validação local.

Cada página possui seu próprio arquivo CSS em `assets/styles/`. O botão flutuante abre o assistente em todas as páginas. O histórico enviado ao backend contém no máximo dez mensagens de até 500 caracteres.

## Testes

```bash
npm test
```

Os testes verificam os arquivos HTML e CSS, a navegação, o chatbot do navegador, a validação das mensagens, as regras do serviço, a adaptação para o Gemini, o controller HTTP e as rotas da aplicação.

## Estrutura

```text
squad-i-refatorado/
├── src/
│   ├── controllers/
│   │   └── chatController.js
│   ├── services/
│   │   └── chatService.js
│   ├── models/
│   │   └── mensagem.js
│   ├── repositories/
│   │   └── geminiRepository.js
│   └── main.js
├── tests/
├── docs/
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
├── config/
│   └── env.js
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

`src/main.js` é o ponto de entrada. O controller trata HTTP, o service concentra as regras do chatbot, o model valida as mensagens e o repository isola a comunicação com o Gemini. O conteúdo estático permanece em `assets/`, separado do backend e dos testes.

## Sugestão de commits

```bash
git add assets tests src/main.js
git commit -m "feat: adicionar frontend multipagina responsivo"

git add src tests
git commit -m "feat: integrar chatbot Gemini ao frontend"

git add README.md docs
git commit -m "docs: atualizar estrutura e execução do projeto"
```
