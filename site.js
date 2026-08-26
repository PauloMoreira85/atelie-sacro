/* =============================================================================
   CONFIGURE AQUI — troque pelos dados reais do negócio
   ============================================================================= */
const CONFIG = {
  whatsapp: "5500000000000",              // PLACEHOLDER: DDI+DDD+número, só dígitos
  email:    "contato@ateliesacro.com.br"  // PLACEHOLDER
};
/* ========================================================================== */

const mini  = n => "img/" + n + ".webp";
const grande = n => "img/" + n + "-g.webp";
const zap = txt => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(txt);

/* ---- contadores ---- */
const TOTAL = SECOES.reduce((a, s) => a + s.itens.length, 0);
document.getElementById("n-pecas").textContent = TOTAL;
document.getElementById("n-secoes").textContent = SECOES.length;

/* ---- contatos ---- */
document.getElementById("cta-whats").href = zap("Olá! Vi o site do Ateliê Sacro e gostaria de um orçamento.");
document.getElementById("cta-mail").href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Orçamento - Ateliê Sacro");

/* ---- mosaico do hero ---- */
const destaque = [];
["Crucifixos e Medalhões", "Imagens de Santos", "Linha Infantil", "Presépios"].forEach(nome => {
  const s = SECOES.find(x => x.nome === nome);
  if (s && s.itens.length) destaque.push(s.itens[Math.min(2, s.itens.length - 1)]);
});
document.getElementById("mosaico").innerHTML = destaque.map((p, i) =>
  `<figure><img src="${mini(p.img[0])}" alt="${p.nome}" width="620" height="620"${i > 1 ? ' loading="lazy"' : ""}></figure>`
).join("");

/* ---- navegação ---- */
document.getElementById("navsec").innerHTML = SECOES.map(s =>
  `<a href="#${s.id}" data-alvo="${s.id}">${s.nome}</a>`
).join("");

/* ---- seções ---- */
const svgLupa = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="10.6" cy="10.6" r="6.4"/><path d="M15.4 15.4L20 20"/></svg>';

document.getElementById("secoes").innerHTML = SECOES.map((s, si) => `
  <section class="secao" id="${s.id}">
    <div class="secao-cab rev">
      <span class="secao-num">${s.n}</span>
      <div class="secao-tit">
        <h2>${s.nome}</h2>
        <p>${s.sub}</p>
      </div>
      <span class="secao-cont">${s.itens.length} ${s.itens.length === 1 ? "peça" : "peças"}</span>
    </div>
    <div class="grade">
      ${s.itens.map((p, pi) => `
        <button class="peca rev" data-s="${si}" data-p="${pi}">
          <span class="peca-img">
            <img src="${mini(p.img[0])}" alt="${p.nome}" width="620" height="620" loading="lazy" decoding="async">
            <span class="peca-lupa">${svgLupa}</span>
          </span>
          <span class="peca-txt">
            <h3>${p.nome}</h3>
            <p>${p.desc}</p>
            <span class="tags"><span class="tag">${s.nome}</span></span>
          </span>
        </button>`).join("")}
    </div>
  </section>`).join("");

/* ---- lightbox ---- */
const lb = document.getElementById("lb");
let atual = { s: 0, p: 0, i: 0 };

const LISTA = [];
SECOES.forEach((s, si) => s.itens.forEach((p, pi) => LISTA.push({ s: si, p: pi })));
const indiceDe = (s, p) => LISTA.findIndex(x => x.s === s && x.p === p);

function pintar() {
  const s = SECOES[atual.s], p = s.itens[atual.p];
  const img = document.getElementById("lb-img");
  img.src = grande(p.img[atual.i]);
  img.alt = p.nome;
  document.getElementById("lb-sec").textContent = s.n + " · " + s.nome;
  document.getElementById("lb-tit").textContent = p.nome;
  document.getElementById("lb-desc").textContent = p.desc;
  document.getElementById("f-sec").textContent = s.nome;
  document.getElementById("lb-whats").href = zap('Olá! Tenho interesse na peça "' + p.nome + '" (' + s.nome + "). Pode me passar valores?");
  document.getElementById("lb-minis").innerHTML = p.img.length > 1
    ? p.img.map((n, i) => `<button data-i="${i}" class="${i === atual.i ? "ativa" : ""}" aria-label="Foto ${i + 1}"><img src="${mini(n)}" alt=""></button>`).join("")
    : "";
  // pré-carregar vizinhas
  const k = indiceDe(atual.s, atual.p);
  [k - 1, k + 1].forEach(j => {
    const v = LISTA[(j + LISTA.length) % LISTA.length];
    if (v) new Image().src = grande(SECOES[v.s].itens[v.p].img[0]);
  });
}

function abrir(s, p) {
  atual = { s, p, i: 0 };
  pintar();
  lb.classList.add("aberto");
  document.body.style.overflow = "hidden";
  document.getElementById("lb-x").focus();
}
function fechar() {
  lb.classList.remove("aberto");
  document.body.style.overflow = "";
}
function mover(d) {
  let k = indiceDe(atual.s, atual.p) + d;
  if (k < 0) k = LISTA.length - 1;
  if (k >= LISTA.length) k = 0;
  atual = { s: LISTA[k].s, p: LISTA[k].p, i: 0 };
  pintar();
}

document.addEventListener("click", e => {
  const peca = e.target.closest(".peca");
  if (peca) { abrir(+peca.dataset.s, +peca.dataset.p); return; }
  const m = e.target.closest("#lb-minis button");
  if (m) { atual.i = +m.dataset.i; pintar(); }
});
document.getElementById("lb-x").onclick = fechar;
document.getElementById("lb-ant").onclick = () => mover(-1);
document.getElementById("lb-prox").onclick = () => mover(1);
lb.addEventListener("click", e => { if (e.target === lb) fechar(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("aberto")) return;
  if (e.key === "Escape") fechar();
  if (e.key === "ArrowLeft") mover(-1);
  if (e.key === "ArrowRight") mover(1);
});

/* ---- revelação + seção ativa ---- */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".rev").forEach((el, i) => {
  el.style.transitionDelay = Math.min(i % 8, 5) * 26 + "ms";
  io.observe(el);
});

const links = [...document.querySelectorAll("#navsec a")];
const spy = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle("ativo", a.dataset.alvo === e.target.id));
    const at = links.find(a => a.classList.contains("ativo"));
    if (at) at.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  });
}, { rootMargin: "-120px 0px -70% 0px" });
document.querySelectorAll(".secao").forEach(s => spy.observe(s));
