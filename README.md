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
- **Local orchestration**: Kubernetes
- **CI/CD**: GitHub Actions + GitHub Container Registry (GHCR)

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
- Node.js 20+ and npm
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

## Local Kubernetes + GitHub Actions

This repo can also run on a local Kubernetes cluster and publish container images to GitHub Container Registry (GHCR).

The current GitHub Actions setup has two layers:

1. `CI` for pull requests and non-`main` branch pushes.
2. `Main Pipeline` for `main`, where GitHub shows a visible job graph:
   `tests -> publish images -> deploy to local Kubernetes`

### What's Included

- `k8s/namespace.yaml` - Namespace for local Kubernetes testing
- `k8s/postgres.yaml` - PostgreSQL deployment, service, and PVC
- `k8s/backend.yaml` - Spring Boot backend deployment and service
- `k8s/frontend.yaml` - React frontend deployment and service
- `.github/workflows/ci.yml` - Runs CI checks for pull requests and non-`main` branch pushes
- `.github/workflows/main-pipeline.yml` - Runs the visible `test -> publish -> deploy` pipeline for `main`

### CI Workflow

The `CI` workflow runs on pull requests, manual dispatch, and pushes to non-`main` branches.

It currently verifies:

- backend tests with Maven
- frontend dependency install, build, and lint
- Docker build smoke tests for the backend and frontend images
- Kubernetes manifest validation with `kubeconform`

### Main Pipeline Workflow

The `Main Pipeline` workflow runs on pushes to `main` and manual dispatch.

Inside one workflow, it uses GitHub Actions `needs` dependencies so the Actions UI shows a real pipeline graph:

1. backend tests, frontend checks, and Kubernetes manifest validation run first
2. backend and frontend images are built and pushed to GHCR
3. the local self-hosted runner deploys the tagged images to Kubernetes

This is the workflow to look at if you want the step-by-step arrows in GitHub rather than separate workflow runs.

### Prerequisites

- Docker Desktop with Kubernetes enabled, or another local Kubernetes cluster
- `kubectl` configured to talk to that local cluster
- A GitHub repository for this project
- A self-hosted GitHub Actions runner on the same machine as your local Kubernetes cluster

### Required GitHub Secrets

Add these repository secrets before using the workflows:

- `OPENAI_API_KEY` - OpenAI API key for the backend
- `GHCR_USERNAME` - Optional GitHub username for private GHCR image pulls
- `GHCR_PAT` - Optional personal access token with at least `read:packages` when GHCR images are private

### Publish Images To GHCR

The `Main Pipeline` workflow builds and pushes two images:

- `ghcr.io/<owner>/<repo>-backend:latest`
- `ghcr.io/<owner>/<repo>-frontend:latest`

It also tags each image with `sha-<full-commit-sha>` so deployments can pin an exact build.

The workflow is configured to publish multi-architecture images for:

- `linux/amd64`
- `linux/arm64`

### Deploy To Local Kubernetes

The deploy stage of `Main Pipeline` is designed for a `self-hosted` runner because GitHub-hosted runners cannot reach your laptop's local Kubernetes cluster.

The deploy stage will:

- create/update the `airbnb-chatbot` namespace
- create Kubernetes secrets for the OpenAI key and GHCR pull credentials
- apply the manifests in `k8s/`
- update the backend/frontend deployments to the newly published GHCR image tags

If your GHCR package is public, `GHCR_USERNAME` and `GHCR_PAT` are not required.

### Verified Local Flow

This setup has been tested locally with:

- Docker Desktop Kubernetes
- a self-hosted GitHub Actions runner running on the same machine
- GHCR-hosted backend and frontend images
- `kubectl port-forward -n airbnb-chatbot svc/frontend 3000:80`

The backend was also verified in-cluster by querying `http://backend:8000/search/all`.

### Local Test Flow

1. Push to `main`.
2. Open the `Main Pipeline` workflow in GitHub Actions and watch the graph move from tests to publish to deploy.
3. Port-forward the frontend service:
   ```bash
   kubectl port-forward -n airbnb-chatbot svc/frontend 3000:80
   ```
4. Open `http://localhost:3000`.

### Useful Kubernetes Commands

```bash
kubectl get pods,svc -n airbnb-chatbot
kubectl logs -n airbnb-chatbot deploy/backend
kubectl logs -n airbnb-chatbot deploy/frontend
kubectl logs -n airbnb-chatbot deploy/postgres
kubectl delete namespace airbnb-chatbot
```

### Lessons Learned

- **A self-hosted runner is the simplest way to deploy from GitHub Actions into a local cluster.** GitHub-hosted runners can build and push images, but they cannot directly reach Docker Desktop Kubernetes on a laptop.
- **Multi-arch images matter for local Kubernetes on Apple Silicon.** Publishing only `amd64` images caused pull failures on the local `arm64` cluster, so the GHCR workflow now builds both `linux/amd64` and `linux/arm64`.
- **Public GHCR packages simplify local deploys.** For public images, Kubernetes can pull directly from GHCR without extra image pull secrets, which keeps the local setup lighter.
- **Keeping service names aligned reduces config churn.** The frontend Nginx config already proxies `/api` to `backend:8000`, so naming the Kubernetes Service `backend` let the same pattern carry over cleanly.
