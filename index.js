const express = require('express'); // Importe o módulo express.
const app = express(); // Cria uma instância do express.
const path = require('path'); // Importe o módulo de caminho do Node.js.
const port = process.env.PORT || 3000; // Define a porta do servidor.
const session = require('express-session'); // Importe o módulo de sessão do express.
const Routers = require('./routers/Routers'); // Importe o arquivo de roteamento.

// Configurações de sessão para o express.
app.use(session({ 
    secret: '84220084',
    resave: false,
    saveUninitialized: true,
}));

// Importe o middleware express.urlencoded para análise de dados.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs'); // Define EJS como mecanismo de template
app.set('views', path.join(__dirname, 'views')); // Define o diretório de visualizações do aplicativo
app.use(express.static(path.join(__dirname, 'HTML'))); // Define o diretório de arquivos estáticos do aplicativo.

app.use(Routers);// Use o objeto de roteamento para todas as rotas

// Inicia o servidor e faz com que ele escute a porta especificada.
app.listen(port, (error) => {
    if (error) {
        console.log('O Servidor não está online, erro: ', error); // Em caso de erro ao iniciar o servidor, exibe uma mensagem de erro.
        return;
    }
    console.log('O servidor está rodando na porta local: ' + port); // Se o servidor for iniciado com sucesso, exibe uma mensagem de sucesso.
});
