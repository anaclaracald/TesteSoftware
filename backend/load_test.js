import http from 'k6/http';
import { check, sleep } from 'k6';

// Define as opções do teste de carga
export let options = {
    // Definindo estágios para simular diferentes cargas
    stages: [
        { duration: '30s', target: 10 },  // Rampa para 10 usuários em 30 segundos
        { duration: '1m', target: 50 },   // Mantém 50 usuários por 1 minuto
        { duration: '30s', target: 10 },  // Rampa para 10 usuários em 30 segundos
        { duration: '10s', target: 0 },   // Rampa para 0 usuários em 10 segundos
    ],
    // Definindo limiares para o sucesso do teste
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições devem ser concluídas em menos de 500ms
        http_req_failed: ['rate<0.01'],  // A taxa de requisições falhas deve ser menor que 1%
    },
};

// Função principal que cada usuário virtual (VU) irá executar
export default function () {
    const baseUrl = 'http://localhost:3000'; // URL base do seu backend Node.js

    // --- Cenário de Cadastro de Usuário (POST /usuarios) ---
    // Gerar dados únicos para cada usuário virtual e iteração
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    const nome = `UsuarioTeste_${uniqueId}`;
    const email = `email_teste_${uniqueId}@example.com`;
    const senha = 'password123';

    const registerPayload = JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
    });

    console.log(`[VU:${__VU}] Tentando cadastrar: ${email}`); // Para depuração

    let registerRes = http.post(`${baseUrl}/usuarios`, registerPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(registerRes, {
        'Cadastro: status é 201 (Created) ou 400 (Email já existe)': (r) => r.status === 201 || (r.status === 400 && r.body.includes("Email já cadastrado")),
        'Cadastro: resposta contém ID do usuário (se 201)': (r) => r.status === 201 ? r.json() && r.json().id !== '' : true,
    });

    // Se o cadastro falhou porque o email já existe, podemos tentar fazer login com ele
    // ou simplesmente seguir para o login para não falhar o fluxo completo
    // Para simplificar, vamos tentar login com o mesmo email/senha
    sleep(0.5); // Pequena pausa

    // --- Cenário de Login (POST /login) ---
    const loginPayload = JSON.stringify({
        email: email,
        senha: senha,
    });

    console.log(`[VU:${__VU}] Tentando login com: ${email}`); // Para depuração

    let loginRes = http.post(`${baseUrl}/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'Login: status é 200 (OK)': (r) => r.status === 200,
        'Login: resposta contém token JWT': (r) => r.json() && r.json().token !== '',
    });

    let authToken = '';
    if (loginRes.status === 200 && loginRes.json() && loginRes.json().token) {
        authToken = loginRes.json().token;
        console.log(`[VU:${__VU}] Login bem-sucedido. Token obtido.`); // Para depuração
    } else {
        console.error(`[VU:${__VU}] Falha no login ou token não encontrado: Status ${loginRes.status}, Body: ${loginRes.body}`); // Para depuração
    }

    sleep(0.5); // Pequena pausa

    // --- Cenário de Acesso à Rota Protegida (GET /me) ---
    if (authToken) { // Só tenta acessar se o token foi obtido
        console.log(`[VU:${__VU}] Acessando rota protegida /me`); // Para depuração
        let meRes = http.get(`${baseUrl}/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        check(meRes, {
            'Rota Protegida /me: status é 200 (OK)': (r) => r.status === 200,
            'Rota Protegida /me: resposta contém ID do usuário': (r) => r.json() && r.json().id !== '',
        });

        if (meRes.status !== 200) {
            console.error(`[VU:${__VU}] Falha ao acessar /me: Status ${meRes.status}, Body: ${meRes.body}`); // Para depuração
        }

    } else {
        console.log(`[VU:${__VU}] Pulando acesso à rota protegida pois o token não foi obtido.`);
    }

    sleep(1); // Pausa maior entre as iterações do fluxo completo
}