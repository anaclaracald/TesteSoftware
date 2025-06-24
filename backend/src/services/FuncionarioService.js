const Funcionario = require("../models/Funcionario")

class FuncionarioService {
    constructor() {
        this._funcionarios = []
        this._proximoId = 1
    }

    cadastrarFuncionario(nome, email, senha) {
        const novoFuncionario = new Funcionario(this._proximoId++, nome, email, senha)
        this._funcionarios.push(novoFuncionario)
        return novoFuncionario
    }

    autenticarFuncionario(email, senha) {
        const funcionario = this._funcionarios.find((item) => item.email === email && item.senha === senha)
        if (!funcionario) throw new Error("Email ou senha inválidos.")
        return funcionario
    }

    deletarFuncionario(email) {
        const tamanhoOriginal = this._funcionarios.length;
        this._funcionarios = this._funcionarios.filter(item => item.email !== email)
        if (this._funcionarios.length === tamanhoOriginal) throw new Error("Funcionário não encontrado.")
    }

    buscarFuncionario(email) {
        const funcionario = this._funcionarios.find((item) => item.email === email)
        if (!funcionario) throw new Error("Funcionário não encontrado.")
        return funcionario
    }

    listarTodosFuncionarios() {
        return this._funcionarios
    }
}

module.exports = FuncionarioService