const PedidoService = require("../services/PedidoService")
const Pedido = require("../models/Pedido")
const StatusPedido = require("../enums/statusPedido")

jest.mock("../models/Pedido")

describe("PedidoService", () => {
    let service

    beforeEach(() => {
        service = new PedidoService()
        Pedido.mockImplementation((id, idCliente) => ({
            id,
            idCliente,
            status: StatusPedido.NAO_CONFIRMADO,
            itens: []
        }))
    })

    test("deve criar um pedido", () => {
        const pedido = service.criarPedido(123)
        expect(pedido.idCliente).toBe(123)
        expect(pedido.status).toBe(StatusPedido.NAO_CONFIRMADO)
    })

    test("deve adicionar item ao pedido não confirmado", () => {
        service.criarPedido(1)
        const pedido = service.adicionarItem(1, { id: 10, nome: "Camiseta" })
        expect(pedido.itens).toHaveLength(1)
    })

    test("deve lançar erro ao adicionar item em pedido confirmado", () => {
        const pedido = service.criarPedido(1)
        pedido.status = StatusPedido.CONFIRMADO
        expect(() => service.adicionarItem(1, { id: 2, nome: "Produto" })).toThrow()
    })

    test("deve remover item do pedido", () => {
        const pedido = service.criarPedido(1)
        pedido.itens.push({ id: 1, nome: "Produto" })
        service.removerItem(1, 1)
        expect(pedido.itens).toHaveLength(0)
    })

    test("deve confirmar um pedido", () => {
        service.criarPedido(1)
        const confirmado = service.confirmarPedido(1)
        expect(confirmado.status).toBe(StatusPedido.CONFIRMADO)
    })

    test("deve lançar erro ao confirmar pedido já confirmado", () => {
        const pedido = service.criarPedido(1)
        pedido.status = StatusPedido.CONFIRMADO
        expect(() => service.confirmarPedido(1)).toThrow()
    })

    test("deve cancelar um pedido que não foi entregue ou finalizado", () => {
        const pedido = service.criarPedido(1)
        const cancelado = service.cancelarPedido(1)
        expect(cancelado.status).toBe(StatusPedido.CANCELADO)
    })

    test("deve lançar erro ao cancelar pedido entregue", () => {
        const pedido = service.criarPedido(1)
        pedido.status = StatusPedido.ENTREGUE
        expect(() => service.cancelarPedido(1)).toThrow()
    })

    test("deve finalizar um pedido entregue", () => {
        const pedido = service.criarPedido(1)
        pedido.status = StatusPedido.ENTREGUE
        const finalizado = service.finalizarPedido(1)
        expect(finalizado.status).toBe(StatusPedido.FINALIZADO)
    })

    test("deve lançar erro ao finalizar pedido não entregue", () => {
        service.criarPedido(1)
        expect(() => service.finalizarPedido(1)).toThrow()
    })

    test("deve lançar erro ao listar pedido não confirmado", () => {
        service.criarPedido(1)
        expect(() => service.listarPedido(1)).toThrow("Erro ao encontrar pedido")
    })

    test("deve listar pedido confirmado", () => {
        const pedido = service.criarPedido(1)
        pedido.status = StatusPedido.CONFIRMADO
        const retorno = service.listarPedido(1)
        expect(retorno.id).toBe(1)
    })
})
