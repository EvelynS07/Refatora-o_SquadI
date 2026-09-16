const RESPOSTA_DEMONSTRACAO =
  'O chat está em modo demonstração. Configure GEMINI_API_KEY no arquivo .env para ativar as respostas da IA.';
const RESPOSTA_VAZIA = 'Não consegui formular uma resposta agora.';

function criarChatService({ chaveApi, geminiRepository }) {
  return {
    async responder(mensagens) {
      if (!chaveApi) return RESPOSTA_DEMONSTRACAO;

      const resposta = await geminiRepository.gerarResposta(mensagens);
      if (!resposta || !resposta.trim()) return RESPOSTA_VAZIA;

      return resposta;
    },
  };
}

module.exports = { criarChatService };
