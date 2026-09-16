const test = require('node:test');
const assert = require('node:assert/strict');

const { criarAplicacao } = require('../src/main');

test('expõe a rota POST /api/chat em modo demonstração', async (contexto) => {
  const aplicacao = criarAplicacao({
    configuracao: {
      geminiApiKey: '',
      geminiModel: 'gemini-teste',
      port: 3000,
    },
  });
  const servidor = aplicacao.listen(0);
  contexto.after(() => servidor.close());

  await new Promise((resolve) => servidor.once('listening', resolve));
  const endereco = servidor.address();
  const respostaHttp = await fetch(`http://127.0.0.1:${endereco.port}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Olá' }],
    }),
  });

  assert.equal(respostaHttp.status, 200);
  assert.deepEqual(await respostaHttp.json(), {
    reply:
      'O chat está em modo demonstração. Configure GEMINI_API_KEY no arquivo .env para ativar as respostas da IA.',
  });
});

test('entrega home.html na rota raiz', async (contexto) => {
  const aplicacao = criarAplicacao({
    configuracao: {
      geminiApiKey: '',
      geminiModel: 'gemini-teste',
      port: 3000,
    },
  });
  const servidor = aplicacao.listen(0);
  contexto.after(() => servidor.close());

  await new Promise((resolve) => servidor.once('listening', resolve));
  const endereco = servidor.address();
  const respostaHttp = await fetch(`http://127.0.0.1:${endereco.port}/`);
  const html = await respostaHttp.text();

  assert.equal(respostaHttp.status, 200);
  assert.match(html, /<title>Início \| Squad I<\/title>/);
  assert.match(html, /data-page="home"/);
});

test('cria o cliente Gemini com a chave configurada', () => {
  let chaveRecebida;

  criarAplicacao({
    configuracao: {
      geminiApiKey: 'chave-de-teste',
      geminiModel: 'gemini-teste',
      port: 3000,
    },
    criarClienteGemini: (chaveApi) => {
      chaveRecebida = chaveApi;
      return { models: { generateContent: async () => ({ text: 'Olá' }) } };
    },
  });

  assert.equal(chaveRecebida, 'chave-de-teste');
});

test('orienta o Gemini a ser educado, interativo e bem-humorado', async (contexto) => {
  let requisicaoGemini;
  const aplicacao = criarAplicacao({
    configuracao: {
      geminiApiKey: 'chave-de-teste',
      geminiModel: 'gemini-teste',
      port: 3000,
    },
    criarClienteGemini: () => ({
      models: {
        generateContent: async (requisicao) => {
          requisicaoGemini = requisicao;
          return { text: 'Olá! Como posso ajudar?' };
        },
      },
    }),
  });
  const servidor = aplicacao.listen(0);
  contexto.after(() => servidor.close());

  await new Promise((resolve) => servidor.once('listening', resolve));
  const endereco = servidor.address();
  const respostaHttp = await fetch(`http://127.0.0.1:${endereco.port}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Quem faz parte da equipe?' }],
    }),
  });

  assert.equal(respostaHttp.status, 200);
  assert.deepEqual(await respostaHttp.json(), { reply: 'Olá! Como posso ajudar?' });
  assert.match(requisicaoGemini.config.systemInstruction, /educad/i);
  assert.match(requisicaoGemini.config.systemInstruction, /interativ/i);
  assert.match(requisicaoGemini.config.systemInstruction, /bem-humorad/i);
  assert.match(requisicaoGemini.config.systemInstruction, /não invente/i);
});
