# Airbnb AI Chatbot

## Overview

Airbnb AI Chatbot is a full-stack application that provides an intelligent chatbot interface for Airbnb-related queries and interactions.

## Architecture

The project follows a microservices architecture with separate backend and frontend services:

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

**Project Structure:**
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/airbnb/chatbot/
│   │   │   ├── ChatbotApplication.java
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── config/
│   │   │   └── model/
│   │   │       ├── entity/
│   │   │       └── dto/
│   │   └── resources/
│   │       └── application.yml
└── pom.xml
```

**Running the Backend:**
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

## Frontend

The frontend is a React application created with Create React App.

**Technology Stack:**
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1

**Project Structure:**
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── index.js
└── package.json
```

**Running the Frontend:**
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`.

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
docker-compose up --build
```

This will start all services:
- PostgreSQL on port `5432`
- Backend API on port `8080`
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
   npm start
   ```

### Docker Setup

1. **Build and Run:**
   ```bash
   cd docker
   docker-compose up --build
   ```

2. **Stop Services:**
   ```bash
   docker-compose down
   ```

3. **View Logs:**
   ```bash
   docker-compose logs -f
   ```
# airbnb-chatbot-project
# airbnb-chatbot-project
# airbnb-chatbot-project
# airbnb-chatbot-project
