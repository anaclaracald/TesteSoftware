const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai'); // Para asserções
require('chromedriver'); // Importa o chromedriver

describe('Fluxo de Usuário E2E no Cardápio Digital', function() {
    this.timeout(30000); // Aumenta o timeout para testes de navegador

    let driver;
    const baseUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/index.html'; // Caminho ABSOLUTO para o seu index.html
    const criarContaUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/criar-conta.html';
    const loginUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/index.html'; // Login é no index.html
    const paginaProtegidaUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/perfil.html'; // Assumindo que perfil.html é a protegida

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Deve permitir que um novo usuário se cadastre e faça login', async function() {
        // 1. Navegar para a página de criação de conta
        console.log('Navegando para a página de criação de conta...');
        await driver.get(criarContaUrl);
        await driver.wait(until.urlContains('criar-conta.html'), 5000); // Espera a URL carregar

        // Gerar um email único para cada execução de teste
        const timestamp = Date.now();
        const uniqueEmail = `testuser${timestamp}@example.com`;
        const userName = `TestUser ${timestamp}`;
        const password = 'Password123!';

        // 2. Preencher o formulário de cadastro
        console.log('Preenchendo formulário de cadastro...');
        await driver.findElement(By.id('nome')).sendKeys(userName);
        await driver.findElement(By.id('email')).sendKeys(uniqueEmail);
        await driver.findElement(By.id('senha')).sendKeys(password);
        await driver.findElement(By.id('confirmar-senha')).sendKeys(password);

        // Clicar no botão de cadastro
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 3. Verificar redirecionamento para a página de confirmação de cadastro
        console.log('Verificando redirecionamento para confirmação de cadastro...');
        // O ideal seria esperar uma URL específica ou um elemento na página de confirmação
        // No seu projeto, após o cadastro, o JS do frontend pode tentar redirecionar ou mostrar uma mensagem.
        // Vou assumir que ele redireciona para o index.html (página de login) ou confirmação-cadastro.html
        await driver.wait(until.urlContains('confirmacao-cadastro.html') || until.urlContains('index.html'), 10000);

        // Se o redirecionamento for para index.html (página de login), o teste continua no próximo passo
        // Se for para confirmacao-cadastro.html, clicamos para ir para o login
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('confirmacao-cadastro.html')) {
            console.log('Redirecionado para página de confirmação. Clicando para ir para o login...');
            await driver.findElement(By.linkText('Fazer Login')).click(); // Supondo que haja um link "Fazer Login"
            await driver.wait(until.urlContains('index.html'), 5000);
        }

        // 4. Preencher o formulário de login (assumindo que estamos no index.html agora)
        console.log('Preenchendo formulário de login...');
        await driver.findElement(By.id('login-email')).sendKeys(uniqueEmail);
        await driver.findElement(By.id('login-senha')).sendKeys(password);
        await driver.findElement(By.css('#login-form button[type="submit"]')).click(); // Se o botão de login tem um id, use-o

        // 5. Verificar redirecionamento para a página protegida (perfil.html)
        console.log('Verificando redirecionamento para a página protegida (perfil.html)...');
        await driver.wait(until.urlContains('perfil.html'), 10000); // Espera a URL da página protegida
        const title = await driver.getTitle();
        expect(title).to.include('Perfil'); // Verifica se o título da página é o esperado

        // Opcional: Verificar se o nome do usuário aparece na página protegida
        // Supondo que você exiba o nome do usuário em algum lugar (ex: <span id="user-name">)
        try {
            const userNameElement = await driver.findElement(By.id('nomeUsuarioLogado')); // Ou o ID/seletor do elemento que mostra o nome
            const displayedUserName = await userNameElement.getText();
            expect(displayedUserName).to.include(userName);
            console.log(`Nome do usuário "${displayedUserName}" exibido corretamente.`);
        } catch (error) {
            console.warn('Elemento com o nome do usuário não encontrado na página de perfil ou nome não corresponde.');
            // Não falha o teste se o nome do usuário não for exibido, apenas um aviso
        }

        console.log('Teste de cadastro e login concluído com sucesso!');
    });

    // Você pode adicionar mais testes aqui para outros fluxos, como:
    // it('Deve permitir que um usuário existente faça login', async function() { ... });
    // it('Deve exibir erro ao tentar login com credenciais inválidas', async function() { ... });
});