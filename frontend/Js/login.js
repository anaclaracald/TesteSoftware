document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;

            try {
                // A URL da API deve ser a do seu backend
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // Armazena o token JWT no localStorage
                    localStorage.setItem('jwtToken', data.token);
                    alert('Login bem-sucedido!');
                    // Redireciona para a página protegida (perfil.html)
                    window.location.href = 'perfil.html';
                } else {
                    alert(`Erro no login: ${data.message || 'Credenciais inválidas'}`);
                }
            } catch (error) {
                console.error('Erro de rede ou ao processar a requisição:', error);
                alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
            }
        });
    }
});