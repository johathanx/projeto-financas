const express = require('express');
const router = express.Router();
const client = require('../db');

router.post('/', async (req, res) => {
    const { descricao, valor, tipo, usuario_id , categoria} = req.body;
    try {
        const result = await client.query(
            'INSERT INTO transacoes (descricao, valor, tipo, usuario_id, categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [descricao, valor, tipo, usuario_id, categoria]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM transacoes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo, usuario_id, categoria } = req.body;
    try {
        const result = await client.query(
            'UPDATE transacoes SET descricao = $1, valor = $2, tipo = $3, usuario_id = $4, categoria = $5 WHERE id = $6 RETURNING *',
            [descricao, valor, tipo, usuario_id, categoria, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            'DELETE FROM transacoes WHERE id = $1 RETURNING id',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        res.json({ message: `Transação com ID ${id} deletada` });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao deletar transação' });
    }
});

module.exports = router;
