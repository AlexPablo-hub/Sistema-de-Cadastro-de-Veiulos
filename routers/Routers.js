const { Router } = require('express'); // Importa os módulos necessários do express.
const router = Router(); // Cria um objeto de roteamento.
const jsPDF = require('jspdf'); // Importa o módulo de geração de PDF
const conexao = require('../mysql/conexao'); // Importa o objeto de conexão com o banco de dados.
const path = require("path"); // Importa o módulo de caminho do Node.js
const bcrypt = require('bcrypt'); // Importa o módulo de criptografia de senha.

// Rota padrão.
router.get('/', (req, res) => {
    res.redirect('/Login');
});

// Rota para carregar a página de login.
router.get("/Login", (req, res) => {
    let indexPath = path.join(__dirname, "/../HTML/login.html"); // Define o caminho do arquivo HTML.
    res.sendFile(indexPath); // Envia o arquivo HTML.
});

// Rota para verificar as credenciais do usuário.
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE NomeUsuario = ?';
    conexao.query(query, [username], async (error, results) => {
        if (error) {
            console.error('Erro durante a consulta ao banco de dados:', error);
            res.json({ success: false, message: 'Erro interno durante a autenticação' });
        } else {
            if (results.length > 0) {
                const usuario = results[0];
                const match = await bcrypt.compare(password, usuario.senha_criptografada);

                if (match) {
                    req.session.logado = true;
                    res.json({ success: true, redirect: '/dado' });
                } else {
                    res.json({ success: false, message: 'Credenciais inválidas' });
                }
            } else {
                res.json({ success: false, message: 'Credenciais inválidas' });
                console.log('\nCredenciais inválidas, tente novamente.');
            }
        }
    });
});

// Rota para buscar dados do banco de dados.
router.get('/dado', (req, res) => {
    if (!req.session.logado) {
        // Se o usuário não estiver logado, redirecione para a página de login.
        console.log('\nRoda dado foi acessada com sucesso')
        res.redirect('/Login');
        return;
    }
    // Execute uma consulta SQL para buscar os dados do banco de dados
    conexao.query('SELECT * FROM veiculos', (error, results) => {
        if (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.status(500).send('Erro na consulta ao banco de dados: ' + error.message);
        } else {
            //Se a consulta for bem-sucedida, armazene os resultados em uma variável de sessão
            req.session.veiculos = results;
            //console.log('\nDados da variável de sessão:', req.session.veiculos);
            // Em seguida, redirecione para a rota /sistema
            res.redirect('/sistema');
        }
    });
});

// Rota para buscar dados da variável de sessão.
router.get('/get-veiculos-data', (req, res) => {
    const veiculos = req.session.veiculos || []; // Se a variável de sessão não existir, defina-a como uma matriz vazia.
    res.json({ results: veiculos }); // Envie os dados da variável de sessão como resposta.
    //console.log('Dados da variável de sessão:', veiculos);
});

// Rota para a página "sistema".
router.get('/sistema', (req, res) => {
    if (!req.session.logado) {
        // Se o usuário não estiver logado, redirecione para a página de login.
        res.redirect('/login');
        return;
    }
    let indexPath = path.join(__dirname, "/../HTML/sistema.html"); // Define o caminho do arquivo HTML.
    res.sendFile(indexPath); // Envia o arquivo HTML.
});

// Rota para a página "cadastrar".
router.post('/cadastrar-veiculo', (req, res) => {
    const { empresa, modelo, ano, motor, cor, categoria } = req.body; // Supondo que os dados do formulário são enviados no corpo da solicitação POST

    const query = 'INSERT INTO veiculos (empresa, modelo, ano, motor, cor, categoria) VALUES (?, ?, ?, ?, ?, ?)';
    // Execute uma consulta SQL para inserir os dados no banco de dados
    conexao.query(query, [empresa, modelo, ano, motor, cor, categoria], (err, result) => { // O segundo parâmetro é um array com os valores que serão inseridos na consulta
        if (err) {
            console.error('Erro ao inserir dados no banco de dados:', err);
            res.status(500).json({ success: false, message: 'Erro ao salvar os dados.' });
        } else {
            console.log('Dados salvos com sucesso.');
            console.log('Dados recebidos no servidor:', empresa, modelo, ano, motor, cor, categoria);

            conexao.query('SELECT * FROM veiculos', (error, results) => { // Após o sucesso, busque os dados atualizados do banco de dados.
                if (error) {
                    console.error('Erro na consulta ao banco de dados:', error);
                    res.status(500).json({ success: false, message: 'Erro ao buscar os dados atualizados.' }); // Envie uma mensagem de erro como resposta.
                } else {
                    res.status(200).json({ success: true, message: 'Dados salvos com sucesso.', data: results }); // Envie os dados atualizados como resposta.
                }
            });
        }
    });
});

// Rota para excluir um veículo.
router.delete('/excluir/:id', (req, res) => {
    if (!req.session.logado) {
        // Se o usuário não estiver logado, redirecione para a página de login.
        res.redirect('/login');
        return;
    }
    const id = req.params.id; // Obtenha o ID do veículo a ser excluído.

    const query = 'DELETE FROM veiculos WHERE id = ?'; // Execute uma consulta SQL para excluir o veículo do banco de dados.

    conexao.query(query, [id], (error, results) => { // O segundo parâmetro é um array com os valores que serão inseridos na consulta
        if (error) {
            console.error('Erro ao excluir veículo:', error);
            res.status(500).json({ message: 'Erro ao excluir veículo' });
        } else {
            console.log('Veículo excluído com sucesso');
            conexao.query('SELECT * FROM veiculos', (error, results) => { // Após o sucesso, busque os dados atualizados do banco de dados.
                if (error) {
                    console.error('Erro na consulta ao banco de dados:', error);
                    res.status(500).json({ success: false, message: 'Erro ao buscar os dados atualizados.' }); // Envie uma mensagem de erro como resposta.
                } else {
                    res.status(200).json({ success: true, message: 'Dados atualizados com sucesso.', data: results }); // Envie os dados atualizados como resposta.
                }
            });
        }
    });
});

// Rota para buscar um veículo.
router.get('/get-veiculo/:id', (req, res) => {
    const id = req.params.id; // Obtenha o ID do veículo a ser buscado.

    const query = 'SELECT * FROM veiculos WHERE id = ?'; // Execute uma consulta SQL para buscar o veículo no banco de dados.

    conexao.query(query, [id], (error, results) => {
        if (error) {
            console.error('Erro ao buscar veículo:', error);
            res.status(500).json({ message: 'Erro ao buscar veículo' });
        } else {
            if (results.length > 0) {
                const veiculo = results[0]; // Obtenha o veículo da lista de resultados.
                res.json({ veiculo }); // Envie o veículo como resposta.
            } else {
                res.status(404).json({ message: 'Veículo não encontrado' }); // Envie uma mensagem de erro como resposta.
            }
        }
    });
});

// Rota para editar um veículo.
router.put('/editar-veiculo/:id', (req, res) => {
    const veiculoId = req.params.id; // Obtenha o ID do veículo a ser editado.
    const dadosDoFormulario = req.body; // Obtenha os dados do formulário.

    const query = 'UPDATE veiculos SET ? WHERE id = ?'; // Execute uma consulta SQL para atualizar o veículo no banco de dados.

    conexao.query(query, [dadosDoFormulario, veiculoId], (error, results) => { // O segundo parâmetro é um array com os valores que serão inseridos na consulta
        if (error) {
            console.error('\nErro ao editar veículo:', error);
            res.status(500).json({ success: false, message: 'Erro ao editar veículo' });
        } else {
            console.log('\nVeículo editado com sucesso'); // mensagem de sucesso.
            res.status(200).json({ success: true, message: 'Veículo atualizado com sucesso', data: dadosDoFormulario }); // Envie os dados atualizados como resposta.
        }
    });
});

// Rota para atualizar o sistema.
router.post('/sistema', (req, res) => {
    res.redirect('/dado'); // Redireciona para a rota /dado.
});

// Rota de relatórios.
router.get('/relatorio', (req, res) => {
    if (!req.session.logado) {
        // Se o usuário não estiver logado, redirecione para a página de login.
        res.redirect('/login');
        return;
    }
    let indexPath = path.join(__dirname, "/../HTML/relatorios.html"); // Define o caminho do arquivo HTML.
    res.sendFile(indexPath); // Envia o arquivo HTML.
});

// Rota para fornecer dados de relatório ao front-end.
router.post('/api/relatorios', async (req, res) => {
    try {
        // Lógica para obter os dados do relatório do banco de dados
        const query = "SELECT * FROM veiculos WHERE UPPER(motor) IN ('eletrico')";

        // Execute a consulta no banco de dados usando o objeto de conexão
        conexao.query(query, (error, results) => {
            if (error) {
                console.error('Erro ao obter dados do relatório:', error);
                res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
            } else {
                //console.log('\nDados do relatório:', results); // Exibe os dados do relatório no console.
                console.log('\nDados do relatorio 1 recebidos com sucesso.');
                res.json(results); // Envie os dados do relatório como JSON
            }
        });
    } catch (error) {
        console.error('Erro geral:', error);
        res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
    }
});

// Rota para fornecer dados de relatório oa front-end.
router.post('/api/relatorios2', async (req, res) => {
    try {
        // Lógica para obter os dados do relatório do banco de dados
        const query = "SELECT * FROM veiculos WHERE UPPER(motor) IN ('combustão')";

        // Execute a consulta no banco de dados usando o objeto de conexão
        conexao.query(query, (error, results) => {
            if (error) {
                console.error('Erro ao obter dados do relatório:', error);
                res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
            } else {
                //console.log('\nDados do relatório:', results); // Exibe os dados do relatório no console.
                console.log('\nDados do relatorio 2 recebidos com sucesso.');
                res.json(results); // Envie os dados do relatório como JSON
            }
        });
    } catch (error) {
        console.error('Erro geral:', error);
        res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
    }
});

// Exporta o objeto de roteamento para que possa ser utilizado no aplicativo principal.
module.exports = router;
