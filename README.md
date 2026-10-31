# Central De Links API

API da Central de Links: gerenciamento de links por usuário e compartilhamento de links/dados entre usuários.

## Instalação

```sh
$ git clone https://github.com/olokorre/CentralDeLinksAPI.git
$ cd CentralDeLinksAPI
$ yarn install
```

## Chaves JWT

A API usa JWT (RS256). Gere o par de chaves localmente (não versionadas no git):

```sh
$ openssl genrsa -out private.key 2048
$ openssl rsa -in private.key -pubout -out public.key
```

## Variáveis de ambiente

Copie `.env.exemple` para `.env` e preencha:

| Variável         | Descrição                                              | Default |
| ---------------- | ------------------------------------------------------ | ------- |
| `DB_USER`        | usuário do PostgreSQL                                  |         |
| `DB_PASSWORD`    | senha do PostgreSQL                                    |         |
| `DATABASE`       | nome do banco                                          |         |
| `DB_HOST`        | host do PostgreSQL                                     |         |
| `DB_PORT`        | porta do PostgreSQL                                    |         |
| `PORT`           | porta da API                                           | `5001`  |
| `ALLOWED_ORIGIN` | origens liberadas para CORS (separadas por vírgula)    | `*`     |
| `NODE_ENV`       | `production` esconde mensagens internas nos erros 500  |         |

## Banco de dados

O schema vive em `database.sql` (a camada de dados usa SQL cru com `pg-promise`):

```sh
$ psql "postgresql://USUARIO:SENHA@HOST:PORTA/BANCO" -f database.sql
```

## Executando

```sh
$ npm run main
```

## Testes

Os testes de unidade usam repositórios em memória; os testes de repositório usam PostgreSQL (configurado via `.env`).

```sh
$ npm test
```

## Endpoints

### Auth (públicos)

| Método | Rota                 | Descrição                                  |
| ------ | -------------------- | ------------------------------------------ |
| POST   | `/auth/register`     | cria usuário (`nick`, `password`)          |
| POST   | `/auth/login`        | login, retorna `accessToken`               |

### Auth (requerem header `access-token`)

| Método | Rota                       | Descrição                                                        |
| ------ | -------------------------- | ---------------------------------------------------------------- |
| POST   | `/auth/change_password`    | troca a senha (`password`, `newPassword`, `rePassword`)          |
| POST   | `/auth/me`                 | dados do usuário logado                                          |
| POST   | `/user/search`             | busca usuários por `nick` (`page`, `limit` opcionais, máx. 100)  |
| GET    | `/links/get`               | links do usuário logado (`page`, `limit` opcionais)              |
| GET    | `/links/get/:id`           | detalhe de um link do usuário logado                             |
| POST   | `/links/add`               | adiciona link (`url`, `description`) — só http/https             |
| DELETE | `/links/delete`            | remove link (`linkId`) — só o dono                               |
| PUT    | `/links/change-description`| muda descrição (`linkId`, `description`, máx. 255) — só o dono   |
| POST   | `/links/share`             | compartilha link (`linkId`, `userIdToShareLink`) — só o dono     |
| POST   | `/data/share`              | compartilha texto (`userIdToShareData`, `data`)                  |
| GET    | `/data/shared`             | dados compartilhados com o usuário logado                        |
| GET    | `/data/shared/:userId`     | dados do par usuário logado + `:userId`                          |

## Erros

Erros retornam corpo `{ "error": "mensagem" }` com status HTTP:

- `400` corpo JSON inválido
- `401` token inválido / credenciais inválidas
- `403` token ausente / recurso não pertence ao usuário logado
- `404` usuário, link ou compartilhamento não encontrado / rota inexistente
- `422` validação de entrada (nick, senha, descrição, URL, compartilhar para si mesmo, duplicados)
- `500` erro interno (em produção a mensagem interna/SQL não é exposta; erros são logados no servidor)
