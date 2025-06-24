document.addEventListener('DOMContentLoaded', () => {
    const formCriarConta = document.getElementById('criar-conta-form');

    if (formCriarConta) {
        formCriarConta.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            try {
                // A URL da API deve ser a do seu backend
                const response = await fetch('http://localhost:3000/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Conta criada com sucesso!');
                    // Redireciona para a página de confirmação de cadastro ou login
                    window.location.href = 'confirmacao-cadastro.html'; 
                } else {
                    alert(`Erro ao criar conta: ${data.message || 'Erro desconhecido'}`);
                }
            } catch (error) {
                console.error('Erro de rede ou ao processar a requisição:', error);
                alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
            }
        });
    }
});