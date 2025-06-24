const ClienteService = require("../services/ClienteService");
jest.mock('firebase/app');
jest.mock('firebase/firestore');

describe('ClienteService', () => {
    let service;

    beforeEach(() => {
        service = new ClienteService();
    });

    it('deve cadastrar um cliente', () => {
        const cliente = service.cadastrarCliente("Ana", "ana@email.com", "1234");
        expect(cliente.nome).toBe("Ana");
        expect(service.listarTodosClientes()).toHaveLength(1);
    });

    it('deve autenticar cliente com email e senha corretos', () => {
        service.cadastrarCliente("Ana", "ana@email.com", "1234");
        const cliente = service.autenticarCliente("ana@email.com", "1234");
        expect(cliente.nome).toBe("Ana");
    });

    it('deve lançar erro ao autenticar cliente com senha errada', () => {
        service.cadastrarCliente("Ana", "ana@email.com", "1234");
        expect(() => {
            service.autenticarCliente("ana@email.com", "0000");
        }).toThrow("Email ou senha inválidos.");
    });

    it('deve deletar cliente existente', () => {
        service.cadastrarCliente("Ana", "ana@email.com", "1234");
        service.deletarCliente("ana@email.com");
        expect(service.listarTodosClientes()).toHaveLength(0);
    });

    it('deve lançar erro ao deletar cliente inexistente', () => {
        expect(() => {
            service.deletarCliente("naoexiste@email.com");
        }).toThrow("Cliente não encontrado.");
    });

    it('deve buscar cliente por email', () => {
        service.cadastrarCliente("Ana", "ana@email.com", "1234");
        const cliente = service.buscarCliente("ana@email.com");
        expect(cliente.nome).toBe("Ana");
    });

    it('deve lançar erro ao buscar cliente inexistente', () => {
        expect(() => {
            service.buscarCliente("naoexiste@email.com");
        }).toThrow("Cliente não encontrado.");
    });
});
