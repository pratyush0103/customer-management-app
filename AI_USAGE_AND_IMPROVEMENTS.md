# AI Usage Strategy & Project Roadmap

This document outlines the development strategy employed for this assignment, specifically focusing on the integration of AI tools to accelerate delivery and the future roadmap for the application.

## 1. AI Assistant Integration

As a candidate with strong expertise in JavaScript/Frontend ecosystems but relatively new to **Kotlin and Spring Boot**, I leveraged AI to bridge the syntax gap while retaining full control over architectural decisions and business logic.

### Tools Used
- **AI Coding Assistant**: Used for boilerplate generation, syntax translation (JS pattern $\to$ Kotlin), and debugging configuration issues.
- **Postman**: For API contract testing.
- **Swagger/OpenAPI**: For live API documentation.

### Usage Pattern: Delegation vs. Hands-on

| Area | approach | Description |
| :--- | :--- | :--- |
| **Architecture & Design** | ✋ **Manual** | I defined the resource structure, API endpoints, database schema, and frontend component hierarchy. |
| **Frontend (Next.js/React)**| 🤝 **Hybrid** | I wrote the core React logic, state management, and UI layout. AI was used to quickly scaffold standard MUI components (forms, tables) to save typing time. |
| **Backend (Kotlin/Spring)** | 🤖 **AI-Assisted** | Since Kotlin is new to me, I delegated the syntax-heavy implementation of Controllers and Services to AI. I reviewed the generated code to ensure it matched my logic requirements (e.g., ensuring `sortBy` parameters were correctly passed to the repository). |
| **Data Seeding** | 🤖 **AI-Delegated** | generated the `customers-seed.json` and the corresponding `DataSeeder` logic to ensure the app had rich test data immediately upon startup. |
| **Debugging** | 🤝 **Hybrid** | I identified logical errors (e.g., "H2 console not 404ing"), and used AI to suggest framework-specific fixes (e.g., `spring-boot-h2console` dependency in Spring Boot 4). |

### Workflow Acceleration
AI acted as a "pair programmer," allowing me to:
- **Skip the "Syntax Lookup" Phase**: Instead of searching "how to define a data class in Kotlin," I could request the structure and focus on the data modeling.
- **Instant Configuration**: Rapidly generated `application.yaml`, `.gitignore`, and `build.gradle.kts` configurations that would typically require 30+ minutes of setup.
- **Documentation**: Automatically generated comprehensive API documentation (Swagger & Postman collection) in parallel with development.

---

## 2. Future Improvements & Roadmap

Given the time constraints and my current learning curve with Kotlin, I prioritized a functional, polished end-to-end flow. Below are the specific areas I would address in a production-ready iteration.

### Backend Improvements

#### 🧪 Unit & Integration Tests
**Status**: Partial / Omitted
**Reasoning**: As I am still familiarizing myself with Kotlin's testing ecosystem (JUnit 5, MockK), I focused on ensuring the code works via manual verification and Postman tests.
**Improvement**: 
- Add unit tests for `CustomerService` to verify business logic (e.g., ensuring unique phone numbers).
- Add integration tests (`@SpringBootTest`) for the Controller layer.

#### 🐳 Containerization
**Status**: Local Execution
**Improvement**: Add a `Dockerfile` and `docker-compose.yml` to spin up the Backend, Frontend, and a real PostgreSQL container (replacing H2) with a single command.

#### 📂 Enhanced Export
**Status**: Basic CSV Dump
**Improvement**: Update the export endpoint to respect the active filters. Currently, it exports all data. It should accept `name`, `phone`, and `country` query params to export only the filtered view the user sees on screen.

### Frontend Improvements

#### ⚡ Caching & State
**Status**: React State (useState/useEffect)
**Improvement**: 
- **TanStack Query (React Query)**: Implement for server-state management. This would provide out-of-the-box caching, background refetching, and better handling of loading/error states compared to manual `useEffect` hooks.
- **Redux Toolkit**: For a larger application, I would move global UI state (like filters, pagination preferences, theme settings) into Redux to avoid prop drilling, though Context API is sufficient for the current scope.

#### 🎨 UX Refinements
- **Optimistic Updates**: Immediately update the UI on Create/Delete actions before the server responds, reverting only if the request fails.

