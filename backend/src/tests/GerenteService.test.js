const GerenteService = require("../services/GerenteService");

describe("GerenteService", () => {
    let service;

    beforeEach(() => {
        service = new GerenteService();
    });

    test("deve cadastrar um gerente", () => {
        const gerente = service.cadastrarGerente("Ana", "ana@example.com", "1234");
        expect(gerente).toMatchObject({
            id: 1,
            nome: "Ana",
            email: "ana@example.com"
        });
    });

    test("deve autenticar gerente com email e senha corretos", () => {
        service.cadastrarGerente("Ana", "ana@example.com", "1234");
        const gerente = service.autenticarGerente("ana@example.com", "1234");
        expect(gerente.email).toBe("ana@example.com");
    });

    test("deve lançar erro ao autenticar gerente com dados inválidos", () => {
        service.cadastrarGerente("Ana", "ana@example.com", "1234");
        expect(() => {
            service.autenticarGerente("ana@example.com", "senhaErrada");
        }).toThrow("Email ou senha inválidos.");
    });

    test("deve deletar gerente existente", () => {
        service.cadastrarGerente("Ana", "ana@example.com", "1234");
        service.deletarGerente("ana@example.com");
        expect(service.listarTodosGerentes()).toHaveLength(0);
    });

    test("deve lançar erro ao deletar gerente inexistente", () => {
        expect(() => {
            service.deletarGerente("naoexiste@example.com");
        }).toThrow("Gerente não encontrado.");
    });

    test("deve buscar gerente por email", () => {
        service.cadastrarGerente("Ana", "ana@example.com", "1234");
        const gerente = service.buscarGerente("ana@example.com");
        expect(gerente.nome).toBe("Ana");
    });

    test("deve lançar erro ao buscar gerente inexistente", () => {
        expect(() => {
            service.buscarGerente("naoexiste@example.com");
        }).toThrow("Gerente não encontrado.");
    });
});
