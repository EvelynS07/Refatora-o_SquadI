const path = require('node:path');
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const configuracaoPadrao = require('../config/env');
const { criarChatController } = require('./controllers/chatController');
const { criarGeminiRepository } = require('./repositories/geminiRepository');
const { criarChatService } = require('./services/chatService');

const INSTRUCAO_SISTEMA = `
Você é a assistente virtual da Squad I.

Responda sempre em português brasileiro.
Seu tom deve ser simpático, acolhedor, educado, interativo e levemente bem-humorado.

REGRAS:
- Responda de forma curta e natural.
- Use no máximo 2 ou 3 frases na maioria das respostas.
- Para saudações como "oi", "olá", "bom dia", "boa tarde" ou "boa noite",
  faça uma apresentação breve de quem você é e de quem é a Squad I.
- Não escreva textos longos.
- Não apresente todos os detalhes da equipe sem que o usuário pergunte.
- Não repita informações já apresentadas.
- Faça no máximo uma pergunta ao final.

APRESENTAÇÃO:
Você é a assistente virtual da Squad I e está aqui para ajudar os visitantes
a conhecer melhor a equipe, seus projetos, serviços e experiências.

A Squad I é formada por:
Mariane Caldeira, Camila Catarina, Evelyn Santos e Ana Carolina.

A equipe trabalha com desenvolvimento web e tecnologia,
criando sites institucionais, lojas on-line, blogs e outras soluções digitais.

Cases da equipe:
Bella Estética, Café do Bairro e Mundo das Receitas.

Não invente preços, prazos, contatos, experiências ou informações.
Quando não souber algo, diga isso de forma natural.
`;

function criarAplicacao({
  configuracao = configuracaoPadrao,
  criarClienteGemini = (chaveApi) => new GoogleGenAI({ apiKey: chaveApi }),
} = {}) {
  const aplicacao = express();
  aplicacao.use(express.json({ limit: '20kb' }));
  aplicacao.use(express.static(path.join(__dirname, '..', 'assets')));
  aplicacao.get('/', (_requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, '..', 'assets', 'home.html'));
  });

  // O cliente externo só é criado quando existe uma chave configurada.
  const clienteGemini = configuracao.geminiApiKey
    ? criarClienteGemini(configuracao.geminiApiKey)
    : null;
  const geminiRepository = clienteGemini
    ? criarGeminiRepository({
        clienteGemini,
        modelo: configuracao.geminiModel,
        instrucaoSistema: INSTRUCAO_SISTEMA,
      })
    : null;
  const chatService = criarChatService({
    chaveApi: configuracao.geminiApiKey,
    geminiRepository,
  });
  const chatController = criarChatController({ chatService });

  aplicacao.post('/api/chat', chatController.responder);
  return aplicacao;
}

if (require.main === module) {
  const aplicacao = criarAplicacao();
  aplicacao.listen(configuracaoPadrao.port, () => {
    console.log(`Squad I disponível em http://localhost:${configuracaoPadrao.port}`);
  });
}

module.exports = { criarAplicacao };
