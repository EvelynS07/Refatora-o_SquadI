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
