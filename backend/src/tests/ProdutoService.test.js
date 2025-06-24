const ProdutoService = require("../services/ProdutoService")
const Produto = require("../models/Produto")

jest.mock("../models/Produto")

describe("ProdutoService", () => {
    let service

    beforeEach(() => {
        service = new ProdutoService()
        Produto.mockImplementation((id, descricao, quantidade) => ({ id, descricao, quantidade }))
    })

    test("deve criar um produto", () => {
        const produto = service.criarProduto("Camiseta", 10)
        expect(produto).toEqual({ id: 1, descricao: "Camiseta", quantidade: 10 })
    })

    test("deve editar um produto existente", () => {
        service.criarProduto("Calça", 5)
        const editado = service.editarProduto(1, "Calça Jeans", 7)
        expect(editado.descricao).toBe("Calça Jeans")
        expect(editado.quantidade).toBe(7)
    })

    test("deve deletar um produto existente", () => {
        service.criarProduto("Boné", 3)
        service.deletarProduto(1)
        expect(service.listarTodosProdutos().length).toBe(0)
    })

    test("deve lançar erro ao deletar produto inexistente", () => {
        expect(() => service.deletarProduto(999)).toThrow("Produto não encontrado.")
    })

    test("deve buscar um produto por id", () => {
        service.criarProduto("Jaqueta", 2)
        const produto = service.buscarProdutoPorId(1)
        expect(produto.descricao).toBe("Jaqueta")
    })

    test("deve lançar erro ao buscar produto inexistente", () => {
        expect(() => service.buscarProdutoPorId(999)).toThrow("Erro ao encontrar produto.")
    })
})
