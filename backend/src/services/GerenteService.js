const Gerente = require("../models/Gerente")

class GerenteService {
    constructor() {
        this._gerentes = []
        this._proximoId = 1
    }

    cadastrarGerente(nome, email, senha) {
        const novoGerente = new Gerente(this._proximoId++, nome, email, senha)
        this._gerentes.push(novoGerente)
        return novoGerente
    }

    autenticarGerente(email, senha) {
        const gerente = this._gerentes.find((item) => item.email === email && item.senha === senha)
        if (!gerente) throw new Error("Email ou senha inválidos.")
        return gerente
    }

    deletarGerente(email) {
        const tamanhoOriginal = this._gerentes.length;
        this._gerentes = this._gerentes.filter(item => item.email !== email)
        if (this._gerentes.length === tamanhoOriginal) throw new Error("Gerente não encontrado.")
    }

    buscarGerente(email) {
        const gerente = this._gerentes.find((item) => item.email === email)
        if (!gerente) throw new Error("Gerente não encontrado.")
        return gerente
    }

    listarTodosGerentes() {
        return this._gerentes
    }
}

module.exports = GerenteService