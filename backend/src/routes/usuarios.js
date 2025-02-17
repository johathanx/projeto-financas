const express = require('express');
const bcrypt = require('bcryptjs');
const client = require('../db'); 

const router = express.Router();

router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const result = await client.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, senhaHash]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    try {
        const result = await client.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING id, nome, email, data_criacao',
            [nome, email, senha, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING id',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: `Usuário com ID ${id} deletado` });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

module.exports = router;
