# Ateliê Sacro

Site institucional e catálogo de arte católica em impressão 3D.
**Produção:** https://ateliesacro.com.br

92 peças em 13 seções. Site estático — sem build, sem dependências.

## Configurar os contatos

Os dados de contato estão no topo de `site.js`, marcados como `PLACEHOLDER`:

```js
const CONFIG = {
  whatsapp: "5500000000000",              // DDI+DDD+número, só dígitos
  email:    "contato@ateliesacro.com.br"
};
```

O WhatsApp usa o formato internacional sem símbolos. Exemplo para um número
de São Paulo `(11) 91234-5678`: `5511912345678`.

Cada peça gera automaticamente uma mensagem com o nome do produto.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Página única, com SEO e dados estruturados |
| `estilo.css` | Estilos |
| `site.js` | Interações e configuração de contato |
| `dados.js` | Catálogo (seções, peças, descrições) — **gerado** |
| `img/` | Fotos: `nome.webp` (grade) e `nome-g.webp` (ampliada) |

## Alterar o catálogo

`dados.js` é gerado a partir do acervo de modelos 3D. Para mexer no texto de
uma peça (nome ou descrição), pode editar direto o `dados.js` — é um array
simples. Para adicionar ou remover peças, o ideal é regerar o arquivo.

Cada peça tem:

```js
{"nome":"...", "desc":"...", "fmt":["STL"], "img":["slug-da-imagem"]}
```

O campo `img` guarda o nome-base do arquivo; o site monta `img/<base>.webp`
para a grade e `img/<base>-g.webp` para a ampliação.

## Deploy

Hospedado na Vercel, com deploy automático a cada push na branch `main`.
Não há etapa de build: os arquivos são servidos como estão.

## Acervo dos modelos 3D

Os arquivos STL/OBJ ficam **fora deste repositório** (são ~4 GB), organizados
por seção em `Atelie Sacro/Acervo/`.
