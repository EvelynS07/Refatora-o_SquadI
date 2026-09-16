const test = require('node:test');
const assert = require('node:assert/strict');

const { criarChatController } = require('../src/controllers/chatController');

function criarRespostaHttp() {
  return {
    codigo: 200,
    corpo: undefined,
    status(codigo) {
      this.codigo = codigo;
      return this;
    },
    json(corpo) {
      this.corpo = corpo;
      return this;
    },
  };
}

test('responde com status 400 quando as mensagens são inválidas', async () => {
  const controller = criarChatController({
    chatService: { responder: async () => 'não deve ser chamada' },
  });
  const respostaHttp = criarRespostaHttp();

  await controller.responder({ body: { messages: [] } }, respostaHttp);

  assert.equal(respostaHttp.codigo, 400);
  assert.deepEqual(respostaHttp.corpo, {
    error: 'Envie uma mensagem válida de até 500 caracteres.',
  });
});

test('responde com status 400 quando a requisição não possui corpo', async () => {
  const controller = criarChatController({
    chatService: { responder: async () => 'não deve ser chamada' },
  });
  const respostaHttp = criarRespostaHttp();

  await controller.responder({}, respostaHttp);

  assert.equal(respostaHttp.codigo, 400);
  assert.deepEqual(respostaHttp.corpo, {
    error: 'Envie uma mensagem válida de até 500 caracteres.',
  });
});

test('responde com o conteúdo gerado pelo serviço', async () => {
  const controller = criarChatController({
    chatService: { responder: async () => 'Olá! Como posso ajudar?' },
  });
  const respostaHttp = criarRespostaHttp();

  await controller.responder(
    { body: { messages: [{ role: 'user', content: 'Olá' }] } },
    respostaHttp,
  );

  assert.equal(respostaHttp.codigo, 200);
  assert.deepEqual(respostaHttp.corpo, { reply: 'Olá! Como posso ajudar?' });
});

test('responde com status 502 quando o serviço de IA falha', async () => {
  const controller = criarChatController({
    chatService: {
      responder: async () => {
        throw new Error('falha externa');
      },
    },
    registrarErro: () => {},
  });
  const respostaHttp = criarRespostaHttp();

  await controller.responder(
    { body: { messages: [{ role: 'user', content: 'Olá' }] } },
    respostaHttp,
  );

  assert.equal(respostaHttp.codigo, 502);
  assert.deepEqual(respostaHttp.corpo, {
    error: 'O assistente está indisponível. Tente novamente em instantes.',
  });
});
