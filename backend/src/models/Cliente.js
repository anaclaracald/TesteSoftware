const Usuario = require("./Usuario")

class Cliente extends Usuario {
    constructor(id, nome, email, senha) {
        super(id, nome, email, senha)
    }
}

module.exports = Cliente
