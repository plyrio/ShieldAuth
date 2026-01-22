# ShieldAuth API

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
npm run start:dev

# Run tests
npm run test
```

---

## Routes

### Public Routes

| Method | Route       | Description                |
| ------ | ----------- | -------------------------- |
| POST   | /user       | Create a new user (signup) |
| POST   | /auth/login | Login and get JWT token    |

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

## Tests

* Unit tests: `UserService`, `User Entity`, `AuthService`
* E2E tests: future implementation

---

## Author

**Pedro Henrique Lyrio Gonçalves**  
- GitHub: [https://github.com/plyrio](https://github.com/plyrio)  
- LinkedIn: [https://www.linkedin.com/in/plyrio](https://www.linkedin.com/in/plyrio) 