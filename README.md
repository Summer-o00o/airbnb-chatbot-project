# Airbnb AI Chatbot

## Overview

Airbnb AI Chatbot is a full-stack application that lets you search Airbnb-style listings using natural language (for example, “quiet place in Seattle under 200”).

- It converts your free-text query into structured filters (location, bedrooms, bathrooms, backyard, price range, quietness).
- It ranks listings using a precomputed quietness score (\(0\)–\(10\)) based on review text.

## Architecture

This repository contains a full-stack app with separate backend and frontend services:

- **Backend**: Spring Boot REST API
- **Frontend**: React single-page application
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose

## Backend

The backend is a Spring Boot application built with Maven.

**Technology Stack:**
- Java 17
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok

**Running the Backend:**
```bash
cd backend
mvn spring-boot:run
```
By default the backend will start on `http://localhost:8000`.

The app expects a PostgreSQL database (see `src/main/resources/application.properties`) and an OpenAI API key:

- For local development, copy `src/main/resources/application-local.properties.example` to `application-local.properties` and set `openai.api.key`.
- Alternatively, export `OPENAI_API_KEY` in your shell; the backend maps it to `openai.api.key`.

## Frontend

The frontend is a React application built with Vite.

**Technology Stack:**
- React 19
- React DOM 19
- Vite 7

**Running the Frontend (Vite dev server):**
```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start on `http://localhost:5173` by default. All requests to `/api/...` are proxied to the backend at `http://localhost:8000`, so you normally do not need to configure CORS manually for local development.

## Docker

The project includes Docker configuration for containerized deployment.

**Docker Files:**
- `docker/Dockerfile.backend` - Backend container image
- `docker/Dockerfile.frontend` - Frontend container image
- `docker/docker-compose.yml` - Multi-container orchestration
- `docker/nginx.conf` - Nginx configuration for frontend

**Services:**
- **PostgreSQL**: Database service
- **Backend**: Spring Boot API service
- **Frontend**: React application served via Nginx

**Running with Docker Compose:**
```bash
cd docker
cp .env.example .env   # then edit .env and set OPENAI_API_KEY
docker compose up --build
```

This will start all services:
- PostgreSQL on port `5432`
- Backend API on port `8000`
- Frontend on port `3000`

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- Docker and Docker Compose (optional)

### Local Development Setup

1. **Backend Setup:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

With both backend (`http://localhost:8000`) and frontend (`http://localhost:5173`) running, you can open the app in your browser and start asking for places to stay in natural language.

### Docker Setup

1. **Build and Run:**
   ```bash
   cd docker
   cp .env.example .env   # set OPENAI_API_KEY inside
   docker compose up --build
   ```

2. **Stop Services:**
   ```bash
   docker-compose down
   ```

3. **View Logs:**
   ```bash
   docker-compose logs -f
   ```
