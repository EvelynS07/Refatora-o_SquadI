function converterMensagemParaGemini({ role, content }) {
  // A API do Gemini representa respostas anteriores com o papel "model".
  return {
    role: role === 'assistant' ? 'model' : 'user',
    parts: [{ text: content }],
  };
}

function criarGeminiRepository({ clienteGemini, modelo, instrucaoSistema }) {
  return {
    async gerarResposta(mensagens) {
      const resposta = await clienteGemini.models.generateContent({
        model: modelo,
        contents: mensagens.map(converterMensagemParaGemini),
        config: { systemInstruction: instrucaoSistema },
      });

      return resposta.text;
    },
  };
}

module.exports = { criarGeminiRepository };
