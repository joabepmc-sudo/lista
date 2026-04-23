let frases = [];
let indexAtual = 0;

let revisao = JSON.parse(localStorage.getItem("revisao")) || [];
let acertos = parseInt(localStorage.getItem("acertos")) || 0;

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function carregarFrases(arquivo) {
  const res = await fetch(arquivo);
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

/* foguetes */
function soltarFoguetes() {
  for (let i = 0; i < 6; i++) {
    const foguete = document.createElement("div");
    foguete.className = "foguete";
    foguete.textContent = "🚀";

    const posX = Math.random() * 100;
    foguete.style.left = posX + "vw";

    document.body.appendChild(foguete);

    setTimeout(() => {
      foguete.remove();

      const explosao = document.createElement("div");
      explosao.className = "explosao";
      explosao.textContent = "🎆";

      explosao.style.left = posX + "vw";
      explosao.style.top = "30vh";

      document.body.appendChild(explosao);

      setTimeout(() => explosao.remove(), 800);
    }, 1200);
  }
}

/* botões */
document.getElementById("nextBtn").onclick = () => irPara(indexAtual + 1);
document.getElementById("prevBtn").onclick = () => irPara(indexAtual - 1);

document.getElementById("knowBtn").onclick = () => {
  acertos++;
  localStorage.setItem("acertos", acertos);

  if (acertos % 10 === 0) {
    soltarFoguetes();
  }

  frases.splice(indexAtual, 1);
  renderizar();
  irPara(indexAtual);
};

document.getElementById("reviewBtn").onclick = () => {
  revisao.push(frases[indexAtual]);
  localStorage.setItem("revisao", JSON.stringify(revisao));
  irPara(indexAtual + 1);
};

document.getElementById("resetBtn").onclick = () => {
  localStorage.clear();
  location.reload();
};

window.addEventListener("scroll", () => {
  indexAtual = Math.round(window.scrollY / window.innerHeight);
  atualizarProgresso();
});

/* 🎯 seleção de matéria */
document.querySelectorAll(".materia").forEach(btn => {
  btn.onclick = async () => {
    const arquivo = btn.dataset.arquivo;

    document.getElementById("home").style.display = "none";
    document.getElementById("app").style.display = "block";

    frases = embaralhar(await carregarFrases(arquivo));

    if (revisao.length > 0) {
      frases = [...revisao, ...frases];
      revisao = [];
      localStorage.removeItem("revisao");
    }

    renderizar();
  };
});
