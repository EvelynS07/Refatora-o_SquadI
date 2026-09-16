'use strict';

function limitarHistorico(historico) {
  return historico.slice(-10);
}

function criarMensagem(role, content) {
  return { role, content: content.trim() };
}

async function enviarConversa(historico, fetchImpl = fetch) {
  const respostaHttp = await fetchImpl('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: limitarHistorico(historico) }),
  });
  const corpo = await respostaHttp.json();

  if (!respostaHttp.ok) {
    throw new Error(corpo.error || 'Não foi possível falar com o assistente.');
  }

  return corpo.reply;
}

function iniciarMenu(documento) {
  const botaoMenu = documento.querySelector('[data-menu-toggle]');
  const menu = documento.querySelector('[data-menu]');
  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener('click', () => {
    const estaAberto = menu.classList.toggle('open');
    botaoMenu.setAttribute('aria-expanded', String(estaAberto));
  });

  menu.addEventListener('click', (evento) => {
    if (!evento.target.closest('a')) return;
    menu.classList.remove('open');
    botaoMenu.setAttribute('aria-expanded', 'false');
  });
}

function iniciarReacoes(documento) {
  documento.querySelectorAll('[data-reaction-card]').forEach((cartao) => {
    cartao.addEventListener('click', (evento) => {
      const botaoSelecionado = evento.target.closest('[data-reaction]');
      if (!botaoSelecionado) return;

      const estavaAtivo = botaoSelecionado.getAttribute('aria-pressed') === 'true';
      cartao.querySelectorAll('[data-reaction]').forEach((botao) => {
        botao.setAttribute('aria-pressed', 'false');
      });
      botaoSelecionado.setAttribute('aria-pressed', String(!estavaAtivo));
    });
  });
}

function iniciarFormularioContato(documento) {
  const formulario = documento.querySelector('[data-contact-form]');
  const feedback = documento.querySelector('[data-contact-feedback]');
  if (!formulario || !feedback) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    feedback.textContent = '';

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      feedback.textContent = 'Confira os campos obrigatórios antes de continuar.';
      return;
    }

    feedback.textContent = 'Mensagem preparada! A integração de envio pode ser adicionada depois.';
    formulario.reset();
  });
}

function adicionarBolha(documento, areaMensagens, mensagem) {
  const bolha = documento.createElement('div');
  bolha.className = `chat-message ${mensagem.role}`;
  bolha.textContent = mensagem.content;
  areaMensagens.appendChild(bolha);
  areaMensagens.scrollTop = areaMensagens.scrollHeight;
  return bolha;
}

function iniciarChat(documento) {
  const botaoAbrir = documento.querySelector('[data-chat-launcher]');
  const botaoFechar = documento.querySelector('[data-chat-close]');
  const painel = documento.querySelector('[data-chat-panel]');
  const formulario = documento.querySelector('[data-chat-form]');
  const campo = documento.querySelector('[data-chat-input]');
  const areaMensagens = documento.querySelector('[data-chat-messages]');
  const status = documento.querySelector('[data-chat-status]');
  if (!botaoAbrir || !botaoFechar || !painel || !formulario || !campo || !areaMensagens || !status) return;

  const historico = [];
  const botaoEnviar = formulario.querySelector('button[type="submit"]');

  function alternarPainel(abrir) {
    painel.classList.toggle('open', abrir);
    painel.setAttribute('aria-hidden', String(!abrir));
    botaoAbrir.setAttribute('aria-expanded', String(abrir));
    if (abrir) campo.focus();
  }

  botaoAbrir.addEventListener('click', () => alternarPainel(!painel.classList.contains('open')));
  botaoFechar.addEventListener('click', () => alternarPainel(false));
  documento.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && painel.classList.contains('open')) alternarPainel(false);
  });

  campo.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Enter' || evento.shiftKey) return;
    evento.preventDefault();
    formulario.requestSubmit();
  });

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const conteudo = campo.value.trim();
    if (!conteudo) {
      status.textContent = 'Digite uma mensagem antes de enviar.';
      return;
    }

    status.textContent = '';
    const mensagemUsuario = criarMensagem('user', conteudo);
    historico.push(mensagemUsuario);
    adicionarBolha(documento, areaMensagens, mensagemUsuario);
    campo.value = '';
    campo.disabled = true;
    botaoEnviar.disabled = true;

    const digitando = adicionarBolha(documento, areaMensagens, {
      role: 'assistant typing',
      content: 'Digitando uma resposta…',
    });

    try {
      const resposta = await enviarConversa(historico);
      digitando.remove();
      const mensagemAssistente = criarMensagem('assistant', resposta);
      historico.push(mensagemAssistente);
      adicionarBolha(documento, areaMensagens, mensagemAssistente);
    } catch (erro) {
      digitando.remove();
      status.textContent = erro.message;
    } finally {
      campo.disabled = false;
      botaoEnviar.disabled = false;
      campo.focus();
    }
  });
}

function iniciarInterface(documento) {
  iniciarMenu(documento);
  iniciarReacoes(documento);
  iniciarFormularioContato(documento);
  iniciarChat(documento);
}

const SquadApp = { criarMensagem, enviarConversa, limitarHistorico };

if (typeof module !== 'undefined' && module.exports) module.exports = SquadApp;
if (typeof window !== 'undefined') window.SquadApp = SquadApp;
if (typeof document !== 'undefined') iniciarInterface(document);
