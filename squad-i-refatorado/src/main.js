const path = require('node:path');
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const configuracaoPadrao = require('../config/env');
const { criarChatController } = require('./controllers/chatController');
const { criarGeminiRepository } = require('./repositories/geminiRepository');
const { criarChatService } = require('./services/chatService');

const INSTRUCAO_SISTEMA = `Você é o assistente virtual do portfólio da Squad I. Responda em português, de forma breve, cordial e somente sobre a equipe, seus serviços e projetos. A equipe é formada por Mariane Caldeira, Camila Catarina, Evelyn Santos e Ana Carolina. Os serviços são sites institucionais, lojas on-line e blogs. Os cases são Bella Estética, Café do Bairro e Mundo das Receitas. Quando não souber uma informação, direcione a pessoa ao formulário. Não invente preços, prazos, contatos ou experiências.`;

function criarAplicacao({ configuracao = configuracaoPadrao } = {}) {
  const aplicacao = express();
  aplicacao.use(express.json({ limit: '20kb' }));
  aplicacao.use(express.static(path.join(__dirname, '..', 'assets')));

  // O cliente externo só é criado quando existe uma chave configurada.
  const clienteGemini = configuracao.geminiApiKey
    ? new GoogleGenAI({ apiKey: configuracao.geminiApiKey })
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
