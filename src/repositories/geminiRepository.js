function converterMensagemParaGemini({ role, content }) {
  return {
    role: role === 'assistant' ? 'model' : 'user',
    parts: [{ text: content }],
  };
}

function criarGeminiRepository({ clienteGemini, modelo, instrucaoSistema }) {
  return {
    async gerarResposta(mensagens) {
      const maxTentativas = 3;

      for (let tentativa = 1; tentativa <= maxTentativas; tentativa += 1) {
        try {
          const resposta = await clienteGemini.models.generateContent({
            model: modelo,
            contents: mensagens.map(converterMensagemParaGemini),
            config: {
              systemInstruction: instrucaoSistema,
              maxOutputTokens: 120,
            },
          });

          return resposta.text;
        } catch (erro) {
          const podeTentarNovamente = erro.status === 503 || erro.status === 429;

          if (!podeTentarNovamente || tentativa === maxTentativas) {
            throw erro;
          }

          await new Promise((resolve) => {
            setTimeout(resolve, 1000 * tentativa);
          });
        }
      }
    },
  };
}

module.exports = { criarGeminiRepository };
