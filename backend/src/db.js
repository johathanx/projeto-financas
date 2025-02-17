const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'financas',
    password: '34425379',
    port: 5432,
});

client.connect()
    .then(() => console.log('✅ Conexão com o banco de dados foi bem-sucedida!'))
    .catch(err => console.error('❌ Erro na conexão com o banco de dados:', err.stack));

module.exports = client;
