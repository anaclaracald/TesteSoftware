const FuncionarioService = require("../services/FuncionarioService");

describe("FuncionarioService", () => {
    let service;

    beforeEach(() => {
        service = new FuncionarioService();
    });

    test("deve cadastrar um funcionário", () => {
        const funcionario = service.cadastrarFuncionario("Lucas", "lucas@example.com", "abcd");
        expect(funcionario).toMatchObject({
            _id: 1,
            _nome: "Lucas",
            _email: "lucas@example.com",
            _senha: "abcd"
        });
        expect(service.listarTodosFuncionarios()).toHaveLength(1);
    });

    test("deve autenticar funcionário com credenciais válidas", () => {
        service.cadastrarFuncionario("Lucas", "lucas@example.com", "abcd");
        const funcionario = service.autenticarFuncionario("lucas@example.com", "abcd");
        expect(funcionario.nome).toBe("Lucas");
    });

    test("deve lançar erro ao autenticar funcionário com senha inválida", () => {
        service.cadastrarFuncionario("Lucas", "lucas@example.com", "abcd");
        expect(() => {
            service.autenticarFuncionario("lucas@example.com", "errada");
        }).toThrow("Email ou senha inválidos.");
    });

    test("deve deletar funcionário existente", () => {
        service.cadastrarFuncionario("Lucas", "lucas@example.com", "abcd");
        service.deletarFuncionario("lucas@example.com");
        expect(service.listarTodosFuncionarios()).toHaveLength(0);
    });

    test("deve lançar erro ao deletar funcionário inexistente", () => {
        expect(() => {
            service.deletarFuncionario("naoexiste@example.com");
        }).toThrow("Funcionário não encontrado.");
    });

    test("deve buscar funcionário por email", () => {
        service.cadastrarFuncionario("Lucas", "lucas@example.com", "abcd");
        const funcionario = service.buscarFuncionario("lucas@example.com");
        expect(funcionario.email).toBe("lucas@example.com");
    });

    test("deve lançar erro ao buscar funcionário inexistente", () => {
        expect(() => {
            service.buscarFuncionario("naoexiste@example.com");
        }).toThrow("Funcionário não encontrado.");
    });
});
