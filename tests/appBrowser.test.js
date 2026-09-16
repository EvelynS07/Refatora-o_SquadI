const test = require('node:test');
const assert = require('node:assert/strict');

const {
  criarMensagem,
  enviarConversa,
  limitarHistorico,
} = require('../assets/scripts/app');

test('limita o histórico às dez mensagens mais recentes', () => {
  const historico = Array.from({ length: 12 }, (_, indice) => ({
    role: 'user',
    content: `Mensagem ${indice + 1}`,
  }));

  const limitado = limitarHistorico(historico);

  assert.equal(limitado.length, 10);
  assert.equal(limitado[0].content, 'Mensagem 3');
  assert.equal(limitado[9].content, 'Mensagem 12');
});

test('cria uma mensagem com papel e conteúdo normalizados', () => {
  assert.deepEqual(criarMensagem('user', '  Olá, equipe!  '), {
    role: 'user',
    content: 'Olá, equipe!',
  });
});

test('envia somente as dez mensagens mais recentes para a rota do chat', async () => {
  let requisicaoRecebida;
  const fetchImpl = async (url, opcoes) => {
    requisicaoRecebida = { url, opcoes };
    return {
      ok: true,
      json: async () => ({ reply: 'Resposta da Squad I' }),
    };
  };
  const historico = Array.from({ length: 12 }, (_, indice) => ({
    role: indice % 2 === 0 ? 'user' : 'assistant',
    content: `Mensagem ${indice + 1}`,
  }));

  const resposta = await enviarConversa(historico, fetchImpl);

  assert.equal(resposta, 'Resposta da Squad I');
  assert.equal(requisicaoRecebida.url, '/api/chat');
  assert.equal(requisicaoRecebida.opcoes.method, 'POST');
  assert.equal(JSON.parse(requisicaoRecebida.opcoes.body).messages.length, 10);
});

test('propaga a mensagem amigável devolvida pela API', async () => {
  const fetchImpl = async () => ({
    ok: false,
    json: async () => ({ error: 'O assistente está indisponível.' }),
  });

  await assert.rejects(
    enviarConversa([{ role: 'user', content: 'Olá' }], fetchImpl),
    /O assistente está indisponível\./,
  );
});
