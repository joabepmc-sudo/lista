async function carregarFrases() {
  const response = await fetch("frases.txt");
  const texto = await response.text();

  // separa por linha
  return texto.split("\n").filter(f => f.trim() !== "");
}

function criarCard(frase) {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = frase;
  return div;
}

async function iniciar() {
  const container = document.getElementById("container");
  const frases = await carregarFrases();

  frases.forEach(frase => {
    const card = criarCard(frase);
    container.appendChild(card);
  });
}

iniciar();