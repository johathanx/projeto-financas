const express = require('express');
const usuariosRoutes = require('./routes/usuarios'); // Agora correto
const transacoesRoutes = require('./routes/transacoes');

const app = express();
const port = 3000;

app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API de Finanças');
});

// Rotas separadas
app.use('/usuarios', usuariosRoutes);
app.use('/transacoes', transacoesRoutes);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
