const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para processar dados JSON no corpo da requisição
app.use(express.json());
app.use(cors());

// Criação do pool de conexões com o banco de dados MySQL
const db = mysql.createPool({
    host: 'mysql',  // Substitua pelo seu host MySQL
    user: 'user',       // Substitua pelo seu usuário MySQL
    password: 'password',       // Substitua pela sua senha MySQL
    database: 'todos_db' // Substitua pelo nome do seu banco de dados
});

// Verifica a conexão com o banco de dados
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
    connection.release();  // Libera a conexão após o uso
});

// Rota para inserir um "todo"
app.post('/todos', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send('Title is required');
    }

    const query = 'INSERT INTO todos (title) VALUES (?)';
    db.query(query, [title], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao inserir o todo: ' + err);
        }
        res.status(201).send({ id: results.insertId, text: title });
    });
});

// Rota para listar todos os "todos"
app.get('/todos', (req, res) => {
    const query = 'SELECT * FROM todos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar os todos: ', err);  // Mostra o erro no console
            return res.status(500).send('Erro ao listar os todos: ' + err);
        }
        // Mapeia todos os registros e renomeia o campo 'title' para 'text'
        const todos = results.map(todo => ({
            id: todo.id,
            text: todo.title,  // Renomeia 'title' para 'text'
        }));

        // Envia a lista completa de todos os itens
        res.status(200).json(todos);  // Envia a lista de todos no formato JSON
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
