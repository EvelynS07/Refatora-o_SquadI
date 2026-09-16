const express = require('express');

const configuracao = require('../config/env');

function criarAplicacao() {
  const aplicacao = express();
  aplicacao.get('/health', (_requisicao, resposta) => {
    resposta.json({ status: 'ok' });
  });
  return aplicacao;
}

if (require.main === module) {
  criarAplicacao().listen(configuracao.port, () => {
    console.log(`Squad I disponível em http://localhost:${configuracao.port}`);
  });
}

module.exports = { criarAplicacao };
