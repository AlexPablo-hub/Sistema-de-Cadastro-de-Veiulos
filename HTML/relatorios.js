const atualizarTabelaVeiculos = (veiculos) => {
    const tabelaVeiculosBody = document.querySelector(
        "#tabelaRelatorio tbody"
    );
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
        `;
        tabelaVeiculosBody.appendChild(newRow);
    });
};

// Função para carregar dados de veículos do servidor
const carregarDadosVeiculos = () => {
    $.ajax({
        url: "/api/relatorios",
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data) && data.length > 0) {
                // Use os dados recebidos para atualizar a tabela de relatórios.
                atualizarTabelaVeiculos(data);
                console.log("Os dados de veiculos eletricos foram recebidos.");
            } else {
                console.log("Nenhum veículo encontrado.");
            }
        },
        error: function (error) {
            console.error("Erro ao buscar os dados:", error);
        },
    });
};

// Chame a função de carregar dados de veículos no carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página relatorio carregada.");
    carregarDadosVeiculos();
});

const atualizarTabelaVeiculos2 = (veiculos) => {
    const tabelaVeiculosBody = document.querySelector(
        "#tabelaRelatorio2 tbody"
    );
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
        `;
        tabelaVeiculosBody.appendChild(newRow);
    });
};

// Função para carregar dados de veículos do servidor
const carregarDadosVeiculos2 = () => {
    $.ajax({
        url: "/api/relatorios2",
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data) && data.length > 0) {
                // Use os dados recebidos para atualizar a tabela de relatórios.
                atualizarTabelaVeiculos2(data); // Corrigido para usar a função correta
                console.log("Os dados de veiculos a combustão foram recebidos.");
            } else {
                console.log("Nenhum veículo encontrado.");
            }
        },
        error: function (error) {
            console.error("Erro ao buscar os dados:", error);
        },
    });
};

// Chame a função de carregar dados de veículos no carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosVeiculos2();
});

$("#btnGerarPDF").click(function () {
    console.log("Botão de gerar PDF clicado.");
    // Função para carregar dados de veículos elétricos do servidor
    const carregarDadosVeiculos = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/api/relatorios",
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (Array.isArray(data) && data.length > 0) {
                        resolve(data);
                    } else {
                        reject("Nenhum veículo elétrico encontrado.");
                        console.log("Nenhum veículo elétrico encontrado.");
                    }
                },
                error: function (error) {
                    reject("Erro ao buscar os dados de veículos elétricos:", error);
                },
            });
        });
    };

    // Função para carregar dados de veículos a combustão do servidor
    const carregarDadosVeiculos2 = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/api/relatorios2",
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (Array.isArray(data) && data.length > 0) {
                        resolve(data);
                    } else {
                        reject("Nenhum veículo a combustão encontrado.");
                        console.log("Nenhum veículo a combustão encontrado.");
                    }
                },
                error: function (error) {
                    reject("Erro ao buscar os dados de veículos a combustão:", error);
                },
            });
        });
    };

    // Carregue os dados de veículos elétricos e a combustão
    Promise.all([carregarDadosVeiculos(), carregarDadosVeiculos2()])
        .then(([veiculosEletricos, veiculosCombustao]) => {
            console.log("Veículos elétricos:", veiculosEletricos);
            console.log("Veículos a combustão:", veiculosCombustao);
            gerarPDF(veiculosEletricos, veiculosCombustao);
        })
        .catch((error) => {
            console.error(error);
            // Trate o erro conforme necessário
        });
});

// Função para gerar o PDF com os dados fornecidos
function gerarPDF(veiculosEletricos, veiculosCombustao) {
    const doc = new jspdf.jsPDF();

    // Transforme os dados em um formato que a função autoTable possa entender
    const transformarDados = (dados) => {
        return dados.map(veiculo => ({
            id: veiculo.id,
            empresa: veiculo.empresa,
            modelo: veiculo.modelo,
            // Adicione aqui os outros campos do veículo
        }));
    };

    const dadosVeiculosEletricos = transformarDados(veiculosEletricos);
    const dadosVeiculosCombustao = transformarDados(veiculosCombustao);

    // Adicione o conteúdo dos relatórios ao PDF
    // Personalize o PDF
    doc.setFontSize(14);
    doc.setFont('courier');
    doc.setTextColor(100);

    // Adicione o conteúdo dos relatórios ao PDF
    const addTable = (data, offsetY) => {
        doc.autoTable({
            body: data,
            startY: offsetY,
            styles: { fillColor: [100, 255, 255] }, // Cor de fundo das células
            columnStyles: { id: { fillColor: [0, 0, 255] } }, // Cor de fundo da coluna 'id'
        });
    };

    doc.text("Relatório de Veículos Elétricos", 20, 10);
    addTable(veiculosEletricos, 20);

    doc.addPage();
    doc.text("Relatório de Veículos a Combustão", 20, 10);
    addTable(veiculosCombustao, 20);

    // Gere o PDF como um blob
    const pdfOutput = doc.output('blob');

    // Crie uma URL de objeto a partir do blob
    const blobURL = URL.createObjectURL(pdfOutput);

    // Abra a URL do objeto em uma nova janela do navegador
    window.open(blobURL, '_blank');
}
