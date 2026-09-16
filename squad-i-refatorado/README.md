# Portfólio Squad I — refatorado com Gemini

Aplicação Node.js/Express do portfólio da Squad I. O projeto fornece a rota `POST /api/chat`, valida as mensagens recebidas e utiliza a API Gemini para responder perguntas sobre a equipe, seus serviços e projetos.

## Tecnologias utilizadas

- Node.js 20 ou superior;
- Express;
- SDK oficial `@google/genai`;
- dotenv;
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

A API ficará disponível em `http://localhost:3000/api/chat`. Sem uma chave configurada, a rota funciona em modo demonstração.

## Testes

```bash
npm test
```

Os testes verificam a validação das mensagens, as regras do serviço, a adaptação para o Gemini, o controller HTTP e a rota da aplicação.

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
├── config/
│   └── env.js
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

`src/main.js` é o ponto de entrada. O controller trata HTTP, o service concentra as regras do chatbot, o model valida as mensagens e o repository isola a comunicação com o Gemini.

