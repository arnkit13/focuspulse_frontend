# focuspulse_frontend

## Deployment

The system consists of a Java Spring Boot backend and a React frontend.

### Prerequisites
- Docker installed and running.

### Building and Running Locally
1. Build the backend image:
   ```
   cd focuspulse
   docker build -t focuspulse-backend .
   ```

2. Build the frontend image:
   ```
   cd web
   docker build -t focuspulse-frontend .
   ```

3. Run the containers (you may need docker-compose or manual run with env vars).

### Environment Variables
For backend:
- DATABASE_URL
- DATABASE_USERNAME
- DATABASE_PASSWORD
- JWT_SECRET

For frontend:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### Deployment to Cloud
Push images to a container registry (e.g., Docker Hub, Azure Container Registry) and deploy to Azure Container Apps or Kubernetes.