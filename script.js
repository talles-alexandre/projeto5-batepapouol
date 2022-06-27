const linkapi = "https://mock-api.driven.com.br/api/v6/uol";
let usuario;
const tempoconexao = 5000;
const tempomensagens = 3000;

function iniciarChat() {
  buscarMenssagens();

  setInterval(buscarMenssagens, 3000);
  setInterval(permaneceronline, 5000);
}

function permaneceronline() {
  axios.post(`${linkapi}/status`, { name: usuario });
}

function recarregar() {
  window.location.reload();
}
function entrarChat() {
  usuario = prompt("Qual seu lindo nome?");
  const promise = axios.post(`${linkapi}/participants`, { name: usuario });
  promise.then(iniciarChat);
  promise.catch(recarregar);
}

function buscarMenssagens() {
  const promise = axios.get(`${linkapi}/messages`);

  promise.then(renderizarMensagens);
}

function renderizarMensagens(resposta) {
  const mensagensContainer = document.querySelector(".mensagens-container");
  mensagensContainer.innerHTML = "";
  for (let i = 0; i < resposta.data.length; i++) {
    console.log(resposta.data[i].type);

    if (resposta.data[i].type === "status") {
      mensagensContainer.innerHTML += `
      
      <li class="entrada-saida">
            <span class="horario">(${resposta.data[i].time})</span>
            <strong>${resposta.data[i].from}</strong>
             <span>${resposta.data[i].text}</span>
      </li>
      `;
    }
    if (
      resposta.data[i].type === "private_message" &&
      (resposta.data[i].from === usuario ||
        resposta.data[i].to === usuario ||
        resposta.data[i].to === "Todos")
    ) {
      mensagensContainer.innerHTML += `  
      <li class="conversa-privada">
          <span class="horario">(${resposta.data[i].time})</span>
          <strong>${resposta.data[i].from}</strong>
          <span> reservadamente para </span>
          <strong>${resposta.data[i].to}: </strong>
          <span>${resposta.data[i].text}</span>
    </li>`;
    }
    if (resposta.data[i].type === "message") {
      mensagensContainer.innerHTML += `
      <li class="conversa-publica">
        <span class="horario">(${resposta.data[i].time})</span>
        <strong>${resposta.data[i].from}</strong>
        <span> para </span>
        <strong>${resposta.data[i].to}: </strong>
        <span>${resposta.data[i].text}</span>
      </li>`;
    }
  }

  scroll();
}

function scroll() {
  const lastMensagem = document.querySelector(
    ".mensagens-container li:last-child"
  );
  lastMensagem.scrollIntoView();
}

function enviarMensagem() {
  const texto = document.querySelector("input").value;

  const mensagem = {
    from: usuario,
    to: "Todos",
    text: texto,
    type: "message",
  };
  document.querySelector("input").value = "";
  const promise = axios.post(`${linkapi}/messages`, mensagem);

  promise.then(buscarMenssagens);

  promise.catch(recarregar);
}

entrarChat();
