const test = require('node:test');
const assert = require('node:assert/strict');

const { criarChatService } = require('../src/services/chatService');

test('retorna modo demonstração quando a chave não foi configurada', async () => {
  const chatService = criarChatService({
    chaveApi: '',
    geminiRepository: null,
  });

  const resposta = await chatService.responder([
    { role: 'user', content: 'Olá!' },
  ]);

  assert.equal(
    resposta,
    'O chat está em modo demonstração. Configure GEMINI_API_KEY no arquivo .env para ativar as respostas da IA.',
  );
});

test('retorna a resposta produzida pelo repositório Gemini', async () => {
  const repositorio = {
    gerarResposta: async () => 'Resposta do Gemini',
  };
  const chatService = criarChatService({
    chaveApi: 'chave-de-teste',
    geminiRepository: repositorio,
  });

  const resposta = await chatService.responder([
    { role: 'user', content: 'Apresente a equipe.' },
  ]);

  assert.equal(resposta, 'Resposta do Gemini');
});

test('usa mensagem alternativa quando o Gemini retorna texto vazio', async () => {
  const repositorio = {
    gerarResposta: async () => '   ',
  };
  const chatService = criarChatService({
    chaveApi: 'chave-de-teste',
    geminiRepository: repositorio,
  });

  const resposta = await chatService.responder([
    { role: 'user', content: 'Apresente a equipe.' },
  ]);

  assert.equal(resposta, 'Não consegui formular uma resposta agora.');
});

