# Central de Solicitações — API Backend

![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.2-green)
![Build](https://img.shields.io/badge/build-Maven-red)
![Banco de dados](https://img.shields.io/badge/PostgreSQL-database-4169E1)

API REST para registrar e acompanhar solicitações. O backend valida os dados recebidos, persiste as solicitações em PostgreSQL e controla o fluxo de atendimento pelos estados **ABERTA**, **EM_ANDAMENTO** e **CONCLUIDA**.

## 📌 Funcionalidades

- Registro de solicitações com título, descrição, categoria e prioridade.
- Consulta de todas as solicitações cadastradas.
- Filtro por status e prioridade.
- Aceite de solicitações abertas e conclusão das solicitações em andamento.
- Prevenção de duplicatas com o mesmo título e descrição.
- Validação de entrada e resposta padronizada para erros da API.

## 🏗️ Arquitetura

O backend segue uma organização em camadas:

- **Controller** — expõe os endpoints HTTP e converte requisições e respostas.
- **Service** — aplica regras de negócio, transforma DTOs em entidades e coordena operações.
- **Repository** — acessa o banco por meio do Spring Data JPA.
- **Entity** — representa a solicitação persistida, com identificador UUID e controle de versão.
- **DTOs** — definem os dados aceitos na criação e enviados nas respostas.
- **Exception handler** — converte erros de validação e de regra de negócio em respostas JSON.

Estrutura principal:

```text
src/main/java/com/loading/solicitacoes/
├── solicitacoes/
│   ├── controller/       # Endpoints REST
│   ├── service/          # Regras e fluxo da aplicação
│   ├── repository/       # Persistência JPA
│   └── entity/
│       ├── dto/          # DTOs de entrada e saída
│       └──               # Entidade e enums
└── shared/exception/     # Tratamento global de erros
```

## Tecnologias usadas:

- Java 21
- Spring Boot 4.1.2
- Spring Web MVC
- Spring Data JPA / Hibernate
- Jakarta Bean Validation
- PostgreSQL
- Maven
- Lombok

## ⚙️ Configuração e execução:

### Pré-requisitos:

- JDK 21
- PostgreSQL em execução
- Maven instalado ou uso do Maven Wrapper incluído no projeto

Crie um banco chamado `central-solicitacoes` no PostgreSQL. Configure a URL JDBC, o usuário e a senha da conexão em `src/main/resources/application.properties` de acordo com o seu ambiente. Mantenha credenciais fora do controle de versão e use configurações seguras em produção.

Na raiz do backend, execute:

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux ou macOS
./mvnw spring-boot:run
```

Por padrão, a API fica disponível em `http://localhost:8080`. O Hibernate está configurado com `ddl-auto=update`, criando ou atualizando as tabelas conforme as entidades.

## API Endpoints

O prefixo de todas as rotas é `/loading/central-solicitacoes`.

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/registrar` | Registra uma solicitação |
| `GET` | `/consultar` | Lista as solicitações |
| `GET` | `/filtros?status={STATUS}&priority={PRIORIDADE}` | Filtra por status e prioridade |
| `POST` | `/aceitar` | Move uma solicitação de `ABERTA` para `EM_ANDAMENTO` |
| `POST` | `/concluir` | Move uma solicitação de `EM_ANDAMENTO` para `CONCLUIDA` |

### Registrar solicitação

`POST /loading/central-solicitacoes/registrar`

```json
{
  "title": "Manutenção de equipamento",
  "description": "Projetor da sala 12 não liga",
  "category": "Infraestrutura",
  "priority": "ALTA"
}
```

Os campos textuais são obrigatórios e não podem estar em branco. `priority` aceita `BAIXA`, `MEDIA` ou `ALTA`. O status inicial é definido pelo backend como `ABERTA`. Uma solicitação com título e descrição já cadastrados é rejeitada.

### Consultar solicitações

`GET /loading/central-solicitacoes/consultar`

A resposta é uma lista de solicitações no formato:

```json
[
  {
    "solicitationId": "7b7e1f77-8f13-4f52-a4e9-1d31b6c5e1af",
    "title": "Manutenção de equipamento",
    "description": "Projetor da sala 12 não liga",
    "status": "ABERTA",
    "category": "Infraestrutura",
    "priority": "ALTA"
  }
]
```

### Filtrar solicitações

`GET /loading/central-solicitacoes/filtros?status=ABERTA&priority=ALTA`

Os parâmetros `status` e `priority` correspondem aos enums da API:

- `status`: `ABERTA`, `EM_ANDAMENTO` ou `CONCLUIDA`
- `priority`: `BAIXA`, `MEDIA` ou `ALTA`

### Aceitar e concluir

As duas operações recebem um JSON com o identificador da solicitação. A transição só é permitida na ordem indicada: `ABERTA` → `EM_ANDAMENTO` → `CONCLUIDA`.

`POST /loading/central-solicitacoes/aceitar`

`POST /loading/central-solicitacoes/concluir`

```json
{
  "solicitationId": "7b7e1f77-8f13-4f52-a4e9-1d31b6c5e1af"
}
```

### Erros

Erros de validação e violações das regras de negócio retornam HTTP `400 Bad Request` com um corpo no formato:

```json
{
  "timestamp": "2026-11-14T10:30:00",
  "httpStatus": "BAD_REQUEST",
  "error": "Mensagem descritiva do erro",
  "path": "/loading/central-solicitacoes/registrar"
}
```

## 🧪 Requisições de exemplo

O arquivo `requests.http` na raiz do backend contém uma requisição de exemplo para registrar uma solicitação, compatível com clientes HTTP de IDEs como IntelliJ IDEA.

## 👤 Autor

José Maria
