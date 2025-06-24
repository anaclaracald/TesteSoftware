const Produto = require("../models/Produto")

class ProdutoService {
    constructor() {
        this._produtos = []
        this._proximoId = 1
    }

    criarProduto(descricao, quantidade) {
        const novoProduto = new Produto(this._proximoId++, descricao, quantidade)
        this._produtos.push(novoProduto)
        return novoProduto
    }

    editarProduto(idProduto, novaDescricao, novaQuantidade) {
        const produto = this.buscarProdutoPorId(idProduto)
        produto.descricao = novaDescricao
        produto.quantidade = novaQuantidade
        return produto
    }

    deletarProduto(idProduto) {
        const tamanhoOriginal = this._produtos.length;
        this._produtos = this._produtos.filter(item => item.id !== idProduto)
        if (this._produtos.length === tamanhoOriginal) throw new Error("Produto não encontrado.")
    }

    listarTodosProdutos() {
        return this._produtos
    }

    buscarProdutoPorId(idProduto) {
        const produto = this._produtos.find((item) => item.id === idProduto)
        if (!produto) throw new Error("Erro ao encontrar produto.")
        return produto
    }
}

module.exports = ProdutoService