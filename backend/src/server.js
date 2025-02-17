require('dotenv').config();
const express = require('express');
const usuariosRoutes = require('./routes/usuarios'); 
const transacoesRoutes = require('./routes/transacoes');
const authRoutes = require('./routes/authRoutes'); 
const deshboardRoutes = require('./routes/dashboard');

const app = express();
const port = 3000;

app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API de Finanças');
});

// Rotas separadas
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/transacoes', transacoesRoutes);
app.use('/deshboard', deshboardRoutes);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
