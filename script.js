let frases = [];
let indexAtual = 0;
let revisao = JSON.parse(localStorage.getItem("revisao")) || [];

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function carregarFrases() {
  const res = await fetch("frases.txt");
  const texto = await res.text();
  return texto.split("\n").filter(f => f.trim() !== "");
}

function atualizarProgresso() {
  document.getElementById("progresso").textContent =
    `${indexAtual + 1} / ${frases.length}`;
}

function criarCard(frase) {
  const div = document.createElement("div");
  div.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";
  inner.textContent = frase;

  div.appendChild(inner);
  return div;
}

function renderizar() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  frases.forEach(f => {
    container.appendChild(criarCard(f));
  });

  atualizarProgresso();
}

function irPara(index) {
  indexAtual = Math.max(0, Math.min(index, frases.length - 1));

  window.scrollTo({
    top: indexAtual * window.innerHeight,
    behavior: "smooth"
  });

  atualizarProgresso();
}

document.getElementById("nextBtn").onclick = () => irPara(indexAtual + 1);
document.getElementById("prevBtn").onclick = () => irPara(indexAtual - 1);

document.getElementById("knowBtn").onclick = () => {
  frases.splice(indexAtual, 1);
  renderizar();
  irPara(indexAtual);
};

document.getElementById("reviewBtn").onclick = () => {
  revisao.push(frases[indexAtual]);
  localStorage.setItem("revisao", JSON.stringify(revisao));
  irPara(indexAtual + 1);
};

window.addEventListener("scroll", () => {
  indexAtual = Math.round(window.scrollY / window.innerHeight);
  atualizarProgresso();
});

async function iniciar() {
  frases = embaralhar(await carregarFrases());

  // coloca frases de revisão no início
  if (revisao.length > 0) {
    frases = [...revisao, ...frases];
    revisao = [];
    localStorage.removeItem("revisao");
  }

  renderizar();
}

iniciar();
