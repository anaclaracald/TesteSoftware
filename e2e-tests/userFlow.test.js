const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai'); // Para asserções
require('chromedriver');

describe('Fluxo de Usuário E2E no Cardápio Digital', function() {
    this.timeout(60000); 

    let driver;
    const baseUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/index.html';
    const criarContaUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/criar-conta.html';
    const loginUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/index.html'; // Página de login é a index.html
    const paginaProtegidaUrl = 'file:///Users/anaclaracadeira/Downloads/Projeto_testeSoftware-main/frontend/perfil.html';
    const carrinhoUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/carrinho.html';
    const esqueceuSenhaUrl = 'file:///Users/anaclaracaldeira/Downloads/Projeto_testeSoftware-main/frontend/esqueceu-senha.html';

    // Variáveis para um usuário que será registrado e usado em múltiplos testes de login/logout
    let registeredEmail = '';
    let registeredPassword = '';
    let registeredName = '';

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        // Gerar um usuário e senha únicos para os testes que precisam de login prévio
        const timestamp = Date.now();
        registeredEmail = `reusetestuser${timestamp}@example.com`;
        registeredPassword = 'ReusablePassword123!';
        registeredName = `Reusable User ${timestamp}`;

        // Realizar o cadastro inicial para os testes subsequentes
        console.log('Setup: Registrando usuário para testes subsequentes...');
        await driver.get(criarContaUrl);
        await driver.wait(until.urlContains('criar-conta.html'), 5000);

        await driver.findElement(By.id('nome')).sendKeys(registeredName);
        await driver.findElement(By.id('email')).sendKeys(registeredEmail);
        await driver.findElement(By.id('senha')).sendKeys(registeredPassword);
        await driver.findElement(By.id('senha_confirmacao')).sendKeys(registeredPassword); // ID correto para criar-conta.html
        await driver.findElement(By.css('#cadastro_form button[type="submit"]')).click(); // Seletor para o botão de submit do formulário de cadastro

        // Espera por qualquer uma das URLs possíveis: confirmação, index (login), ou perfil (se o login for automático)
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            console.log('Aguardando redirecionamento... URL atual:', url);

            return url.includes('confirmacao-cadastro.html') ||
                   url.includes('index.html') ||
                   url.includes('perfil.html');
        }, 30000);
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('confirmacao-cadastro.html')) {
            console.log('Setup: Redirecionado para página de confirmação. Clicando para ir para o login...');
            await driver.findElement(By.xpath('//button[text()="IR PARA LOGIN"]')).click();
            await driver.wait(until.urlContains('index.html'), 5000);
        } else if (currentUrl.includes('perfil.html')) {
            console.log('Setup: Redirecionado diretamente para a página de perfil após o cadastro.');
            try {
                const logoutButton = await driver.findElement(By.id('logout-button') || By.xpath('//button[text()="Sair"]') || By.css('.btn-logout'));
                await logoutButton.click();
                await driver.wait(until.urlContains('index.html'), 5000);
                console.log('Setup: Logout realizado após o cadastro automático.');
            } catch (error) {
                console.warn('Setup: Não foi possível realizar logout automático após o cadastro. Testes subsequentes podem ser afetados. Erro: ' + error.message);
            }
        } else if (currentUrl.includes('index.html')) {
             console.log('Setup: Redirecionado diretamente para a página inicial (login) após o cadastro.');
        }
        console.log('Setup: Usuário registrado e pronto para login.');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    // Teste existente: Cadastro e Login de Novo Usuário (totalmente isolado)
    it('Deve permitir que um novo usuário se cadastre e faça login', async function() {
        console.log('Teste: Navegando para a página de criação de conta (novo usuário)...');
        await driver.get(criarContaUrl);
        await driver.wait(until.urlContains('criar-conta.html'), 5000);

        const timestamp = Date.now();
        const uniqueEmail = `newuser${timestamp}@example.com`;
        const userName = `New TestUser ${timestamp}`;
        const password = 'NewPassword123!';

        console.log('Teste: Preenchendo formulário de cadastro (novo usuário)...');
        await driver.findElement(By.id('nome')).sendKeys(userName);
        await driver.findElement(By.id('email')).sendKeys(uniqueEmail);
        await driver.findElement(By.id('senha')).sendKeys(password);
        await driver.findElement(By.id('senha_confirmacao')).sendKeys(password); // ID correto

        await driver.findElement(By.css('#cadastro_form button[type="submit"]')).click(); // Seletor para o botão de submit do formulário de cadastro

        console.log('Teste: Verificando redirecionamento após cadastro...');
        await driver.wait(until.urlContains('confirmacao-cadastro.html') || until.urlContains('index.html') || until.urlContains('perfil.html'), 15000);

        const currentUrlAfterRegistration = await driver.getCurrentUrl();
        if (currentUrlAfterRegistration.includes('confirmacao-cadastro.html')) {
            console.log('Teste: Redirecionado para página de confirmação. Clicando para ir para o login...');
            await driver.findElement(By.xpath('//button[text()="IR PARA LOGIN"]')).click();
            await driver.wait(until.urlContains('index.html'), 5000);
        } else if (currentUrlAfterRegistration.includes('perfil.html')) {
            console.log('Teste: Redirecionado diretamente para a página de perfil após o cadastro. Pulando etapa de login.');
        } else if (currentUrlAfterRegistration.includes('index.html')) {
             console.log('Teste: Redirecionado para a página inicial (login) após o cadastro, preenchendo login...');
        } else {
            expect.fail(`Redirecionamento inesperado após cadastro: ${currentUrlAfterRegistration}`);
        }


        // Somente se não estiver já na página de perfil, tenta fazer login
        if (!currentUrlAfterRegistration.includes('perfil.html')) {
            console.log('Teste: Preenchendo formulário de login...');
            await driver.findElement(By.id('email')).sendKeys(uniqueEmail); 
            await driver.findElement(By.id('senha')).sendKeys(password); 
            await driver.findElement(By.css('.login-formulario button[type="submit"]')).click(); 
        }


        console.log('Teste: Verificando redirecionamento para a página protegida (perfil.html)...');
        await driver.wait(until.urlContains('perfil.html'), 10000);
        const title = await driver.getTitle();
        expect(title).to.include('Perfil');

        console.log('Teste de cadastro e login de novo usuário concluído com sucesso!');
    });

    // Login de Usuário Existente (reutiliza o usuário do before)
    it('Deve permitir que um usuário existente faça login', async function() {
        console.log('Teste: Tentando login com usuário existente...');
        await driver.get(loginUrl);
        await driver.wait(until.urlContains('index.html'), 5000);

        await driver.findElement(By.id('email')).sendKeys(registeredEmail); 
        await driver.findElement(By.id('senha')).sendKeys(registeredPassword); 
        await driver.findElement(By.css('.login-formulario button[type="submit"]')).click(); 

        console.log('Teste: Verificando redirecionamento para a página de perfil após login existente...');
        await driver.wait(until.urlContains('perfil.html'), 10000);
        const title = await driver.getTitle();
        expect(title).to.include('Perfil');
        console.log('Teste: Login de usuário existente realizado com sucesso!');
    });

    // Login com Credenciais Inválidas
    it('Deve exibir mensagem de erro para login com credenciais inválidas', async function() {
        console.log('Teste: Tentando login com credenciais inválidas...');
        await driver.get(loginUrl);
        await driver.wait(until.urlContains('index.html'), 5000);
        console.log('Teste: Verificando mensagem de erro...');
        let errorMessageElement;
        await driver.findElement(By.id('senha')).sendKeys('WrongPassword123'); 
        await driver.findElement(By.css('.login-formulario button[type="submit"]')).click(); 

        console.log('Teste: Verificando se a mensagem de erro é exibida...');

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('.erro-login') || By.id('mensagem-erro-login') || By.xpath("//*[contains(text(),'credenciais inválidas')]")),
            5000
        );
        const errorText = await errorMessage.getText();

        expect(errorText.toLowerCase()).to.include('inválido');
        console.log(`Teste: Mensagem de erro exibida corretamente: "${errorText}"`);
    
    });

    // Solicitação de Redefinição de Senha
    it('Deve permitir que o usuário solicite a redefinição de senha', async function() {
        console.log('Teste: Navegando para a página de esqueceu a senha...');
        await driver.get(esqueceuSenhaUrl);
        await driver.wait(until.urlContains('esqueceu-senha.html'), 5000);

        console.log('Teste: Preenchendo email para redefinição de senha...');
        await driver.findElement(By.id('email-recuperacao')).sendKeys(registeredEmail);
        await driver.findElement(By.id('btn-enviar-recuperacao')).click();

        console.log('Teste: Verificando mensagem de sucesso da redefinição de senha ou redirecionamento...');
        let successElementFound = false;
        try {
            const successMessageElement = await driver.wait(until.elementLocated(By.id('success-message-reset') || By.css('.success-message-reset') || By.xpath('//*[contains(text(), "enviado")]')), 10000);
            const successMessageText = await successMessageElement.getText();
            expect(successMessageText).to.include('enviado' || 'sucesso' || 'redefinição');
            console.log(`Teste: Mensagem de sucesso exibida: "${successMessageText}"`);
            successElementFound = true;
        } catch (e) {
            console.log('Teste: Mensagem de sucesso na mesma página não encontrada, verificando redirecionamento para a página inicial...');
            await driver.wait(until.urlContains('index.html'), 5000)
                .catch(() => console.warn('Não foi redirecionado para a página inicial após solicitação de redefinição de senha. Erro: ' + e.message));
            const currentUrlAfterReset = await driver.getCurrentUrl();
            if (currentUrlAfterReset.includes('index.html')) {
                console.log('Teste: Redirecionado para a página inicial após solicitação de redefinição.');
                successElementFound = true;
            }
        }

        if (!successElementFound) {
            expect.fail('Nenhuma mensagem de sucesso de redefinição de senha foi encontrada e não houve redirecionamento esperado.');
        }
    });

    // Navegação para a Página do Carrinho após Login
    it('Deve permitir que o usuário navegue para a página do carrinho após o login', async function() {
        console.log('Teste: Fazendo login para navegar para o carrinho...');
        await driver.get(loginUrl);
        await driver.wait(until.urlContains('index.html'), 5000);

        await driver.findElement(By.id('email')).sendKeys(registeredEmail);
        await driver.findElement(By.id('senha')).sendKeys(registeredPassword);
        await driver.findElement(By.css('.login-formulario button[type="submit"]')).click();
        await driver.wait(until.urlContains('perfil.html'), 10000);

        console.log('Teste: Navegando para a página do carrinho...');
        const cartLink = await driver.findElement(By.css('.carrinho-btn'));
        await cartLink.click();

        await driver.wait(until.urlContains('carrinho.html'), 10000);
        const title = await driver.getTitle();
        expect(title).to.include('Carrinho'); 
        console.log('Teste: Navegação para o carrinho bem-sucedida.');
    });

    // Funcionalidade de Logout
    it('Deve permitir que o usuário faça logout', async function() {
        console.log('Teste: Fazendo login para realizar o logout...');
        await driver.get(loginUrl);
        await driver.wait(until.urlContains('index.html'), 5000);

        await driver.findElement(By.id('email')).sendKeys(registeredEmail);
        await driver.findElement(By.id('senha')).sendKeys(registeredPassword);
        await driver.findElement(By.css('.login-formulario button[type="submit"]')).click();
        await driver.wait(until.urlContains('perfil.html'), 10000);

        console.log('Teste: Tentando fazer logout...');
        const logoutButton = await driver.findElement(By.id('logout-button') || By.xpath('//button[text()="Sair"]') || By.css('.btn-logout'));
        await logoutButton.click();

        console.log('Teste: Verificando redirecionamento para a página inicial após logout...');
        await driver.wait(until.urlContains('index.html'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('index.html');

        console.log('Teste: Tentando acessar página protegida após logout...');
        await driver.get(paginaProtegidaUrl);
        // Espera que a URL mude para a página de login ou um erro de acesso
        await driver.wait(until.urlContains('index.html') || until.urlContains('login.html'), 5000)
            .catch(() => console.warn('Não foi redirecionado para a página de login/inicial após tentar acessar a página protegida.'));

        const finalUrl = await driver.getCurrentUrl();
        expect(finalUrl).to.include('index.html'); 
        console.log('Teste: Logout concluído com sucesso e acesso à página protegida negado.');
    });

});
