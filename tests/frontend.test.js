const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pastaAssets = path.join(__dirname, '..', 'assets');
const paginas = [
  'home',
  'sobre',
  'habilidades',
  'projetos',
  'servicos',
  'depoimentos',
  'case-de-sucesso',
  'contato',
];

test('cada página possui seu próprio CSS e os recursos compartilhados', () => {
  for (const pagina of paginas) {
    const caminhoHtml = path.join(pastaAssets, `${pagina}.html`);
    const caminhoCss = path.join(pastaAssets, 'styles', `${pagina}.css`);

    assert.equal(fs.existsSync(caminhoHtml), true, `${pagina}.html não existe`);
    assert.equal(fs.existsSync(caminhoCss), true, `${pagina}.css não existe`);

    const html = fs.readFileSync(caminhoHtml, 'utf8');
    const estilosImportados = [...html.matchAll(/href="styles\/([^"]+\.css)"/g)];

    assert.deepEqual(
      estilosImportados.map((resultado) => resultado[1]),
      [`${pagina}.css`],
      `${pagina}.html deve importar somente seu CSS`,
    );
    assert.match(html, new RegExp(`data-page="${pagina}"`));
    assert.match(html, /data-chat-launcher/);
    assert.match(html, /data-chat-panel/);
    assert.match(html, /data-chat-input[^>]+maxlength="500"/);
    assert.match(html, /src="scripts\/app\.js"/);
    assert.doesNotMatch(html, /sucessos\.html/);

    for (const destino of paginas) {
      assert.match(html, new RegExp(`href="${destino}\\.html"`));
    }
  }
});

test('cada CSS é completo, responsivo e inclui o chatbot', () => {
  for (const pagina of paginas) {
    const css = fs.readFileSync(
      path.join(pastaAssets, 'styles', `${pagina}.css`),
      'utf8',
    );

    assert.match(css, /:root\s*{/);
    assert.match(css, /\.chat-launcher/);
    assert.match(css, /@media\s*\(max-width:\s*900px\)/);
    assert.match(css, /@media\s*\(max-width:\s*640px\)/);
    assert.match(css, /prefers-reduced-motion/);
  }
});
