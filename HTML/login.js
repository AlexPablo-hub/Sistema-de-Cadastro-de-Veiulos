 $(document).ready(function () {
    // Selecione o formulário por ID
    $("#loginForm").submit(function (e) {
        // Evite que o formulário seja enviado normalmente
        e.preventDefault();

        // Obtenha os valores do formulário dinamicamente
        const username = $("#username").val();
        const password = $("#password").val();

        // Faça a solicitação usando os valores do formulário
        fetch(`/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    // Exiba a mensagem de erro recebida do servidor
                    $("#mensagemErro").text(data.message);
                    $("#erroLoginModal").modal("show");
                } else {
                    // Redirecione para a página de destino.
                    console.log("Login efetuado com sucesso.");
                    window.location.href = data.redirect;
                }
            });
    });
    // Limpe os campos de usuário e senha ao fechar o modal
    $("#erroLoginModal").on("hidden.bs.modal", function () {
        $("#username").val("");
        $("#password").val("");
    });
});
 
const usernameInput = document.getElementById("username");  // Selecione o campo de entrada de nome de usuário
usernameInput.addEventListener("input", function () {       // Adicione um ouvinte de eventos para o evento 'input'
    this.value = this.value.toUpperCase();                  // Atualize o valor do campo de entrada para maiúsculas
});
