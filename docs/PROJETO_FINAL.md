# Kairo Lume — Projeto Final

## 1. Introdução

Kairo Lume é um aplicativo móvel de organização de tarefas pessoais. A proposta combina uma experiência simples de lista de tarefas com uma interface inspirada em editores de notas e espaços pessoais de organização, sem reproduzir funcionalidades específicas de outros aplicativos.

## 2. Objetivo

Permitir que o usuário cadastre, consulte, edite, conclua e exclua tarefas, organizando-as por categoria, prioridade e prazo.

## 3. Problema

Pessoas que precisam organizar estudos, trabalho e atividades pessoais podem perder tarefas ou prazos quando utilizam anotações dispersas. O aplicativo centraliza essas informações em uma lista simples e navegável.

## 4. Público-alvo

Estudantes e pessoas que precisam controlar atividades pessoais, acadêmicas ou profissionais de pequena escala.

## 5. Requisitos Funcionais

- RF01 — O sistema deverá permitir cadastrar uma tarefa.
- RF02 — O sistema deverá listar as tarefas cadastradas.
- RF03 — O sistema deverá permitir visualizar os detalhes de uma tarefa.
- RF04 — O sistema deverá permitir editar uma tarefa.
- RF05 — O sistema deverá permitir excluir uma tarefa.
- RF06 — O sistema deverá permitir marcar uma tarefa como concluída.
- RF07 — O sistema deverá permitir criar categorias para organizar tarefas.
- RF08 — O sistema deverá permitir filtrar tarefas por status e categoria.
- RF09 — O sistema deverá validar os campos obrigatórios dos formulários.

## 6. Requisitos Não Funcionais

- RNF01 — O aplicativo deverá possuir interface organizada e fácil de utilizar.
- RNF02 — O aplicativo deverá possuir textos legíveis e contraste adequado.
- RNF03 — O código deverá estar separado em componentes, telas, serviços, armazenamento e estilos.
- RNF04 — O aplicativo deverá apresentar mensagens claras em operações inválidas ou com erro.
- RNF05 — O aplicativo deverá funcionar em dispositivos móveis utilizando React Native e Expo.
- RNF06 — Os dados cadastrados deverão permanecer disponíveis após o fechamento e reabertura do aplicativo.

## 7. Telas e fluxo de navegação

### Login
Objetivo: autenticar o usuário.

Informações: e-mail e senha.

Ações: entrar e acessar cadastro.

Navegação: Login → Início ou Cadastro.

### Cadastro
Objetivo: criar uma conta local.

Informações: nome, e-mail, senha e confirmação.

Ações: cadastrar e voltar ao login.

Navegação: Cadastro → Início após cadastro válido.

### Início
Objetivo: apresentar um resumo das tarefas.

Informações: progresso, tarefas pendentes, concluídas, atrasadas e próximas tarefas.

Ações: criar tarefa, abrir lista, categorias, perfil e alternar tema.

Navegação: Início → Lista, Formulário de Tarefa, Categorias, Perfil e Detalhes.

### Lista de Tarefas
Objetivo: consultar e filtrar tarefas.

Informações: tarefas, status e categorias.

Ações: concluir, abrir detalhes, excluir, filtrar e criar tarefa.

Navegação: Lista → Detalhes ou Formulário de Tarefa.

### Cadastro/Edição de Tarefa
Objetivo: cadastrar ou editar uma tarefa.

Campos: título, descrição, prazo, prioridade e categoria.

Ações: salvar e cancelar.

Navegação: Formulário → Lista/Detalhes.

### Detalhes da Tarefa
Objetivo: consultar uma tarefa individual e suas informações.

Informações: título, descrição, prioridade, prazo, categoria e subtarefas.

Ações: concluir, editar, excluir e gerenciar subtarefas.

Navegação: Detalhes → Formulário ou Lista.

### Categorias
Objetivo: consultar categorias utilizadas pelas tarefas.

Informações: nome, cor e quantidade de tarefas associadas.

Ações: criar categoria e abrir tarefas de uma categoria.

Navegação: Categorias → Formulário de Categoria ou Lista de Tarefas.

### Cadastro de Categoria
Objetivo: criar uma categoria.

Campos: nome e cor.

Ações: salvar e cancelar.

Navegação: Formulário → Categorias.

### Perfil
Objetivo: consultar e atualizar dados básicos da conta.

Informações: nome e e-mail.

Ações: atualizar nome e sair.

## 8. Protótipo e identidade visual

O protótipo implementado no código utiliza uma linguagem visual própria, inspirada conceitualmente em aplicativos de notas e produtividade: superfícies limpas, hierarquia editorial, bordas discretas, espaçamento consistente e poucos elementos decorativos.

A referência de mercado serve apenas como direção de experiência. O aplicativo não copia telas, componentes proprietários ou funcionalidades completas de Notion, Obsidian ou ColorNote.

## 9. Modelagem dos dados

O aplicativo utiliza armazenamento local com AsyncStorage. As principais entidades são Usuario, Categoria, Tarefa e Subtarefa.

| Entidade | Campo | Tipo | Chave/Função |
|---|---|---|---|
| Usuario | id | número | PK |
| Usuario | nome | texto | |
| Usuario | email | texto | identificador de login |
| Usuario | senhaHash | texto | senha protegida |
| Categoria | id | número | PK |
| Categoria | nome | texto | |
| Categoria | cor | texto | |
| Tarefa | id | número | PK |
| Tarefa | titulo | texto | |
| Tarefa | descricao | texto | |
| Tarefa | prioridade | texto | |
| Tarefa | dataLimite | texto | |
| Tarefa | concluida | booleano | |
| Tarefa | categoriaId | número | FK → Categoria.id |
| Subtarefa | id | número | PK |
| Subtarefa | titulo | texto | |
| Subtarefa | concluida | booleano | |
| Subtarefa | tarefaId | número | FK → Tarefa.id |

### Relacionamentos

- Usuario 1 — N Categoria/Tarefa/Subtarefa por espaço de dados do usuário.
- Categoria 1 — N Tarefa.
- Tarefa 1 — N Subtarefa.

### Diagrama

```mermaid
erDiagram
    USUARIO {
      int id PK
      string nome
      string email
      string senhaHash
    }
    CATEGORIA {
      int id PK
      string nome
      string cor
    }
    TAREFA {
      int id PK
      string titulo
      string descricao
      string prioridade
      string dataLimite
      boolean concluida
      int categoriaId FK
    }
    SUBTAREFA {
      int id PK
      string titulo
      boolean concluida
      int tarefaId FK
    }
    CATEGORIA ||--o{ TAREFA : possui
    TAREFA ||--o{ SUBTAREFA : possui
    USUARIO ||--o{ CATEGORIA : organiza
    USUARIO ||--o{ TAREFA : possui
}
```

## 10. Dados utilizados

A opção escolhida é armazenamento local. O aplicativo salva usuários, sessão, categorias, tarefas e subtarefas com AsyncStorage. Ao iniciar, os dados são recuperados e apresentados nas telas correspondentes.

## 11. Planejamento técnico

### Componentes reutilizáveis

- Header
- BotaoPrincipal
- CampoFormulario
- CardTarefa
- ChipCategoria
- BotaoIcone
- Abas
- BarraProgresso
- Avatar
- EstadoVazio

### Organização

```text
AppTarefas/
├── assets/
├── src/
│   ├── components/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── storage/
│   ├── styles/
│   └── types/
├── App.tsx
└── README.md
```

## 12. Tecnologias

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Vector Icons
- Expo Google Fonts / Nunito

## 13. Validações

Os formulários validam campos obrigatórios, tamanho mínimo, formato de data, categoria obrigatória, duplicidade de categoria, confirmação de senha e dados de acesso. Quando existem erros, o cadastro é impedido e uma mensagem clara é apresentada ao usuário.

## 14. Conclusão

O projeto aplica navegação entre telas, componentes reutilizáveis, formulários com validação, listas, manipulação de dados e armazenamento local, mantendo uma identidade visual própria e adequada ao objetivo de organização de tarefas.

> Campos de capa como integrantes da dupla, turma, professor e data devem ser preenchidos pelos alunos antes da entrega final.
