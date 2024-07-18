const instanciaAxios = require("../api");
const pool = require("../conexao");

const venda = async(req, res) => {
    const {cliente_id, produto_id, quantidade} = req.body;

    try {
        const { data: saldo } = await instanciaAxios.get('/balance')
        
        return res.json(saldo)
        const cliente = await pool.query('select * from clientes where id = $1', [cliente_id]);

        if(cliente.rowCount < 1) {
            return res.status(404).json('Cliente não existe')
        }

        const produto = await pool.query('select * from produtos where id = $1', [produto_id]);
        
        if(produto.rowCount < 1) {
            return res.status(404).json('Produto não existe')
        }

        if(quantidade < 1) {
            return res.status(404).json('Quantidade mínima é 1')
        }
        
        const query = `
            insert into vendas (cliente_id, produto_id, quantidade)
            values ($1, $2, $3)
        `

        const vendaRealizada = await pool.query(query, [
            cliente_id,
            produto_id,
            quantidade
        ])

        return res.status(201).json(vendaRealizada.rows[0]);
    } catch (error) {
        return res.status(500).json('Erro no servidor')
    }
}

module.exports = {
    venda
}