# Thayla Amaral · Portfólio

Site pessoal e portfólio de **Thayla Amaral**, estudante do curso técnico em
Desenvolvimento de Sistemas em Curitiba (PR). O projeto reúne apresentação,
trajetória de estudos, certificados, um jogo Tetris completo e um canal de contato.

Construído com **HTML, CSS e JavaScript puros** — sem frameworks, sem build e sem
dependências de produção. Basta abrir no navegador.

---

## Sumário

- [Visão geral](#visão-geral)
- [Demonstração](#demonstração)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
- [Verificações automáticas](#verificações-automáticas)
- [Identidade visual](#identidade-visual)
- [O jogo Tetris](#o-jogo-tetris)
- [Acessibilidade](#acessibilidade)
- [Desempenho](#desempenho)
- [Publicação](#publicação)
- [Checklist de qualidade](#checklist-de-qualidade)
- [Licença](#licença)

---

## Visão geral

| Item | Detalhe |
| --- | --- |
| Tipo | Site institucional pessoal / portfólio escolar |
| Stack | HTML5 semântico, CSS3 (Grid, Flexbox, custom properties), JavaScript ES5+ |
| Páginas | Início, Sobre, Jogo, Certificados, Contato, Privacidade, 404 |
| Dependências | Nenhuma (apenas Google Fonts por CDN) |
| Build | Não necessário |
| Hospedagem | GitHub Pages (via GitHub Actions) |
| Qualidade | html-validate + Node `--check` |

Recursos implementados:

- Layout responsivo de 320 px a telas ultrawide;
- Menu móvel acessível (teclado, `Esc`, clique fora, foco visível);
- Animações de entrada com `IntersectionObserver` e respeito a
  `prefers-reduced-motion`;
- Metadados completos: descrição, Open Graph, Twitter Card, JSON-LD e favicon;
- Formulário validado que gera uma mensagem pronta no WhatsApp;
- Jogo Tetris com placar, níveis, recorde local e controles por toque;
- Política de privacidade alinhada à LGPD;
- Imagens otimizadas (de ~3,2 MB para ~0,9 MB).

---

## Demonstração

Depois de publicar (veja [Publicação](#publicação)), o site fica em:

```
https://thaylabonfim.github.io/3trimestre/
```

---

## Estrutura do projeto

```
.
├── index.html               # Página inicial
├── sobre.html               # Trajetória, habilidades e objetivos
├── jogo.html                # Tetris jogável + bastidores do projeto
├── certificados.html        # Formações, com filtro por categoria
├── contato.html             # Canais e formulário
├── privacidade.html         # Política de privacidade (LGPD)
├── 404.html                 # Página de erro
├── site.webmanifest         # Instalação como app no celular
├── robots.txt               # Diretrizes para buscadores
├── sitemap.xml              # Mapa do site
├── assets/
│   ├── css/
│   │   └── style.css        # Design system + todos os componentes
│   ├── js/
│   │   ├── main.js          # Navegação, animações, formulário
│   │   ├── tetris.js        # Motor do jogo
│   │   └── certificados.js  # Filtro da página de certificados
│   └── img/                 # Imagens otimizadas, ícones e OG image
├── .github/workflows/
│   └── deploy.yml           # Publicação automática no GitHub Pages
├── package.json             # Scripts de desenvolvimento e validação
├── .htmlvalidate.json       # Regras de validação do HTML
├── .editorconfig
├── .gitignore
└── LICENSE
```

---

## Como rodar localmente

O site é 100% estático, então qualquer servidor HTTP funciona.

**Com Python (já instalado na maioria dos sistemas):**

```bash
python3 -m http.server 3000
```

**Com Node.js:**

```bash
npm run dev
# ou: npx serve .
```

Depois abra `http://localhost:3000`.

> As fontes são carregadas do Google Fonts. Sem conexão, o site usa as fontes
> alternativas do sistema sem quebrar o layout.

> Abrir o `index.html` direto pelo sistema de arquivos também funciona, mas o
> `site.webmanifest` e os caminhos relativos são melhor testados com um servidor.

---

## Como editar o conteúdo

### Textos

Cada página é um arquivo HTML independente. Os blocos estão comentados com
`<!-- ... -->` para facilitar a localização.

### Cabeçalho e rodapé

São repetidos em todas as páginas (site estático sem build). Ao alterar um item de
menu, faça a troca nos arquivos `index.html`, `sobre.html`, `jogo.html`,
`certificados.html`, `contato.html` e `privacidade.html`, mantendo
`aria-current="page"` apenas no link da página atual.

### Contato

O número de WhatsApp e os perfis sociais aparecem em dois lugares:

- `assets/js/main.js` → constante `NUMERO_WHATSAPP` (envio do formulário);
- links `https://wa.me/...` e redes sociais no HTML.

Formato do WhatsApp: código do país + DDD + número, apenas dígitos
(`5541999277308`).

### Número de WhatsApp e redes sociais

O telefone aparece em dois formatos: exibido na interface
(`(41) 99927-7308`) e em formato de link (`5541999277308`). Ao trocar o número,
atualize **os dois** em todas as páginas e a constante `NUMERO_WHATSAPP` em
`assets/js/main.js`.

Os perfis `@thaylabonfim` de Instagram e Facebook são o preenchimento padrão:
confirme se estão corretos antes de publicar.

### Certificados

Cada formação é um `<article class="certificado">` com o atributo
`data-categoria` (`escolar`, `cursos` ou `projetos`). Para adicionar:

1. Copie um cartão existente;
2. Atualize título, instituição, período, descrição e o selo de status
   (`selo--concluido`, `selo--andamento` ou `selo--projeto`);
3. Ajuste os totais exibidos no topo da página (formações, em andamento,
   concluídas).

> Os cursos livres da página de certificados são exemplos de estrutura. Troque os
> títulos e as datas pelos cursos realmente concluídos.

### Imagens

Todas ficam em `assets/img/`. Recomendações:

- Fotos na vertical: 900 px de largura, proporção 3:4;
- Retrato principal: 900 × 1600;
- Exportar em JPEG qualidade 80–85 ou WebP;
- Sempre preencher `width`, `height` e `alt` descritivo.

---

## Verificações automáticas

O projeto tem um check de qualidade que pode rodar antes de cada commit:

```bash
npm install          # instala apenas a ferramenta de validação (devDependency)
npm run validate     # valida o HTML de todas as páginas
npm run check:js     # verifica a sintaxe dos arquivos JavaScript
```

O `html-validate` está configurado em `.htmlvalidate.json` com as regras
recomendadas, incluindo acessibilidade (WCAG), proibição de estilos inline e
exigência de `alt` em imagens.

## Identidade visual

A paleta nasce da paixão pelo Palmeiras (verde e creme) combinada ao rosa dos
projetos originais. Os tokens estão em `assets/css/style.css`, no bloco `:root`:

| Token | Cor | Uso |
| --- | --- | --- |
| `--verde-900` | `#062a20` | Fundos escuros, rodapé |
| `--verde-600` | `#12664a` | Links, detalhes, ícones |
| `--creme` | `#fbf8f1` | Fundo principal |
| `--rosa-500` | `#d77a98` | Ênfase, selos, botões secundários |
| `--dourado` | `#c2a15c` | Linhas decorativas, numeração |

Tipografia:

- **Fraunces** (serifada) para títulos e números;
- **Inter** (sans-serif) para textos e interface.

Para trocar a fonte, edite o `<link>` do Google Fonts e as variáveis
`--fonte-titulo` e `--fonte-texto`.

---

## O jogo Tetris

`assets/js/tetris.js` implementa o jogo sem bibliotecas:

- Matrizes para peças e tabuleiro (10 × 20);
- Colisão, rotação com ajuste lateral e peça fantasma;
- Sorteio **7-bag** (cada peça aparece uma vez por rodada);
- Pontuação clássica (100/300/500/800 × nível), níveis a cada 10 linhas;
- `requestAnimationFrame` para a queda e `localStorage` para o recorde;
- Atalhos: `←` `→` mover, `↑` girar, `↓` descer, `Espaço` soltar, `P` pausar;
- Botões em tela para celular e pausa automática ao trocar de aba.

---

## Acessibilidade

- Estrutura semântica (`header`, `nav`, `main`, `section`, `footer`) e hierarquia
  correta de títulos;
- Link "Pular para o conteúdo" e foco visível em todos os elementos interativos;
- `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-live` e `aria-label` nos
  componentes que mudam de estado;
- Contraste mínimo AA para textos e botões;
- Respeito a `prefers-reduced-motion`;
- Textos alternativos descritivos em todas as imagens.

---

## Desempenho

- Imagens redimensionadas e comprimidas (~0,9 MB no total);
- `loading="lazy"` nas imagens abaixo da dobra e `fetchpriority="high"` no retrato
  principal;
- Fontes com `display=swap` e `preconnect`;
- CSS e JavaScript únicos por página, sem frameworks;
- Sem bibliotecas de terceiros.

---

## Publicação

O workflow `.github/workflows/deploy.yml` publica o site automaticamente a cada
push na branch `main`.

1. Envie o projeto para o GitHub;
2. Em **Settings → Pages**, selecione **Source: GitHub Actions**;
3. Faça um push na `main` e acompanhe em **Actions**.

Se o endereço final for diferente de `https://thaylabonfim.github.io/3trimestre/`,
atualize as URLs absolutas de `<link rel="canonical">`, Open Graph, `sitemap.xml`
e `robots.txt`.

---

## Checklist de qualidade

- [x] HTML validado com `html-validate` (0 erros)
- [x] JavaScript verificado com `node --check`
- [x] Layout testado em celular, tablet e desktop
- [x] Navegação por teclado e foco visível
- [x] Contraste e textos alternativos
- [x] Metadados sociais e favicons
- [x] `robots.txt` e `sitemap.xml`
- [x] Página 404 personalizada
- [x] Política de privacidade
- [x] JavaScript sem dependências e com verificação de sintaxe
- [x] Imagens otimizadas

---

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).

Fotografias e textos pessoais não podem ser reutilizados sem autorização.

---

Feito com cuidado por Thayla Amaral · Curitiba, 2026.
