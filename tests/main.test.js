const test = require('node:test');
const assert = require('node:assert/strict');

const { criarAplicacao } = require('../src/main');

test('expõe o estado da aplicação', async (contexto) => {
  const servidor = criarAplicacao().listen(0);
  contexto.after(() => servidor.close());

  await new Promise((resolve) => servidor.once('listening', resolve));
  const resposta = await fetch(
    `http://127.0.0.1:${servidor.address().port}/health`,
  );

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { status: 'ok' });
});
