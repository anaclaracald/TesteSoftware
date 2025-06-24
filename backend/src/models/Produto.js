class Produto {
    constructor(id, descricao, quantidade) {
        this._id = id
        this._descricao = descricao
        this._quantidade = quantidade
    }

    get id() {
        return this._id
    }

    set descricao(novaDescricao) {
        this._descricao = novaDescricao
    }

    set quantidade(novaQuantidade) {
        this._quantidade = novaQuantidade
    }
}

module.exports = Produto