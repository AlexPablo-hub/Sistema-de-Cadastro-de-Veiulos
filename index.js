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
