const test = require('node:test');
const assert = require('node:assert/strict');

const { criarGeminiRepository } = require('../src/repositories/geminiRepository');

test('envia a conversa ao Gemini e devolve o texto da resposta', async () => {
  let requisicaoRecebida;
  const clienteGemini = {
    models: {
      async generateContent(requisicao) {
        requisicaoRecebida = requisicao;
        return { text: 'Resposta gerada' };
      },
    },
  };
  const repositorio = criarGeminiRepository({
    clienteGemini,
    modelo: 'gemini-teste',
    instrucaoSistema: 'Responda sobre o portfólio.',
  });

  const resposta = await repositorio.gerarResposta([
    { role: 'user', content: 'Olá' },
    { role: 'assistant', content: 'Como posso ajudar?' },
  ]);

  assert.equal(resposta, 'Resposta gerada');
  assert.deepEqual(requisicaoRecebida, {
    model: 'gemini-teste',
    contents: [
      { role: 'user', parts: [{ text: 'Olá' }] },
      { role: 'model', parts: [{ text: 'Como posso ajudar?' }] },
    ],
    config: {
      systemInstruction: 'Responda sobre o portfólio.',
      maxOutputTokens: 120,
    },
  });
});

test('repete falhas temporárias antes de responder', async () => {
  let tentativas = 0;
  const esperas = [];
  const repositorio = criarGeminiRepository({
    clienteGemini: {
      models: {
        async generateContent() {
          tentativas += 1;
          if (tentativas < 3) {
            throw Object.assign(new Error('ocupado'), { status: 503 });
          }
          return { text: 'Disponível' };
        },
      },
    },
    modelo: 'gemini-teste',
    instrucaoSistema: 'Teste',
    esperar: async (milissegundos) => esperas.push(milissegundos),
  });

  const resposta = await repositorio.gerarResposta([
    { role: 'user', content: 'Olá' },
  ]);

  assert.equal(resposta, 'Disponível');
  assert.equal(tentativas, 3);
  assert.deepEqual(esperas, [1000, 2000]);
});

test('não repete erros permanentes', async () => {
  let tentativas = 0;
  const erro = Object.assign(new Error('inválido'), { status: 400 });
  const repositorio = criarGeminiRepository({
    clienteGemini: {
      models: {
        async generateContent() {
          tentativas += 1;
          throw erro;
        },
      },
    },
    modelo: 'gemini-teste',
    instrucaoSistema: 'Teste',
    esperar: async () => {},
  });

  await assert.rejects(
    repositorio.gerarResposta([{ role: 'user', content: 'Olá' }]),
    erro,
  );
  assert.equal(tentativas, 1);
});
