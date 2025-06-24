document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('jwtToken');
  const nomeUsuarioLogadoElement = document.getElementById('nomeUsuarioLogado'); // ID do elemento para exibir o nome

  if (!token) {
      // Se não houver token, redireciona para a página de login
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = 'index.html';
      return;
  }

  try {
      // Faz uma requisição para a rota protegida /me no backend
      const response = await fetch('http://localhost:3000/me', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}` // Envia o token no cabeçalho Authorization
          }
      });

      const data = await response.json();

      if (response.ok) {
          // Se a requisição foi bem-sucedida, exibe as informações do usuário
          console.log('Dados do usuário autenticado:', data);
          if (nomeUsuarioLogadoElement) {
              nomeUsuarioLogadoElement.textContent = data.nome || data.email; // Ou data.nome se seu /me retornar o nome
          }
          // Você pode popular outros campos do perfil aqui
      } else {
          // Se houver um erro (ex: token inválido/expirado), redireciona para o login
          alert(`Erro ao carregar perfil: ${data.message || 'Sua sessão expirou. Faça login novamente.'}`);
          localStorage.removeItem('jwtToken'); // Remove o token inválido
          window.location.href = 'index.html';
      }
  } catch (error) {
      console.error('Erro de rede ou ao buscar dados do perfil:', error);
      alert('Não foi possível conectar ao servidor para carregar seu perfil. Tente novamente.');
      localStorage.removeItem('jwtToken'); // Remove o token caso o erro seja de conexão
      window.location.href = 'index.html';
  }

  // Adiciona o evento de logout
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', () => {
          localStorage.removeItem('jwtToken'); // Remove o token
          alert('Você foi desconectado.');
          window.location.href = 'index.html'; // Redireciona para a página de login
      });
  }
});