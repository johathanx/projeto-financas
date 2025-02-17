const express = require('express');
const router = express.Router();
const client = require('../db');

router.get('/', async (req, res) => {
    try {
        const saldoResult = await client.query(
            "SELECT SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) AS saldo_total FROM transacoes;"
        );
        const saldoTotal = saldoResult.rows[0].saldo_total || 0;

        const transacoesMes = await client.query(
            `SELECT 
                SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS total_entradas,
                SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS total_saidas
            FROM transacoes
            WHERE date_part('month', data) = date_part('month', CURRENT_DATE)
            AND date_part('year', data) = date_part('year', CURRENT_DATE);`
        );
        const { total_entradas, total_saidas } = transacoesMes.rows[0];

        const ultimasTransacoes = await client.query(
            "SELECT * FROM transacoes ORDER BY data DESC LIMIT 5;"
        );

        const gastosPorCategoria = await client.query(
            `SELECT categoria, SUM(valor) AS total_gasto 
            FROM transacoes WHERE tipo = 'saida' 
            GROUP BY categoria ORDER BY total_gasto DESC;`
        );

        res.json({
            saldo_total: saldoTotal,
            total_entradas: total_entradas || 0,
            total_saidas: total_saidas || 0,
            ultimas_transacoes: ultimasTransacoes.rows,
            gastos_por_categoria: gastosPorCategoria.rows
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao obter dados do dashboard' });
    }
});

router.get('/resumo', async (req, res) => {
    try {
        const totalReceitas = await client.query('SELECT SUM(valor) FROM transacoes WHERE tipo = $1', ['entrada']);
        const totalDespesas = await client.query('SELECT SUM(valor) FROM transacoes WHERE tipo = $1', ['saida']);
        
        const saldo = (totalReceitas.rows[0].sum || 0) - (totalDespesas.rows[0].sum || 0);

        res.json({
            totalReceitas: totalReceitas.rows[0].sum || 0,
            totalDespesas: totalDespesas.rows[0].sum || 0,
            saldo
        });
    } catch (err) {
        console.error('Erro ao buscar resumo financeiro:', err);
        res.status(500).json({ error: 'Erro ao buscar resumo financeiro' });
    }
});

router.get('/gastos-por-categoria', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT categoria, SUM(valor) as total
            FROM transacoes
            GROUP BY categoria
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Erro ao buscar gastos por categoria' });
    }
});

module.exports = router;