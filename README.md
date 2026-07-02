# Combination Generator

A modular client-server application that generates permutations of numbers **without precomputing them**.
All permutation calculations are performed exclusively on the server. The Angular client is responsible only for presentation, user interaction, and state management.

---

# Technology Stack

## Backend

* .NET 8
* ASP.NET Core Web API
* Dependency Injection
* Middleware
* Swagger
* Modular Architecture

## Frontend

* Angular 20
* Standalone Components
* Signals
* Reactive Forms
* HttpClient
* RxJS
* OnPush Change Detection
* Angular Control Flow (`@if`, `@for`)
* Feature-Based Architecture

---

# Project Structure

```
src/app

core
 ├── api
 ├── config
 └── interceptors

shared
 ├── components
 └── models

features
 └── combination-generator
     ├── components
     ├── models
     ├── pages
     └── services
```

The project follows a Feature-Based Architecture in order to keep responsibilities isolated and support future scalability.

---

# Architecture

## API Service

Responsible only for HTTP communication.

* No business logic
* No UI logic
* No application state

---

## Facade

The Facade manages the feature state.

Responsibilities:

* Signals
* API calls
* Loading state
* Error state
* Browse state
* Session state

The Facade does **not** know anything about the UI.

---

## Components

All UI components are intentionally kept as "dumb components".

Responsibilities:

* Display data
* Raise events

They never:

* Call HTTP
* Store business state
* Calculate permutations

---

## State Management

Angular Signals were chosen instead of RxJS Subjects for UI state.

Reasons:

* Simpler API
* Better integration with Angular
* Less boilerplate
* Excellent performance with OnPush

RxJS is used only for HTTP communication.

---

# Pagination

Pagination is implemented entirely on the server.

The client never calculates permutation pages.

When the page size changes, the client keeps the user at the same logical position using the metadata returned by the server:

* browseBaseIndex
* startIndex
* endIndex

This avoids restarting from the first page after changing page size.

---

# Error Handling

Backend

* Global Exception Middleware
* Consistent API response format

Frontend

* Generic HTTP Error Interceptor
* Shared ErrorMessage component
* Feature-specific error state managed by the Facade

---

# Design Decisions

The client intentionally avoids:

* Business calculations
* Permutation algorithms
* Session management logic

Those responsibilities belong exclusively to the backend.

This keeps the client lightweight while allowing future backend optimizations without changing the UI.

---

# Running the Project

## Backend

```
dotnet run
```

Swagger:

```
https://localhost:7055/swagger
```

## Frontend

```
npm install

ng serve
```

Application:

```
http://localhost:4200
```

---

# Notes

The solution was designed with maintainability and scalability in mind while avoiding unnecessary complexity.

The architecture separates presentation, state management, and HTTP communication, making the codebase easier to extend and maintain as the project grows.
