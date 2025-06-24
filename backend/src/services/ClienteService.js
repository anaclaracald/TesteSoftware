const Cliente = require("../models/Cliente")

class ClienteService {
    constructor() {
        this._clientes = []
        this._proximoId = 1
    }

    cadastrarCliente(nome, email, senha) {
        const novoCliente = new Cliente(this._proximoId++, nome, email, senha)
        this._clientes.push(novoCliente)
        return novoCliente
    }

    autenticarCliente(email, senha) {
        const cliente = this._clientes.find((item) => item.email === email && item.senha === senha)
        if (!cliente) throw new Error("Email ou senha inválidos.")
        return cliente
    }

    deletarCliente(email) {
        const tamanhoOriginal = this._clientes.length;
        this._clientes = this._clientes.filter(item => item.email !== email)
        if (this._clientes.length === tamanhoOriginal) throw new Error("Cliente não encontrado.")
    }

    buscarCliente(email) {
        const cliente = this._clientes.find((item) => item.email === email)
        if (!cliente) throw new Error("Cliente não encontrado.")
        return cliente
    }

    listarTodosClientes() {
        return this._clientes
    }
}

module.exports = ClienteService
