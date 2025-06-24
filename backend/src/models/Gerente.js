const Usuario = require("./Usuario")

class Gerente extends Usuario {
    constructor(id, nome, email, senha) {
        super(id, nome, email, senha)
    }
}

module.exports = Gerente
