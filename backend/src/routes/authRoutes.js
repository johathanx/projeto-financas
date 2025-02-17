const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const client = require('../db');
const secret = process.env.JWT_SECRET;

const router = express.Router();

// Login do usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        if (!secret) {
            throw new Error("JWT_SECRET não está definido. Verifique o arquivo .env!");
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            secret,
            { expiresIn: '1h' }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro no login' });
    }
});

module.exports = router;
