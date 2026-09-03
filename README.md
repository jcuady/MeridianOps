# MeridianOps

Enterprise ops board demo: tickets + inventory over GraphQL, with JWT login and a Spring Boot + Angular monorepo.

Portfolio honesty (2026): this is a local learning / portfolio scaffold that closes Spring Boot, Angular, and GraphQL gaps in one place. It is not a production ops platform.

## Architecture

```
Angular 19 SPA (localhost:4200)
  |-- REST  POST /api/auth/login, GET /api/health
  |-- GraphQL POST /graphql  (tickets, inventoryItems)
Spring Boot 3.3+ / Java 17 (localhost:8080)
  |-- JPA entities: Ticket, InventoryItem, User
  |-- JWT (jjwt) + Spring Security
MySQL 8 (docker-compose)  OR  in-memory H2 (default for quick start)
```

## Repo layout

- `backend/` - Spring Boot API (Maven `pom.xml` + source)
- `frontend/` - Angular 19 standalone SPA
- `docker-compose.yml` - MySQL 8
- `docs/plans/` - implementation notes

## Prerequisites

- Java 17+, Maven 3.9+ (to run backend)
- Node 20+ / npm (to run frontend)
- Docker Desktop (optional, for MySQL)

Maven and Node are not required just to browse the source.

## Quick start (H2, no Docker)

Backend defaults to in-memory H2 so you can run without MySQL:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200

Demo login: `ops` / `ops123`

Health check: http://localhost:8080/api/health

GraphiQL (when authenticated setup allows): http://localhost:8080/graphiql

## Run with Docker MySQL

1. Copy env file:

```bash
copy .env.example .env
```

2. Start MySQL:

```bash
docker compose up -d
```

3. Run backend against MySQL (PowerShell example):

```powershell
cd backend
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/meridianops?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME="meridian"
$env:SPRING_DATASOURCE_PASSWORD="meridian_pass"
$env:SPRING_DATASOURCE_DRIVER="com.mysql.cj.jdbc.Driver"
mvn spring-boot:run
```

4. Start frontend as above.

## API surface

| Kind | Path | Notes |
|------|------|-------|
| REST | `GET /api/health` | Public |
| REST | `POST /api/auth/login` | Returns JWT |
| GraphQL | `POST /graphql` | Requires `Authorization: Bearer <token>` |

Example GraphQL Queries:

```graphql
query {
  tickets { id title status priority }
  inventoryItems { sku name quantity location }
}
```

Example GraphQL Mutations:

```graphql
mutation {
  updateTicketStatus(id: "1", status: "IN_PROGRESS") { id status }
  updateInventoryQuantity(id: "1", quantity: 50) { id quantity }
}
```

## Tests

```bash
cd backend
mvn test
```

Includes `JwtServiceTest` for token generate/validate.

## ASCII note

Docs and configs use ASCII punctuation only.
