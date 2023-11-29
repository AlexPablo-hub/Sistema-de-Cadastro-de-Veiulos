const bcrypt = require('bcrypt');

const senhaOriginal = 'Senha_aqui'; // Substitua pela senha original do usuário.
const saltRounds = 10;

bcrypt.hash(senhaOriginal, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar hash criptografado:', err);
    } else {
        console.log('Hash criptografado:', hash);
    }
});

// Script para incerir o hash no banco de dados mysql.
// UPDATE veiculos.usuarios
// SET senha_criptografada = 'Coloque o hash criado aqui'
// WHERE id = 3;  -- Substitua 3 pelo ID do usuário específico no banco Mysql.
