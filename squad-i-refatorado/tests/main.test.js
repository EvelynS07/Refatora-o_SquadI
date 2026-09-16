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

