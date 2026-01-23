# ShieldAuth API

🌐 **Languages:**  
🇧🇷 Português |  [🇺🇸 English](README_EN.md)

**Version:** 1.0
**OpenAPI Spec:** 3.0

API de autenticação e gerenciamento de usuários com recursos como registro de usuários, login, ativação de contas e autenticação baseada em JWT.

---

## Tecnologias

* Node.js + NestJS
* TypeScript
* Prisma ORM
* JWT para autenticação
* Jest para testes unitários
* Zod para validação DTO

---

## Estrutura do Projeto

```
src/
 ├─ modules/
 │   ├─ auth/            # AuthService, AuthController, login, JWT
 │   └─ user/            # UserService, UserController,Operações CRUD
 ├─ lib/                 # Utilitários, PasswordHasher, criptografia
 ├─ prisma.service.ts    # Conexão com o banco
 └─ main.ts
```

---

## Executando o Projeto

```bash
# Clonar o repositório
git clone https://github.com/plyrio/ShieldAuth.git
cd ShieldAuth

# Instalar dependências
npm install

# Rodar banco de dados (docker)
docker-compose up -d

# Iniciar servidor de desenvolvimento
npm run start:dev

# Rodar testes
npm run test
```

---

## Rotas

### Públicas

| Método | Rota         | Descrição                  |
| ------ | ------------ | -------------------------- |
| POST   | /auth/signUp | Cria um usuário   (signup) |
| POST   | /auth/signIn | Login e obtenção do JWT    |

### Protegidas (JWT)

> Todas as rotas abaixo requerem token válido no header `Authorization: Bearer <token>`

| Método | Rota                | Descrição               |
| ------ | ------------------- | ----------------------- |
| GET    | /user               | Lista todos usuários    |
| GET    | /user/id/{id}       | Obtêm usuário por ID    |
| GET    | /user/email/{email} | Obtêm usuário por email |
| PATCH  | /user/{id}          | Atualiza usuário        |
| DELETE | /user/{id}          | Deleta usuário          |

---

## DTOs / Schemas

### CreateUserDto

| Campo    | Tipo   | Requerido |
| -------- | ------ | --------- |
| name     | string | sim       |
| email    | string | sim       |
| password | string | sim       |

### UpdateUserDto

| Campo    | Tipo   | Requerido |
| -------- | ------ | --------- |
| name     | string | não       |
| email    | string | não       |
| password | string | não       |

### SignInDto

| Campo    | Tipo   | Requerido |
| -------- | ------ | --------- |
| email    | string | sim       |
| password | string | sim       |

### ResponseUserDto

| Campo     | Tipo   |
| --------- | ------ |
| id        | number |
| name      | string |
| email     | string |
| status    | string |
| createdAt | string |
| updatedAt | string |

---

## Observações

* Senhas sempre armazenadas de forma hash (bcrypt)
* DTOs validados com Zod
* Segue princípios de Clean Architecture / DDD (pragmatico)

---

## Autenticação

* Autenticação baseada em JWT  
* Header: `Authorization: Bearer <token>`  
* Token expira em X horas (configurado no `JwtModule`)

---

## Segurança

Esta API foi desenvolvida com foco em boas práticas de segurança desde a camada de aplicação.

### Medidas implementadas

- **Helmet**
  - Utilizado para configurar headers HTTP de segurança.
  - Protege contra ataques comuns como:
    - XSS (Cross-Site Scripting)
    - Clickjacking
    - MIME-type sniffing
  - Configurado globalmente no bootstrap da aplicação.

- **Hash de Senhas**
  - Senhas nunca são armazenadas em texto puro.
  - Utiliza **bcrypt** para hashing seguro antes da persistência.

- **Autenticação JWT**
  - Autenticação baseada em **JSON Web Tokens**.
  - Tokens enviados via header `Authorization: Bearer <token>`.
  - Rotas protegidas utilizam `AuthGuard`.

- **Separação de Responsabilidades**
  - Lógica de autenticação isolada no módulo `auth`.
  - Regras de domínio encapsuladas na entidade `User`.

- **Validação de Dados**
  - DTOs validados com **Zod**, evitando dados inválidos ou maliciosos.
  - Falhas de validação não chegam à camada de domínio.

### Próximas melhorias planejadas

- Rate limiting (ex: `@nestjs/throttler`)
- Refresh token
- Logout com invalidação de token
- Auditoria de eventos sensíveis (login, troca de senha)

---

## Tests

* Testes unitários: `UserService`, `User Entity`, `AuthService`
* Testes E2E: implementação futura

---

## Autor

**Pedro Henrique Lyrio Gonçalves**  
- GitHub: [https://github.com/plyrio](https://github.com/plyrio)  
- LinkedIn: [https://www.linkedin.com/in/plyrio](https://www.linkedin.com/in/plyrio) 