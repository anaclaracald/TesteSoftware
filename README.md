# Cardápio Digital

##### **Disciplina:** Teste de Software  
##### **Curso:** Ciência da Computação  
##### **Instituição:** Universidade Católica de Brasília  

---

## Introdução

O projeto **Cardápio Digital** é uma solução desenvolvida com o propósito de modernizar e otimizar o atendimento em restaurantes. A proposta consiste em um website responsivo que permite que clientes realizem pedidos de forma automatizada, funcionários acompanhem as entregas, e gerentes tenham controle completo sobre o cardápio e desempenho da equipe.

---

## Problemática e Soluções

**Ineficiência no atendimento e insatisfação dos clientes.**  
A solução proposta é um cardápio digital que oferece:

- Visualização de pratos em tempo real;
- Pedidos online;
- Acompanhamento de pedidos;
- Gestão de desempenho por parte dos gerentes.

---

## Objetivos

- Automatizar o processo de atendimento de restaurantes;
- Reduzir erros e atrasos em pedidos;
- Melhorar a experiência do cliente;
- Facilitar o gerenciamento de produtos e pedidos.

---

## Tecnologias Utilizadas

| Camada         | Ferramentas                                      |
|----------------|--------------------------------------------------|
| **Front-end**  | HTML, CSS, JavaScript               |
| **Back-end**   | Node, Express                                         |
| **Testes**     | Jest|
| **Banco de Dados** | Firebase                          |
| **Prototipação** | Figma                                         |
| **Gerenciamento** | Trello                                       |
| **Versionamento** | GitHub                                 |

---

### Tipos de Usuários

| Usuário     | Responsabilidades |
|-------------|-------------------|
| **Cliente** | Cadastrar, fazer pedidos. |
| **Funcionário** | Organizar pedidos para a realização da entrega. |
| **Gerente** | Cadastrar/remover produtos, gerar relatórios, visualizar histórico. |

---

## Funcionalidades Principais

| Código | Funcionalidade               | Descrição                                                                 |
|--------|------------------------------|---------------------------------------------------------------------------|
| RN1    | Acesso ao cardápio           | Via QR Code ou link.                                                       |
| RN2    | Atualização em tempo real    | Alterações refletem instantaneamente.                                     |
| RN3    | Exibição de disponibilidade  | Apenas produtos em estoque são exibidos.                                  |
| RN4    | Restrição por horário        | Pedidos só são aceitos durante o funcionamento.                           |
| RN5    | Personalização de pedidos    | Seleção de adicionais, observações e modificações.                        |

---

## Requisitos

### Requisitos Funcionais

- **RF1:** Cadastro de cliente com nome, email e senha.
- **RF2:** Consulta de cardápio com imagens, descrições, preços e tempo de preparo.
- **RF3:** Pedido online com carrinho e acompanhamento de status.
- **RF4:** Gerenciamento do cardápio pelo gerente.
- **RF5:** Cadastro de funcionários pelo gerente.
- **RF6:** Visualização de pedidos por mesa pelos atendentes.

### Requisitos Não Funcionais

- **RNF1:** Segurança dos dados dos usuários.
- **RNF2:** Baixo tempo de resposta.
- **RNF3:** Sistema disponível durante horário de atendimento.
- **RNF4:** Compatibilidade com navegadores web.
- **RNF5:** Escalabilidade para muitos usuários simultâneos.
- **RNF6:** Acessibilidade para pessoas com limitações.

---

## Restrições

- Cadastro obrigatório antes de realizar pedidos ou interagir com conteúdos;
- Cadastro de prestadores exige formulário com currículo e experiências.

---

## Riscos Identificados

| ID       | Descrição                                                                 | Impacto |
|----------|---------------------------------------------------------------------------|---------|
| Risco 01 | Profissional não cumprir prazo                                            | Alto    |
| Risco 02 | Atraso no atendimento ao cliente                                          | Médio   |
| Risco 03 | Cliente em local de difícil acesso                                        | Baixo   |
| Risco 04 | Profissional não responde ao chamado                                      | Baixo   |
| Risco 05 | Cliente sem acesso à internet impede uso do sistema                      | Alto    |

---

## Diagramas

- **Diagrama de Casos de Uso:** Ilustra os principais atores (cliente, funcionário, gerente) e suas interações com o sistema.
- **Diagrama de Classes:** Apresenta as entidades principais, atributos e métodos, e como se relacionam entre si.

---
## Pré-requisito para rodar o projeto
- Ter Javascript e node.js instalados na máquina

## Repositório

```bash 
git clone https://github.com/anaclaracald/Projeto_testeSoftware.git
```

#### Código-fonte completo no GitHub

```bash 
https://github.com/anaclaracald/Projeto_testeSoftware
```

#### Instruções para teste
```bash
cd backend
npm install --save-dev jest
npm test -- --verbose 
```

---

## Envolvidos e Contribuições
Agradecemos a contribuição de todos os autores e orientadores do projeto.

**Orientador:** 
- Prof. Jefferson  

**Autores:**
- Alice Ferreira de Andrade – UC24100375
- Ana Clara Ferreira Caldeira – UC24101888
- Bárbara Marques Dantas – UC24101492
- Bruno Matias Santana – UC24103220
- Guilherme Almeida - UC24102391

---

### Funções do Time

| Função                  | Descrição                                            | Responsável     |
|-------------------------|------------------------------------------------------|-----------------|
| Análise de Requisitos   | Definição das regras de negócio e funcionalidades    | Bárbara         |
| Gerenciamento de Projeto| Organização das entregas e prazos                    | Alice           |
| Desenvolvimento (Front) | Implementação da interface e testes                  | Bruno           |
| Desenvolvimento (Back)  | Lógica de negócios e integração                      | Ana Clara       |
| Analíse e Projeto       | Definição e realização de requisitos do sistema      | Guilherme       |

---

## Licença 

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

---
