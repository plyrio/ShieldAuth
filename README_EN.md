# ShieldAuth API

🌐 **Languages:**  
[🇧🇷 Português](README.md) | 🇺🇸 English


**Version:** 1.0
**OpenAPI Spec:** 3.0

Authentication and User Management API featuring user registration, login, account activation, and JWT-based authentication.

---

## Technologies

* Node.js + NestJS
* TypeScript
* Prisma ORM
* JWT Authentication
* Jest for unit tests
* Zod for DTO validation

---

## Project Structure

```
src/
 ├─ modules/
 │   ├─ auth/            # AuthService, AuthController, login, JWT
 │   └─ user/            # UserService, UserController, CRUD operations
 ├─ lib/                 # Utilities, PasswordHasher, cryptography
 ├─ prisma.service.ts    # Database connection
 └─ main.ts
```

---


## Running the Project

```bash
# Clone repository
git clone https://github.com/plyrio/ShieldAuth.git
cd ShieldAuth

# Install dependencies
npm install

# Run database (docker)
docker-compose up -d

# Start development server
npm run dev

# Run tests
npm run test
```

---

## Routes

### Public Routes

| Method | Route        | Description                |
| ------ | ------------ | -------------------------- |
| POST   | /auth/signUp | Create a new user          |
| POST   | /auth/signIn | Login and get JWT token    |

### Protected Routes (JWT)

> All routes below require a valid token in the header `Authorization: Bearer <token>`

| Method | Route               | Description       |
| ------ | ------------------- | ----------------- |
| GET    | /user               | List all users    |
| GET    | /user/id/{id}       | Get user by ID    |
| GET    | /user/email/{email} | Get user by email |
| PATCH  | /user/{id}          | Update user       |
| DELETE | /user/{id}          | Delete user       |

---

## DTOs / Schemas

### CreateUserDto

| Field    | Type   | Required |
| -------- | ------ | -------- |
| name     | string | yes      |
| email    | string | yes      |
| password | string | yes      |

### UpdateUserDto

| Field    | Type   | Required |
| -------- | ------ | -------- |
| name     | string | no       |
| email    | string | no       |
| password | string | no       |

### SignInDto

| Field    | Type   | Required |
| -------- | ------ | -------- |
| email    | string | yes      |
| password | string | yes      |

### ResponseUserDto

| Field     | Type   |
| --------- | ------ |
| id        | number |
| name      | string |
| email     | string |
| status    | string |
| createdAt | string |
| updatedAt | string |

---

## Notes

* Passwords are always stored hashed (bcrypt)
* DTOs validated with Zod
* Follows Clean Architecture / DDD principles

---

## Authentication

* JWT-based authentication
* Header: `Authorization: Bearer <token>`
* Token expires in X hours (configured in `JwtModule`)

---

## Security

This API was designed with security best practices in mind, starting from the application layer.

### Implemented Measures

- **Helmet**
  - Used to configure secure HTTP headers.
  - Protects against common web vulnerabilities such as:
    - XSS (Cross-Site Scripting)
    - Clickjacking
    - MIME-type sniffing
  - Applied globally during application bootstrap.

- **Password Hashing**
  - Passwords are never stored in plain text.
  - Uses **bcrypt** for secure password hashing before persistence.

- **JWT Authentication**
  - Authentication based on **JSON Web Tokens**.
  - Tokens are sent via the `Authorization: Bearer <token>` header.
  - Protected routes use a custom `AuthGuard`.

- **Separation of Responsibilities**
  - Authentication logic is isolated within the `auth` module.
  - Domain rules are encapsulated inside the `User` entity.

- **Data Validation**
  - DTOs are validated using **Zod**, preventing invalid or malicious input.
  - Validation failures do not reach the domain layer.

### Planned Improvements

- Rate limiting (e.g. `@nestjs/throttler`)
- Refresh tokens
- Logout with token invalidation
- Audit logging for sensitive events (login, password changes)

---

## Tests

* Unit tests: `UserService`, `User Entity`, `AuthService`
* E2E tests: future implementation

---

## Author

**Pedro Henrique Lyrio Gonçalves**  
- GitHub: [https://github.com/plyrio](https://github.com/plyrio)  
- LinkedIn: [https://www.linkedin.com/in/plyrio](https://www.linkedin.com/in/plyrio) 