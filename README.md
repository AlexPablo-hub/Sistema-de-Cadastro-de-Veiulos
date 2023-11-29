# Sistema de Cadastro de Veíulos
Este é um sistema de cadastro de veículos desenvolvido em HTML, CSS, JavaScript (com jQuery) e utiliza o framework Bootstrap para estilização. O sistema oferece funcionalidades básicas de um CRUD (Create, Read, Update, Delete) para gerenciar informações de veículos, permitindo a adição, edição, exclusão e visualização dos dados.

# Funcionalidades
- Cadastro de Veículos: Permite adicionar novos veículos ao sistema, incluindo informações como empresa, modelo, ano, motor, cor e categoria.
- Edição de Veículos: Possibilita a edição dos dados de veículos já cadastrados.
- Exclusão de Veículos: Permite a exclusão de veículos do sistema.
- Relatórios: Oferece a geração de relatórios, separados por veículos elétricos e veículos a combustão.
    - Gera também um relatorio em PDF

# Instalações
Antes de rodar a API, certifique-se de ter o Node.js e o npm instalados em seu sistema.
Você pode baixá-los em https://nodejs.org/.

# Instalação de Dependências

Para instalar as dependências do projeto, utilize o seguinte comando:

```bash
npm install

# Banco de Dados de Veículos
Este projeto utiliza um banco de dados chamado `veiculos` com duas tabelas principais: `usuarios` e `veiculos` não relacionadas entre si.

1 Tabela `usuarios`

- `ID` (chave primária, autoincremento)
- `NomeUsuario` (varchar, não nulo)
- `senha_criptografada` (varchar)

2 Tabela `veiculos`

- `id` (chave primária, autoincremento)
- `empresa` (varchar)
- `modelo` (varchar)
- `ano` (inteiro)
- `motor` (varchar)
- `cor` (varchar)
- `categoria` (varchar)
  
# Configuração do Banco de Dados
Certifique-se de ter um servidor MySQL em execução e crie um banco de dados para a aplicação, Atualize as configurações de conexão no arquivo mysql/conexao.js conforme
necessário.

const connection = mysql.createConnection({
  host: 'seu-host',
  user: 'seu-usuario',
  password: 'sua-senha',
  database: 'seu-banco-de-dados'
});
