const express = require('express');
const cors = require('cors');
const app = express();

const { db, auth } = require('./config/firebase');
const Usuario = require('./models/Usuario'); 

const clienteService = require('./services/ClienteService');
const funcionarioService = require('./services/FuncionarioService');
const gerenteService = require('./services/GerenteService');
const produtoService = require('./services/ProdutoService');
const pedidoService = require('./services/PedidoService');
const authMiddleware = require('./middlewares/authMiddleware');

// Middleware para JSON
app.use(express.json());

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5500', 'null', 'http://127.0.0.1:5500'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rotas de Usuário (Públicas) - Agora usando diretamente os métodos da classe Usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const novoUsuario = await Usuario.criar(nome, email, senha); 
        res.status(201).send(novoUsuario);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const { token, usuario } = await Usuario.login(email, senha);
        res.status(200).send({ token, usuario });
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
});

// Rotas Protegidas (Exigem Autenticação)
app.get('/me', authMiddleware, async (req, res) => {
    try {
        res.status(200).send({ id: req.usuario.id, email: req.usuario.email, tipo: req.usuario.tipo });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao obter dados do usuário autenticado.' });
    }
});

// Rotas de Cliente
app.post('/clientes', authMiddleware, async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const novoCliente = await clienteService.criarCliente(nome, email, telefone);
        res.status(201).send(novoCliente);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/clientes/:id', authMiddleware, async (req, res) => {
    try {
        const cliente = await clienteService.buscarClientePorId(req.params.id);
        if (!cliente) {
            return res.status(404).send({ message: 'Cliente não encontrado.' });
        }
        res.status(200).send(cliente);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Rotas de Funcionário
app.post('/funcionarios', authMiddleware, async (req, res) => {
    try {
        const { nome, email, cargo } = req.body;
        const novoFuncionario = await funcionarioService.criarFuncionario(nome, email, cargo);
        res.status(201).send(novoFuncionario);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/funcionarios/:id', authMiddleware, async (req, res) => {
    try {
        const funcionario = await funcionarioService.buscarFuncionarioPorId(req.params.id);
        if (!funcionario) {
            return res.status(404).send({ message: 'Funcionário não encontrado.' });
        }
        res.status(200).send(funcionario);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Rotas de Gerente
app.post('/gerentes', authMiddleware, async (req, res) => {
    try {
        const { nome, email, departamento } = req.body;
        const novoGerente = await gerenteService.criarGerente(nome, email, departamento);
        res.status(201).send(novoGerente);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/gerentes/:id', authMiddleware, async (req, res) => {
    try {
        const gerente = await gerenteService.buscarGerentePorId(req.params.id);
        if (!gerente) {
            return res.status(404).send({ message: 'Gerente não encontrado.' });
        }
        res.status(200).send(gerente);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Rotas de Produto
app.post('/produtos', authMiddleware, async (req, res) => {
    try {
        const { nome, descricao, preco, categoria } = req.body;
        const novoProduto = await produtoService.criarProduto(nome, descricao, preco, categoria);
        res.status(201).send(novoProduto);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/produtos/:id', authMiddleware, async (req, res) => {
    try {
        const produto = await produtoService.buscarProdutoPorId(req.params.id);
        if (!produto) {
            return res.status(404).send({ message: 'Produto não encontrado.' });
        }
        res.status(200).send(produto);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Rotas de Pedido
app.post('/pedidos', authMiddleware, async (req, res) => {
    try {
        const { clienteId, produtos } = req.body;
        const novoPedido = await pedidoService.criarPedido(clienteId, produtos);
        res.status(201).send(novoPedido);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/pedidos/:id', authMiddleware, async (req, res) => {
    try {
        const pedido = await pedidoService.buscarPedidoPorId(req.params.id);
        if (!pedido) {
            return res.status(404).send({ message: 'Pedido não encontrado.' });
        }
        res.status(200).send(pedido);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});