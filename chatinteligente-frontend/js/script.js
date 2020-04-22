let nome = '';
let chatId;

while (!nome || !nome.trim() || nome.length > 200 || nome.toLocaleLowerCase() === 'atendente') {
    nome = window.prompt('Informe seu nome:');
}

let input = document.getElementById("mensagem");
input.focus();

criarNovoChat();

async function criarNovoChat() {
    const response = await fetch('http://localhost:8080/api/chat/create', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const content = await response.json();
    chatId = content.id;
    await recuperarMensagensPorChat();
}

async function recuperarMensagensPorChat() {
    const response = await fetch(`http://localhost:8080/api/mensagem/findByChatId/${chatId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    const content = await response.json();
    document.getElementById("chat").innerHTML = '';
    let mensagem = '';
    content.forEach(it => {
        mensagem += `</img><p class="titulo-${it.usuario === 'Atendente' ? 'atendente' : 'cliente'}"><img style="width: 6%;" src="img/${it.usuario === 'Atendente' ? 'atendente' : 'sem-foto'}.jpg">&nbsp;${it.usuario} - ${formatarData(it.data)}</p> <p class="conteudo">Mensagem: ${it.mensagem}</p>`
    });
    document.getElementById("chat").innerHTML = mensagem;
    let textarea = document.getElementById('chat');
    textarea.scrollTop = textarea.scrollHeight;
}

async function enviarMensagem() {
    const mensagem = document.getElementById("mensagem").value;
    if (mensagem.trim()) {
        await fetch(`http://localhost:8080/api/mensagem`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: nome, mensagem: mensagem, chat: { id: chatId } })
        });
        await recuperarMensagensPorChat();
        document.getElementById("mensagem").value = '';
        input.focus();
    } else {
        alert('O campo mensagem é obrigatório.')
    }
}

function formatarData(data) {
    return `${formatarValor(data[2])}/${formatarValor(data[1])}/${data[0]} ${formatarValor(data[3])}:${formatarValor(data[4])}:${formatarValor(data[5])}`;
}

function formatarValor(valor) {
    return `${valor.toString().length === 1 ? '0' + valor : valor}`;
}

input.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("enviar").click();
    }
});