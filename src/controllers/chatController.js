const { mensagensSaoValidas } = require('../models/mensagem');

const ERRO_VALIDACAO = 'Envie uma mensagem válida de até 500 caracteres.';
const ERRO_SERVICO = 'O assistente está indisponível. Tente novamente em instantes.';

function criarChatController({ chatService, registrarErro = console.error }) {
  return {
    async responder(requisicao, respostaHttp) {
      const mensagens = requisicao.body?.messages;
      if (!mensagensSaoValidas(mensagens)) {
        return respostaHttp.status(400).json({ error: ERRO_VALIDACAO });
      }

      try {
        const resposta = await chatService.responder(mensagens);
        return respostaHttp.json({ reply: resposta });
      } catch (erro) {
        registrarErro('Falha na API do Gemini:', erro.status || erro.message);
        return respostaHttp.status(502).json({ error: ERRO_SERVICO });
      }
    },
  };
}

module.exports = { criarChatController };
