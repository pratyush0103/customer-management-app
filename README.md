# Customer Management App

A full-stack CRUD application for managing customer records, built with **Spring Boot (Kotlin)** and **Next.js (TypeScript)**.

## Features

- Create, read, update, and delete customers
- Paginated data table with sortable columns (ID, Created, Updated)
- Search by name, phone number, id
- Filter by country
- CSV export
- Audit logging for all data changes
- Seed data support via Spring profiles

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Backend  | Spring Boot 4, Kotlin, JPA, H2 (in-memory) |
| Frontend | Next.js 16, React, MUI, TypeScript, Axios   |

## Project Structure

```
├── demo-backend/          # Spring Boot REST API
│   └── src/main/kotlin/   # Controllers, Services, Entities, DTOs
└── demo-frontend/         # Next.js UI
    └── src/
        ├── app/           # Pages
        ├── client/        # Axios HTTP client
        ├── components/    # Reusable components
        ├── constants/     # App constants
        ├── services/      # API service layer
        └── types/         # TypeScript types
```

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- npm

### Backend

```bash
cd demo-backend
./gradlew bootRun
```

The API will start on `http://localhost:8080`.

#### With Seed Data (23 sample customers)

```bash
cd demo-backend
./gradlew bootRun --args='--spring.profiles.active=seed'
```

> **Note:** The seeder only populates data if the database is empty. Since H2 is in-memory, the database resets on every restart.

### Frontend

```bash
cd demo-frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| GET    | `/api/customers`          | List customers (paged)  |
| GET    | `/api/customers/{id}`     | Get customer by ID      |
| POST   | `/api/customers`          | Create a customer       |
| PUT    | `/api/customers/{id}`     | Update a customer       |
| DELETE | `/api/customers/{id}`     | Delete a customer       |
| GET    | `/api/customers/export`   | Export customers as CSV |

### Query Parameters (GET /api/customers)

| Param       | Default | Description                              |
| ----------- | ------- | ---------------------------------------- |
| page        | 0       | Page number                              |
| size        | 10      | Page size                                |
| sortBy      | id      | Sort field (id, createdAt, updatedAt)    |
| sortDir     | desc    | Sort direction (asc, desc)               |
| name        | —       | Search by name (contains)                |
| phone       | —       | Search by phone (starts with)            |
| countryCode | —       | Filter by country code                   |

## Swagger UI (API Docs)

When the backend is running, interactive API documentation is available at:

👉 **http://localhost:8080/swagger-ui/index.html**

You can explore and test all endpoints directly from the browser.

## Postman Collection

A pre-built Postman collection is included with all API endpoints ready to use.

### How to import:
1. Open Postman
2. Click **Import** (top-left)
3. Select the file `Customer_Management_API.postman_collection.json` from the project root
4. All endpoints will appear under the **Customer Management API** collection

The collection uses a `{{baseUrl}}` variable (defaults to `http://localhost:8080/api`) — you can override it in Postman's environment settings if needed.

## H2 Console

Available at `http://localhost:8080/h2-console` when the backend is running.

- **JDBC URL:** `jdbc:h2:mem:customerdb`
- **Username:** `sa`
- **Password:** *(empty)*

## 🧠 AI Usage & Roadmap

For a detailed breakdown of how AI tools were leveraged to accelerate this project (especially for Kotlin implementation) and the technical roadmap for production readiness, please see:

👉 **[AI_USAGE_AND_IMPROVEMENTS.md](AI_USAGE_AND_IMPROVEMENTS.md)**

