const atualizarTabelaVeiculos = (veiculos) => {
    const tabelaVeiculosBody = document.querySelector("#tabela-veiculos");
    tabelaVeiculosBody.innerHTML = ""; // Limpe o conteúdo atual da tabela

    veiculos.forEach((veiculo) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
              <td class="veiculo-cell">${veiculo.empresa}</td>
              <td class="veiculo-cell">${veiculo.modelo}</td>
              <td class="veiculo-cell">${veiculo.ano}</td>
              <td class="veiculo-cell">${veiculo.motor}</td>
              <td class="veiculo-cell">${veiculo.cor}</td>
              <td class="veiculo-cell">${veiculo.categoria}</td>
              <td >
                <input class="btn-editar" type="button" value="EDITAR" data-veiculo-id="${veiculo.id}" style="cursor: pointer;" />
                <input class="btn-excluir" type="button" value="DELETAR" data-veiculo-id="${veiculo.id}" style="cursor: pointer;" />
              </td>
          `;
        tabelaVeiculosBody.appendChild(newRow);
    });
};

const carregarDadosVeiculos = () => {
    if (window.location.href.includes("/sistema")) {
        // A página foi redirecionada para /sistema, então carregue os dados de veículos
        fetch("/get-veiculos-data")
            .then((response) => response.json())
            .then((data) => {
                // Verifique se o array de veículos não está vazio
                if (Array.isArray(data.results) && data.results.length > 0) {
                    // Use os dados recebidos para atualizar a tabela do sistema
                    atualizarTabelaVeiculos(data.results);
                    console.log("Os dados foram recebidos com sucesso.");
                } else {
                    console.log("Nenhum veículo encontrado.");
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar os dados:", error);
            });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página sistema carregada.");
    carregarDadosVeiculos();
});
 
$(document).ready(function () {
    $("#btn-salvar").click(function (e) {
        e.preventDefault();

        // Atualiza o valor do campo "motor" com base na seleção do usuário
        var opcoesSelect = document.getElementById("opcoes");
        var motorInput = document.getElementById("motor");
        motorInput.value = opcoesSelect.value;

        const dadosDoFormulario = $("#meuFormulario").serialize();
        console.log("Dados do formulário:", dadosDoFormulario);

        // Envia uma solicitação POST para o servidor
        $.post("/cadastrar-veiculo", dadosDoFormulario)
            .done(function (response) {
                // Lógica para atualizar dinamicamente a tabela com os dados do response
                atualizarTabelaVeiculos(response.data); // Atualiza a tabela com os novos dados
                console.log("Dados cadastrados com sucesso:", response);

                // Exemplo: Limpar o formulário após o cadastro
                $("#meuFormulario")[0].reset();

                // Exibir modal de confirmação
                $("#modalDeConfirmacao").modal("show");
            })
            .fail(function (error) {
                // Manipulação de erros em caso de falha na solicitação
                console.error("Erro ao cadastrar veículo:", error);
                // Exemplo: Mostrar uma mensagem de erro ao usuário
                $("#modalDeConfirmacaodeerro").modal("show");
            });
    });
});

$(document).on("click", "input.btn-excluir", function () {
    const veiculoId = $(this).attr("data-veiculo-id");

    // Abre o modal de confirmação
    $("#confirmacaoModal").modal("show");

    // Remove os eventos de clique anteriores
    $("#btnConfirmarExclusao").off("click");

    // Configura o evento de clique para o botão "Sim" do modal
    $("#btnConfirmarExclusao").on("click", function () {
        // Fecha o modal de confirmação
        $("#confirmacaoModal").modal("hide");

        console.log("Você DELETOU o veículo com ID:", veiculoId);
        excluirVeiculo(veiculoId);
    });
});

const excluirVeiculo = (veiculoId) => {
    fetch(`/excluir/${veiculoId}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.error("\nErro ao excluir veículo:", data.error);
            } else {
                atualizarTabelaVeiculos(data.data);
                console.log("\nVeículo excluído com sucesso:", data);
            }
        })
        .catch((error) => {
            console.error("\nErro ao excluir veículo:", error);
        });
};

$(document).on("click", "input.btn-editar", function () {
    const veiculoId = $(this).attr("data-veiculo-id");
    console.log("Você está editando o veículo com ID:", veiculoId);

    // Busque os dados do veículo correspondente no servidor
    fetch(`/get-veiculo/${veiculoId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.error("Erro ao buscar dados do veículo:", data.error);
            } else {
                // Preencha a janela modal com os dados do veículo
                preencherFormularioEdicao(data.veiculo);

                // Abra a janela modal
                $("#modalEdicao").modal("show");
                console.log("Dados do veículo carregados com sucesso:", data);
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar dados do veículo:", error);
        });

    // Manipulador de evento para salvar a edição
    $("#btn-salvar-edicao").click(function () {
        const dadosDoFormulario = $("#meuFormulario2").serialize();

        // Enviar os dados para atualizar o veículo no servidor
        $.ajax({
            type: "PUT",
            url: `/editar-veiculo/${veiculoId}`, // Lembre-se de definir veiculoId corretamente
            data: dadosDoFormulario,
            success: function (data) {
                if (data.success) {
                    console.log("Veículo atualizado com sucesso:", data.message);

                    // Feche a janela modal
                    $("#modalEdicao").modal("hide");
                    // Atualize a tabela de veículos ou realize outras ações necessárias aqui
                } else {
                    console.error("Erro ao atualizar veículo:", data.message);
                }
            },
            error: function (error) {
                console.error("Erro ao atualizar veículo:", error);
            },
        });
    });
});

const preencherFormularioEdicao = (veiculo) => {
    // Preencha os campos do formulário com os dados do veículo, exceto o campo 'id'
    $("#empresa").val(veiculo.empresa);
    $("#modelo").val(veiculo.modelo);
    $("#ano").val(veiculo.ano);
    $("#motor").val(veiculo.motor);
    $("#cor").val(veiculo.cor);
    $("#categoria").val(veiculo.categoria);
};
