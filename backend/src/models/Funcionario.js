const Usuario = require("./Usuario")

class Funcionario extends Usuario {
    constructor(id, nome, email, senha) {
        super(id, nome, email, senha)
    }
}

module.exports = Funcionario
