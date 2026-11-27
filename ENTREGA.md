# Entrega - Avaliação 1 (Se Liga 2026) - Thayla Amaral

## Respostas do formulário

**Link do repositório do GitHub:**
https://github.com/thaylabonfim/3trimestre

**Link do site publicado no GitHub Pages:**
https://thaylabonfim.github.io/3trimestre/

**Capturas de tela da página final:**
https://drive.google.com/ (colar aqui o link da pasta com as capturas)

**Registro das cinco alterações e das explicações solicitadas:**
Estão nos tópicos 1 a 5 abaixo.

---

## 1. Menu de navegação novo (Etapa 1)

O menu antigo só tinha Início, Sobre, Contato e um "☰" escondendo duas páginas.
Foi refeito com base no tutorial de navbar do W3Schools
(<https://www.w3schools.com/css/css_navbar.asp>) e agora tem:

**Início · Sobre mim · Localização · Vídeos · Contato · Projetos ▾**

- **Início** → abre o arquivo `index.html`;
- **Sobre mim / Localização / Vídeos / Contato** → são âncoras (`#sobre`,
  `#localizacao`, `#videos`, `#contato`), que rolam até a seção dentro da própria
  página;
- **Projetos ▾** → é o menu suspenso (dropdown) com **Jogo da Memória** e
  **Certificados**, que abrem os arquivos `jogo.html` e `certificados.html`.

Para o link levar a uma seção, a seção precisa de um `id` com o mesmo nome:

```html
<li><a href="#localizacao">Localização</a></li>
...
<section class="secao" id="localizacao">
```

Nas páginas internas (`jogo.html` e `certificados.html`) os mesmos links
apontam para `index.html#localizacao`, porque a seção está na página inicial.

A barra é toda `flex`, o que deixa os itens lado a lado no computador:

```css
.menu-lista {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
```

## 2. Efeito `:hover` - como funciona

`:hover` é um **pseudo-classe**: ela aplica o estilo quando o mouse está em cima
do elemento, sem precisar de JavaScript e sem clique. Quando o mouse sai, o
estilo volta ao normal.

```css
.menu-lista a:hover,
.btn-dropdown:hover {
  background-color: #D81B60;  /* rosa mais forte */
  color: #FFFFFF;
}
```

Para o efeito não ser seco, coloquei uma `transition` no estado normal do link,
que faz a cor "misturar" em 0,25 s:

```css
.menu-lista a {
  transition: background-color 0.25s ease, color 0.25s ease;
}
```

Também usei `:hover` nos cartões dos amigos (`transform: translateY(-4px)`, que
levanta o cartão) e no botão do Google Maps.

## 3. Menu suspenso (dropdown) - trecho responsável

Base: <https://www.w3schools.com/css/css_dropdowns.asp>

O submenu fica dentro de uma `<li class="dropdown">`. A lista começa escondida e
aparece quando o mouse passa em cima do pai:

```css
.submenu {
  display: none;        /* escondido */
  position: absolute;   /* flutua abaixo do menu, sem empurrar o conteúdo */
  top: 100%;
  left: 0;
}
.dropdown:hover .submenu {
  display: block;       /* aparece no hover */
}
```

A parte que **realmente faz o menu suspenso funcionar** é o seletor
`.dropdown:hover .submenu`: o `.dropdown` é o pai (o item "Projetos") e o
`.submenu` é o filho. O `position: absolute` + `top: 100%` é o que faz o
submenu aparecer exatamente embaixo do item, por cima da página.

No celular não existe mouse, então o `script.js` resolve com clique: ele
alterna a classe `.aberto` no item e atualiza o `aria-expanded`, e também fecha
o submenu quando a pessoa clica fora ou aperta `Esc`.

## 4. Seção de localização (Etapa 2)

Endereço fictício criado para a atividade:

> Rua das Acácias, 245 - Portão, Curitiba - PR, 81070-000

O botão "Abrir no Google Maps" é um link normal que usa a busca do Maps:

```html
<a class="botao" href="https://www.google.com/maps/search/?api=1&query=Rua+das+Ac%C3%A1cias+245+Port%C3%A3o+Curitiba+PR" target="_blank" rel="noopener">
```

Usar `search/?api=1&query=` funciona sem precisar de chave de API, e o
`target="_blank"` abre em outra aba para não fazer o visitante perder o site.

## 5. Seção de vídeos (Etapa 2)

Dois vídeos do YouTube ligados aos meus interesses:

1. **5 coisas que você precisa saber sobre a Fisioterapia** (canal Anatomia e
   etc.) - `https://www.youtube.com/watch?v=4QGZk_PrQ1o`
2. **Como criar um site fácil! HTML, CSS e JavaScript para iniciantes**
   (Tech Daniel's) - `https://www.youtube.com/watch?v=g51whzji0h4`

Nos vídeos eu **não usei o `<iframe>`**.

Testei primeiro o código de incorporar do YouTube, mas o player aparecia como um
retângulo cinza, porque o navegador bloqueia o carregamento do YouTube dentro da
página (bloqueador de anúncios, extensão de privacidade e a rede). Testei também
o domínio `youtube-nocookie.com` e o `loading="lazy"`, e o resultado mudava de
acordo com o navegador.

A solução foi usar a **miniatura oficial do vídeo como imagem clicável**: o
elemento `<a>` em volta da imagem já abre o vídeo no YouTube em outra aba.

```html
<a class="video-capa" href="https://www.youtube.com/watch?v=4QGZk_PrQ1o" target="_blank" rel="noopener">
  <img src="https://i.ytimg.com/vi/4QGZk_PrQ1o/hqdefault.jpg"
       alt="Miniatura do vídeo 5 coisas que você precisa saber sobre a Fisioterapia">
  <span class="video-play">▶</span>
</a>
```

- `https://i.ytimg.com/vi/ID/hqdefault.jpg` é a miniatura que o próprio YouTube
  guarda para cada vídeo - só troca o `ID` para usar outro vídeo;
- `target="_blank"` abre em outra aba e `rel="noopener"` é a boa prática de
  segurança para links externos;
- o `<span class="video-play">▶</span>` é o botão de play desenhado com CSS
  (`border-radius: 50%` + `position: absolute` centralizado), sem imagem extra;
- como é um `<a>` normal, funciona em qualquer navegador, sem depender de player.

## Registro das correções feitas nos testes

**Correção 1 - nome das imagens com espaço.**
As fotos estavam com nome `WhatsApp Image 2026-11-06 at 11.22.33.jpeg`. Espaço
em nome de arquivo vira `%20` na URL e o link quebra em alguns servidores, como
o GitHub Pages. Renomeei todos para nomes curtos e sem acento
(`foto-bella.jpeg`, `icone-whatsapp.jpeg`, `logo.png` etc.) e atualizei o `src`
de todas as páginas.

**Correção 2 - título da seção escondido atrás do menu.**
Como o menu agora fica fixo no topo (`position: sticky`), ao clicar em
"Localização" a página rolava e o título da seção ficava atrás da barra. Resolvi
com `scroll-margin-top`, que é a margem que o navegador respeita na hora de
parar a rolagem:

```css
section[id] {
  scroll-margin-top: 90px;
}
```

**Correção 3 - vídeos que não carregavam.**
Os vídeos com `<iframe>` apareciam como um retângulo cinza, porque o navegador
bloqueava o carregamento do YouTube dentro da página. Troquei o `<iframe>` por
uma **miniatura clicável** (imagem do `i.ytimg.com` dentro de um `<a>`), que abre
o vídeo no YouTube e funciona em qualquer navegador.

**Correção 4 - vídeo com proporção errada no celular.**
Na versão com `<iframe>` eu tinha usado `width="560" height="315"` fixos, e em
tela pequena o vídeo estourava a largura da página criando rolagem horizontal.
Na versão final a imagem da miniatura usa `width: 100%`, então ela se ajusta
sozinha ao tamanho do cartão.

**Correção 5 - contador de pares do jogo.**
O placar mostrava "Pares: 0 / 8" escrito na mão no HTML, então se eu mudasse os
símbolos o número ficava errado. Agora o total vem do próprio array do `jogo.js`.

---

## Arquivos do projeto

| Página | O que tem |
|---|---|
| `index.html` | banner, Sobre mim, Localização, Vídeos, Meus Amigos e Contato |
| `jogo.html` | jogo da memória (JavaScript) |
| `certificados.html` | lista de certificados |
| `style.css` | todo o estilo, incluindo menu, dropdown e `:hover` |
| `script.js` | abre e fecha o menu suspenso no clique |
| `jogo.js` | lógica do jogo da memória |

## Pastas de capturas para o Google Drive

1. `01-menu.png` - menu completo com os 5 itens + Projetos
2. `02-submenu.png` - menu suspenso aberto
3. `03-localizacao.png` - seção de localização com o endereço e o botão
4. `04-videos.png` - a seção de vídeos com as duas miniaturas
5. `05-pagina-final.png` - página inteira (pode usar a opção "página inteira"
   do print do navegador)
