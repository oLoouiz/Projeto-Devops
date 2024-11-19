// server.js

const express = require('express');
const { Connection, Request } = require('tedious'); // Pacote para conectar ao Azure SQL

const app = express();
const port = 3000;

app.use(express.json()); // Para analisar o corpo das requisições como JSON
app.use(express.static('public')); // Serve os arquivos da pasta 'public' (onde você vai colocar HTML, CSS e JS)

const dbConfig = {
    authentication: {
        options: {
            userName: "luizeshodi", // Seu usuário do Azure SQL
            password: "DevopsSenac2024@",   // Sua senha do Azure SQL
        },
        type: "default",
    },
    server: "projeto-devops-sql-server.database.windows.net", // Nome do seu servidor no Azure SQL
    options: {
        database: "projeto-devops-sql-server", // Nome do banco de dados
        encrypt: true, // Necessário para conexão segura com o Azure
    },
};

// Rota para verificar se o e-mail existe no banco
app.post('/check-email', (req, res) => {
    const email = req.body.email;

    const connection = new Connection(dbConfig);

    connection.on('connect', err => {
        if (err) {
            res.status(500).send("Erro ao conectar ao banco de dados");
        } else {
            const request = new Request(
                `SELECT COUNT(*) AS count FROM Users WHERE Email = @Email`,
                (err, rowCount, rows) => {
                    if (err) {
                        res.status(500).send("Erro ao consultar o banco de dados");
                    } else {
                        const result = rows[0][0].value;
                        if (result > 0) {
                            res.json({ exists: true });
                        } else {
                            res.json({ exists: false });
                        }
                    }
                }
            );
            request.addParameter("Email", require("tedious").TYPES.NVarChar, email);
            connection.execSql(request);
        }
    });
});

// Rota para salvar os dados do novo usuário
app.post('/save-user', (req, res) => {
    const { name, email, imageUrl } = req.body;

    const connection = new Connection(dbConfig);

    connection.on('connect', err => {
        if (err) {
            res.status(500).send("Erro ao conectar ao banco de dados");
        } else {
            const request = new Request(
                `INSERT INTO Users (Name, Email, ImageUrl) VALUES (@Name, @Email, @ImageUrl)`,
                (err, rowCount, rows) => {
                    if (err) {
                        res.status(500).send("Erro ao salvar no banco de dados");
                    } else {
                        res.json({ success: true });
                    }
                }
            );
            request.addParameter("Name", require("tedious").TYPES.NVarChar, name);
            request.addParameter("Email", require("tedious").TYPES.NVarChar, email);
            request.addParameter("ImageUrl", require("tedious").TYPES.NVarChar, imageUrl);
            connection.execSql(request);
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
