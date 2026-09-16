const PAPEIS_PERMITIDOS = ['user', 'assistant'];
const LIMITE_DE_MENSAGENS = 10;
const LIMITE_DE_CARACTERES = 500;

function mensagemEhValida(mensagem) {
  if (!mensagem || typeof mensagem !== 'object') return false;
  if (!PAPEIS_PERMITIDOS.includes(mensagem.role)) return false;
  if (typeof mensagem.content !== 'string') return false;

  const conteudo = mensagem.content.trim();
  return conteudo.length > 0 && conteudo.length <= LIMITE_DE_CARACTERES;
}

function mensagensSaoValidas(mensagens) {
  if (!Array.isArray(mensagens)) return false;
  if (mensagens.length === 0) return false;
  if (mensagens.length > LIMITE_DE_MENSAGENS) return false;

  return mensagens.every(mensagemEhValida);
}

module.exports = { mensagensSaoValidas };
