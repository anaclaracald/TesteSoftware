const StatusPedido = require("../enums/statusPedido")

class Pedido {
    constructor(id, idCliente, itens = []) {
        this._id = id
        this._idCliente = idCliente
        this._itens = itens
        this._status = StatusPedido.NAO_CONFIRMADO
    }

    get id() {
        return this._id
    }

    get idCliente() {
        return this._idCliente
    }

    get itens() {
        return this._itens
    }

    get status() {
        return this._status
    }

    get feito() {
        return this._feito
    }

    set status(novoStatus) {
        this._status = novoStatus
    }
}

module.exports = Pedido