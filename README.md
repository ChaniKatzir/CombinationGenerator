# Combination Generator

A full-stack client/server application that generates permutations of the numbers `1..n` without precomputing or storing all possible permutations.

The solution was designed according to the assignment requirements with emphasis on clean architecture, separation of responsibilities, scalability, and maintainability.

---

# Technology Stack

## Backend

- .NET 8
- ASP.NET Core Web API
- Dependency Injection
- Swagger
- Global Exception Middleware
- xUnit

## Frontend

- Angular 20
- Standalone Components
- Signals
- Reactive Forms
- HttpClient
- RxJS
- OnPush Change Detection
- Angular Control Flow (`@if`, `@for`)

---

# Solution Structure

```
client/
    Angular 20 application

server/
    CombinationGenerator.Api
    CombinationGenerator.Core
    CombinationGenerator.Core.Tests
```

---

# Architecture

## Backend

The backend is divided into three projects.

### CombinationGenerator.Api

Responsible only for:

- HTTP endpoints
- Request / Response contracts
- Dependency Injection
- Middleware
- Swagger configuration
- Response mapping

Contains no business logic.

---

### CombinationGenerator.Core

Contains all business logic.

Responsibilities:

- Permutation algorithms
- Session management
- Validation
- Services
- Domain models
- Custom exceptions

The Core project has no dependency on ASP.NET.

---

### CombinationGenerator.Core.Tests

Contains unit tests for:

- Factorial calculation
- Permutation-by-index algorithm
- Business logic

---

# Design Principles

The solution follows several principles:

- Separation of Concerns
- Single Responsibility Principle
- Dependency Inversion
- Stateless HTTP API with server-side session state
- Thread-safe in-memory storage

The implementation intentionally avoids unnecessary complexity such as:

- CQRS
- MediatR
- Repository pattern
- AutoMapper

These patterns were considered unnecessary for the scope of the assignment.

---

# State Management

Each user receives a unique SessionId.

The server maintains the current session state:

- Current permutation
- Current index
- Browse state
- Browse starting index

The client stores only presentation state.

---

# Permutation Algorithms

Two different algorithms are used.

## FactorialCalculator

Calculates `n!` using `BigInteger`.

---

## PermutationByIndexCalculator

Computes any permutation directly from its index.

This avoids generating all previous permutations and allows constant-memory random access.

---

## Lexicographic Next Permutation

Used when sequential permutation generation is required.

---

# Pagination

Pagination is implemented entirely on the server.

The client requests only the required page.

For very large values of `n`, all page calculations use `BigInteger` on the server.

The API exchanges large numeric values as strings to avoid integer overflow.

Additional metadata is returned:

- BrowseStartIndex
- StartIndex
- EndIndex

This allows the client to preserve the current logical position when the page size changes.

---

# Error Handling

## Backend

Global Exception Middleware converts exceptions into a consistent API response format.

Examples:

- BusinessValidationException → HTTP 400
- SessionNotFoundException → HTTP 404
- Unhandled Exception → HTTP 500

---

## Frontend

- HTTP interceptor
- Centralized error handling
- Facade-managed feature state

---

# API Overview

```
POST /api/combinations/start

POST /api/combinations/next

POST /api/combinations/browse/page

POST /api/combinations/browse/exit

POST /api/combinations/reset
```

Swagger is available at:

```
https://localhost:7055/swagger
```

---

# Running the Project

## Backend

```
cd server
dotnet restore
dotnet run
```

---

## Frontend

```
cd client

npm install

ng serve
```

Application:

```
http://localhost:4200
```

---

# Key Design Decisions

- All permutation calculations are performed on the server.
- The client never calculates permutations.
- Sessions are stored behind an abstraction (`ICombinationSessionStore`) allowing future replacement of the in-memory implementation with Redis without changing the business logic.
- Large permutation indexes are represented using `BigInteger` internally and serialized as strings through the API.
- The architecture favors simplicity and readability while remaining extensible.

---

# Future Improvements

Possible future enhancements include:

- Redis-based session storage
- Distributed caching
- Persistent session recovery
- Authentication
- Monitoring and metrics
