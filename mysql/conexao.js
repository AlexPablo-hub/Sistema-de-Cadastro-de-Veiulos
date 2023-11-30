// Importa o módulo 'mysql' para utilizar suas funcionalidades de conexão com o banco de dados.
const mysql = require('mysql');

// Cria uma conexão com o banco de dados MySQL, especificando os detalhes da conexão, como host, porta, usuário, senha e nome do banco de dados.
const connection = mysql.createConnection({
    host: 'seu-host',        // Endereço do servidor MySQL.
    port: 3306,              // Porta de conexão com o servidor MySQL (padrão é 3306).
    user: 'seu-usuario',     // Nome de usuário para autenticação no MySQL.
    password: 'sua-senha',   // Senha do usuário para autenticação no MySQL.
    database: 'sistema'      // Nome do banco de dados que será usado.
});

//A função de callback é acionada quando a conexão é bem-sucedida ou ocorre um erro.
conexao.connect((err) => {
  if (err) {
    // Se ocorrer um erro durante a conexão, uma mensagem de erro é exibida no console.
    console.error('Erro na conexão com o banco de dados:', err);
  } else {
    // Se a conexão for bem-sucedida, uma mensagem de sucesso é exibida no console.
    console.log('Conexão com o banco de dados estabelecida com sucesso. \nBem vindo ao sistema de veiculos.');
  }
});

// Exporta o objeto de conexão para que ele possa ser usado em outros módulos ou partes do aplicativo.
module.exports = conexao;
