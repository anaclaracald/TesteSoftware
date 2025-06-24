const StatusPedido = require("../enums/statusPedido")
const { CONFIRMADO, NAO_CONFIRMADO, ENTREGUE, FINALIZADO } = require("../enums/statusPedido")
const Pedido = require("../models/Pedido")

class PedidoService {
    constructor() {
        this._pedidos = []
        this._proximoId = 1
    }

    criarPedido(idCliente) {
        const novoPedido = new Pedido(this._proximoId++, idCliente)
        this._pedidos.push(novoPedido)
        return novoPedido
    }

    adicionarItem(idPedido, produto) {
        const pedido = this.buscarPedidoPorId(idPedido)
        if (pedido.status !== NAO_CONFIRMADO) throw new Error("Não é possível adicionar itens a um pedido confirmado.")
        pedido.itens.push(produto)
        return pedido
    }

    removerItem(idPedido, idProduto) {
        const pedido = this.buscarPedidoPorId(idPedido)
        if (pedido.status !== NAO_CONFIRMADO) throw new Error("Não é possível remover itens de um pedido confirmado.")
        pedido.itens = pedido.itens.filter((item) => item.id !== idProduto)
        return pedido
    }

    listarPedido(idPedido) {
        const pedido = this.buscarPedidoPorId(idPedido)
        if (pedido.status === NAO_CONFIRMADO) throw new Error("Erro ao encontrar pedido")
        return pedido
    }

    confirmarPedido(idPedido) {
        const pedido = this.buscarPedidoPorId(idPedido)
        if (pedido.status !== NAO_CONFIRMADO) throw new Error("Não é possível realizar a ação. Pedido já foi confirmado.")
        pedido.status = StatusPedido.CONFIRMADO
        return pedido
    }

    cancelarPedido(idPedido) {
        const pedido = this.buscarPedidoPorId(idPedido)
        if (pedido.status === ENTREGUE || pedido.status === FINALIZADO) throw new Error("Não é possível cancelar um pedido entregue ou finalizado.")
        pedido.status = StatusPedido.CANCELADO
        return pedido
    }

    finalizarPedido(idPedido) {
        const pedido = this.buscarPedidoPorId(idPedido) 
        if (pedido.status !== ENTREGUE) throw new Error("Não é possível finalizar um pedido que não foi entregue.")
        pedido.status = StatusPedido.FINALIZADO
        return pedido
    }

    buscarPedidoPorId(idPedido) {
        const pedido = this._pedidos.find((item) => item.id === idPedido)
        if (!pedido) throw new Error("Erro ao encontrar pedido.")
        return pedido
    }
}

module.exports = PedidoService