window.addEventListener("load", function () {
  window.scrollTo(0, 0);
  verificarHorario(); // Garante que o status é verificado ao carregar
});

//Função de mostrar horário se está aberto ou fechado
function verificarHorario() {
  const agora = new Date();
  const hora = agora.getHours();
  const statusElemento = document.getElementById("status-horario");

  if (!statusElemento) return;

  if (hora >= 8 && hora < 23) {
    statusElemento.textContent = "ABERTO";
    statusElemento.classList.remove("fechado");
    statusElemento.classList.add("aberto");
  } else {
    statusElemento.textContent = "FECHADO";
    statusElemento.classList.remove("aberto");
    statusElemento.classList.add("fechado");
  }
}

//barra de categorias e rolagem para categoria
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Envio do formulário da reserva
const formReserva = document.querySelector(".reserva-form");
if (formReserva) {
  formReserva.addEventListener("submit", function (e) {
    e.preventDefault();

    const pessoas = document.getElementById("pessoas").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if (pessoas && data && hora) {
      // SALVANDO NO LOCALSTORAGE
      localStorage.setItem('reservaPessoas', pessoas);
      localStorage.setItem('reservaData', data);
      localStorage.setItem('reservaHora', hora);

      window.location.href = "sobre-a-reserva.html";
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  });
}

// Botão de criar reserva
const botaoCriarReserva = document.querySelector(".btn-criar-reserva");
if (botaoCriarReserva) {
  botaoCriarReserva.addEventListener("click", function () {
    window.location.href = "sua-reserva.html";
  });
}


// SUA RESERVA SCRIPT
document.addEventListener('DOMContentLoaded', function () {
  const pessoas = localStorage.getItem('reservaPessoas');
  const data = localStorage.getItem('reservaData');
  const hora = localStorage.getItem('reservaHora');

  function formatarDataBR(dataISO) {
    if (!dataISO) return '--';
    const partes = dataISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  document.getElementById('res-pessoas').textContent = pessoas || '--';
  document.getElementById('res-data').textContent = formatarDataBR(data);
  document.getElementById('res-hora').textContent = hora || '--';
});
// CANCELAR RESERVA

function mostrarConfirmacao() {
  document.getElementById("confirmacao-cancelamento").style.display = "block";
}

function fecharModal() {
  document.getElementById("confirmacao-cancelamento").style.display = "none";
}

function cancelarReserva() {
  // Zera os dados
  document.getElementById("res-pessoas").textContent = "--";
  document.getElementById("res-data").textContent = "--";
  document.getElementById("res-hora").textContent = "--";

  // Mostra confirmação
  alert("Reserva cancelada com sucesso.");

  // Redireciona para a página de reserva
  window.location.href = "reserva.html";
}
//MODAL MENU
function abrirModal(nome, descricao, imagem, valor) {
  document.getElementById("modalProduto").classList.add("ativo");
  document.getElementById("modalNome").innerText = nome;
  document.getElementById("modalDescricao").innerText = descricao;
  document.getElementById("modalPreco").innerText = `R$ ${valor.toFixed(2)}`;
  document.querySelector(".img-produto").src = imagem;
  document.getElementById("qtd").innerText = 1;
  document.getElementById("modalTotal").innerText = `R$ ${valor.toFixed(2)}`;
  qtd = 1;
  preco = valor;
}

function fecharModal() {
  document.getElementById("modalProduto").classList.remove("ativo");
}

function alterarQtd(valor) {
  qtd += valor;
  if (qtd < 1) qtd = 1;
  document.getElementById("qtd").innerText = qtd;
  document.getElementById("modalTotal").innerText = `R$ ${(qtd * preco).toFixed(2)}`;
}

function adicionarAoCarrinho() {
  alert("Adicionado ao carrinho!");
  fecharModal();
}

// Ativação da opção de fundo no rodapé
document.addEventListener("DOMContentLoaded", () => {
  const footerLinks = document.querySelectorAll(".footer a");
  let currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (currentPage === "" || currentPage === "index" || currentPage === "index.html") {
    currentPage = "index.html";
  }

  footerLinks.forEach(link => {
    const href = link.getAttribute("href").toLowerCase();

    // Normaliza ambos para garantir comparação correta
    const hrefSemExtensao = href.replace(".html", "");
    const paginaSemExtensao = currentPage.replace(".html", "");

    // Ramificações de perfil.html
    const ramificacoesPerfil = ["perfil", "criar-conta", "esqueceu-senha"];
    // Ramificações de reserva.html
    const ramificacoesReserva = ["reserva", "sobre-a-reserva", "sua-reserva"];

    if (
      ramificacoesPerfil.includes(paginaSemExtensao) &&
      hrefSemExtensao === "perfil"
    ) {
      link.classList.add("active-footer");
    }

    if (
      ramificacoesReserva.includes(paginaSemExtensao) &&
      hrefSemExtensao === "reserva"
    ) {
      link.classList.add("active-footer");
    }

    // Página padrão (ex: index.html)
    if (paginaSemExtensao === hrefSemExtensao) {
      link.classList.add("active-footer");
    }
  });
});

// ADICIONAR AO CARRINHO E VERIFICAÇÃO PARA VER SE JÁ TEM O ITEM E ADICIONAR QUANTIDADE NO MESMO
function adicionarAoCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const nome = document.getElementById("modalNome").textContent;
  const preco = parseFloat(document.getElementById("modalPreco").textContent.replace("R$", "").replace(",", "."));
  const imagem = document.querySelector(".img-produto").src;
  const qtd = parseInt(document.getElementById("qtd").textContent);
  const total = preco * qtd;

  // Verifica se o produto já está no carrinho
  const indexExistente = carrinho.findIndex(item => item.nome === nome);

  if (indexExistente !== -1) {
    // Se já existe, só atualiza a quantidade e o total
    carrinho[indexExistente].qtd += qtd;
    carrinho[indexExistente].total = carrinho[indexExistente].qtd * preco;
  } else {
    // Se não existe, adiciona novo
    carrinho.push({
      nome,
      imagem,
      qtd,
      total
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  fecharModal(); // opcional, se quiser fechar o modal

  // Mostrar mensagem de sucesso (se tiver implementado)
  const mensagem = document.querySelector(".mensagem-adicionado");
  if (mensagem) {
    mensagem.classList.add("mostrar");
    setTimeout(() => mensagem.classList.remove("mostrar"), 2000);
  }
  // Exibir mensagem temporária
  const msg = document.getElementById("mensagemAdicionado");
  msg.classList.add("mostrar");

  setTimeout(() => {
    msg.classList.remove("mostrar");
  }, 2000); // 2 segundos
}
