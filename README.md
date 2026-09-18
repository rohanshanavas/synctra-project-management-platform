# Synctra - Project Management Platform

Synctra is a full-stack project management platform for organizing workspaces, projects, tasks, and teams.

The application combines a React-based frontend with a Node.js/Express backend and MongoDB Atlas. It is containerized with Docker and deployed to Amazon EKS using Terraform and Kubernetes, with GitHub Actions automating testing, container builds, image publishing, and deployment.

---

## Features

### Project Management

- Workspace creation and management
- Workspace member management
- Workspace invitations
- Project creation and management
- Project status tracking
- Project and workspace dashboards
- Recent projects
- Upcoming tasks

### Task Management

- Create and update tasks
- Task assignment
- Task priorities
- Task statuses
- Due dates
- Subtasks
- Task comments
- Activity history
- Assignees
- Watchers

### Authentication & Accounts

- User registration
- User login
- JWT-based authentication
- Email verification
- Password reset
- Protected application routes
- User profile
- Account settings

### Dashboard & Analytics

The dashboard provides workspace-level visibility into:

- Total projects
- Total tasks
- Tasks to do
- Tasks in progress
- Task trends
- Project status breakdown
- Task priority breakdown
- Workspace productivity
- Recent projects
- Upcoming tasks

---

# Architecture

Synctra is structured as a containerized full-stack application running on AWS.

```text
                         GitHub
                            │
                            ▼
                    GitHub Actions
                            │
                 ┌──────────┴──────────┐
                 │                     │
              Tests                 Build
                 │                     │
                 └──────────┬──────────┘
                            │
                            ▼
                      Amazon ECR
                   ┌────────┴────────┐
                   │                 │
             Frontend Image    Backend Image
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
                       Amazon EKS
                            │
               ┌────────────┴────────────┐
               │                         │
        Frontend Pods              Backend Pods
               │                         │
               │                  Secrets Store CSI
               │                         │
               │                  AWS Secrets Manager
               │                         │
               │                         ▼
               │                    MongoDB Atlas
               │
               ▼
        AWS Load Balancer
          Controller
               │
               ▼
        Internet-facing ALB
               │
        ┌──────┴───────┐
        │              │
       `/`         `/api-v1`
        │              │
        ▼              ▼
    Frontend        Backend
```

---

# Technology Stack

## Frontend

* React 19
* React Router 8
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack React Query
* Axios
* Recharts
* React Hook Form
* Zod
* Vitest
* React Testing Library

## Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nodemailer
* Zod
* Morgan
* Jest
* Supertest
* MongoDB Memory Server

## Containers & DevOps

* Docker
* Docker Compose
* GitHub Actions
* Terraform
* Kubernetes
* Amazon ECR
* Amazon EKS
* AWS Load Balancer Controller
* AWS Secrets Manager
* Secrets Store CSI Driver
* EKS Pod Identity
* Horizontal Pod Autoscaler

---

# Repository Structure

```text
synctra-project-management-platform/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── controllers/
│   ├── libs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── tests/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── vitest.config.ts
│   └── vite.config.ts
│
├── kubernetes/
│   ├── namespace.yaml
│   ├── backend-configmap.yaml
│   ├── backend-service-account.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml
│   ├── backend-secrets-bootstrap.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   └── secret-provider-class.yaml
│
├── terraform/
│   ├── main.tf
│   ├── eks.tf
│   ├── iam.tf
│   ├── helm.tf
│   ├── providers.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── data.tf
│   ├── aws-load-balancer-controller.tf
│   ├── aws-load-balancer-controller-policy.json
│   └── terraform.tf
│
├── docker-compose.yml
└── README.md
```

---

# Local Development

## Prerequisites

* Node.js 24+
* npm
* Docker
* Docker Compose
* MongoDB Atlas account

---

## 1. Clone the repository

```bash
git clone https://github.com/rohanshanavas/synctra-project-management-platform.git
cd synctra-project-management-platform
```

---

# 2. Backend Setup

```bash
cd backend
npm install
```

Create the environment file.

### macOS / Linux

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Configure:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the environment file.

### macOS / Linux

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api-v1
```

Start the frontend:

```bash
npm run dev
```

The development frontend runs on:

```text
http://localhost:5173
```

---

# Running with Docker Compose

The project includes a Docker Compose configuration for running the frontend and backend together.

From the repository root:

```bash
docker compose up --build
```

The containers expose:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

The frontend container is built with:

```text
VITE_API_URL=http://localhost:5000/api-v1
```

To stop the application:

```bash
docker compose down
```

---

# Docker Images

## Backend

The backend uses a Node.js 24 Alpine image.

```dockerfile
FROM node:24-alpine
```

The container exposes:

```text
5000
```

and starts with:

```bash
npm start
```

## Frontend

The frontend uses a multi-stage Docker build.

The first stage builds the React Router application and the production stage runs the generated server.

The production container exposes:

```text
3000
```

---

# Testing

## Backend Tests

The backend uses:

* Jest
* Supertest
* MongoDB Memory Server

Run:

```bash
cd backend
npm test
```

The tests exercise important API and authentication functionality without requiring a production MongoDB instance.

---

## Frontend Tests

The frontend uses:

* Vitest
* React Testing Library
* JSDOM

Run:

```bash
cd frontend
npm test
```

---

# Frontend Build and Type Checking

Build the frontend:

```bash
cd frontend
npm run build
```

Run type checking:

```bash
npm run typecheck
```

Start the production server:

```bash
npm run start
```

---

# API

The backend API is exposed under:

```text
/api-v1
```

The API root endpoint is:

```http
GET /
```

Health checks are available through:

```http
GET /health
```

The Kubernetes backend readiness, liveness, and startup probes use the `/health` endpoint.

---

# Authentication

Synctra uses JWT-based authentication.

After authentication, the frontend sends the access token using:

```http
Authorization: Bearer <token>
```

Authentication features include:

* Registration
* Login
* Email verification
* Password reset
* Protected routes

Passwords are hashed using bcrypt.

---

# AWS Infrastructure

The AWS environment is provisioned using Terraform.

## AWS Services

The infrastructure currently includes:

* Amazon VPC
* Public and private subnets
* Internet Gateway
* NAT Gateways
* Elastic IPs
* Amazon EKS
* Managed EKS Node Group
* Amazon ECR
* AWS IAM
* EKS Pod Identity
* AWS Load Balancer Controller
* AWS Secrets Manager
* Secrets Store CSI Driver

---

# VPC Architecture

The Terraform configuration creates:

```text
VPC
10.0.0.0/16
│
├── Public Subnet 1
│   └── NAT Gateway
│
├── Public Subnet 2
│   └── NAT Gateway
│
├── Private Subnet 1
│   └── EKS Node
│
└── Private Subnet 2
    └── EKS Node
```

The EKS worker nodes run in private subnets.

Public subnets are used for internet-facing AWS infrastructure such as the Application Load Balancer and NAT gateways.

---

# Amazon EKS

The Kubernetes cluster is created with Terraform.

Current configuration:

```text
Cluster:      synctra-dev-eks
Region:       eu-west-1
Kubernetes:   1.36
Node Type:    t3.small
Desired Nodes: 2
Minimum Nodes: 1
Maximum Nodes: 3
```

The EKS cluster has access to both private and public Kubernetes API endpoints, while worker nodes are deployed into the private subnets.

---

# Kubernetes Deployment

The application is deployed into a dedicated namespace:

```text
synctra
```

The main workloads are:

```text
frontend Deployment
backend Deployment
frontend Service
backend Service
backend HPA
Ingress
```

Both frontend and backend deployments run with two replicas by default.

Example:

```text
Frontend
├── Pod
└── Pod

Backend
├── Pod
└── Pod
```

---

# Kubernetes Services

Both applications use Kubernetes `ClusterIP` services.

```text
frontend-service
    ↓
Frontend Pods

backend-service
    ↓
Backend Pods
```

The services are not directly exposed to the public internet.

External traffic enters through the Kubernetes Ingress and AWS Application Load Balancer.

---

# AWS Load Balancer Controller

The cluster uses the AWS Load Balancer Controller to provision an AWS Application Load Balancer from the Kubernetes Ingress resource.

The ingress is internet-facing and uses IP targets.

```text
Internet
   │
   ▼
AWS Application Load Balancer
   │
   ├── /api-v1 → backend-service:5000
   │
   └── /       → frontend-service:3000
```

The controller is installed using Helm and managed through Terraform.

---

# Kubernetes Ingress

The application ingress uses:

```text
Ingress Class: alb
Scheme:        internet-facing
Target Type:   ip
```

Routing:

```text
/api-v1
   ↓
backend-service
   ↓
Backend Pods
```

and:

```text
/
   ↓
frontend-service
   ↓
Frontend Pods
```

The current deployment uses the AWS-provided Application Load Balancer DNS hostname.

---

# Secrets Management

Application secrets are not stored directly inside the Git repository.

Sensitive backend configuration is stored in:

```text
AWS Secrets Manager
```

The current secret contains values such as:

```text
MONGO_URI
JWT_SECRET
SMTP_USER
SMTP_PASSWORD
```

The Kubernetes cluster retrieves these values through:

```text
AWS Secrets Manager
        │
        ▼
Secrets Store CSI Driver
        │
        ▼
AWS Provider
        │
        ▼
Kubernetes Secret
        │
        ▼
Backend Pod
```

The application uses the AWS Secrets Store CSI Driver with:

```text
EKS Pod Identity
```

This allows the backend service account to access the required AWS secret without storing long-lived AWS credentials inside the container.

---

# EKS Pod Identity

Pod Identity is used for AWS permissions required by Kubernetes workloads.

The project currently uses Pod Identity for components including:

* Backend Secrets Manager access
* AWS Load Balancer Controller
* VPC CNI

The backend service account:

```text
backend
```

is associated with an IAM role that can retrieve the Synctra backend secret from AWS Secrets Manager.

---

# Horizontal Pod Autoscaling

The backend has a Kubernetes Horizontal Pod Autoscaler.

Current configuration:

```text
Minimum replicas: 2
Maximum replicas: 5
CPU target:       60%
```

The HPA scales the backend deployment based on CPU utilization.

```text
Low CPU usage
     ↓
Fewer Pods

High CPU usage
     ↓
More Pods
```

The backend deployment also defines CPU and memory requests/limits.

---

# Infrastructure as Code

Terraform is used to provision the AWS infrastructure.

Terraform manages:

* VPC
* Subnets
* Routing
* NAT Gateways
* Elastic IPs
* EKS cluster
* EKS node group
* EKS add-ons
* IAM roles and policies
* EKS Pod Identity associations
* AWS Load Balancer Controller
* Secrets Store CSI Driver
* AWS Secrets Manager access configuration
* GitHub Actions EKS access

Initialize Terraform:

```bash
cd terraform
terraform init
```

Preview changes:

```bash
terraform plan
```

Apply infrastructure:

```bash
terraform apply
```

Destroy infrastructure:

```bash
terraform destroy
```

---

# Kubernetes Deployment Workflow

After creating the EKS infrastructure, configure your local kubeconfig:

```bash
aws eks update-kubeconfig \
  --region eu-west-1 \
  --name synctra-dev-eks
```

Verify nodes:

```bash
kubectl get nodes
```

Check application resources:

```bash
kubectl get all -n synctra
```

Check the ingress:

```bash
kubectl get ingress -n synctra
```

The application is exposed through the ALB hostname shown by the ingress.

---

# CI/CD Pipeline

GitHub Actions provides the project's CI/CD pipeline.

The workflow is triggered by:

```text
Pull Requests → main
Pushes         → main
```

## Pull Request / Validation Flow

The pipeline:

1. Checks out the repository
2. Sets up Node.js 24
3. Restores npm cache
4. Installs frontend dependencies
5. Runs frontend tests
6. Builds the frontend
7. Installs backend dependencies
8. Runs backend tests

AWS deployment steps are not executed for pull requests.

---

## Main Branch Deployment Flow

When code is pushed to `main`, GitHub Actions additionally:

1. Authenticates to AWS
2. Logs into Amazon ECR
3. Builds the backend Docker image
4. Pushes the backend image to ECR
5. Builds the frontend Docker image
6. Pushes the frontend image to ECR
7. Configures kubectl for EKS
8. Verifies cluster access
9. Applies Kubernetes foundation resources
10. Applies Kubernetes services
11. Deploys the frontend
12. Applies the ingress
13. Waits for the AWS ALB hostname
14. Updates backend CORS configuration
15. Deploys the backend
16. Applies the backend HPA
17. Verifies backend rollout
18. Verifies frontend rollout

---

# Container Image Versioning

Docker images are tagged using the Git commit SHA.

Example:

```text
synctra-backend:<commit-sha>
synctra-frontend:<commit-sha>
```

This provides immutable image references for deployments and makes it possible to associate a running container with the exact source commit that produced it.

---

# GitHub Actions Authentication to AWS

GitHub Actions uses AWS IAM authentication through GitHub's OIDC integration.

The workflow assumes:

```text
GitHubActions-Synctra
```

rather than storing long-lived AWS access keys inside GitHub Actions.

This allows the workflow to authenticate to AWS without embedding permanent AWS credentials in the repository.

---

# Production Configuration

The application is currently deployed behind an AWS Application Load Balancer using the AWS-provided DNS hostname.

Current ingress configuration is HTTP:

```text
http://<aws-alb-dns-name>
```

HTTPS and a custom domain can be added later using:

* Amazon Route 53
* AWS Certificate Manager
* HTTPS ALB listener
* ACM certificate
* DNS configuration
* HTTP → HTTPS redirect

---

# Environment Variables

Example environment files are included for configuration documentation.

Backend:

```text
backend/.env.example
```

Frontend:

```text
frontend/.env.example
```

Never commit real:

* MongoDB credentials
* JWT secrets
* SMTP credentials
* AWS credentials
* Database passwords

Production secrets should be managed through AWS Secrets Manager or another dedicated secret-management solution.

---

# Useful Kubernetes Commands

View nodes:

```bash
kubectl get nodes
```

View workloads:

```bash
kubectl get pods -n synctra
```

View deployments:

```bash
kubectl get deployments -n synctra
```

View services:

```bash
kubectl get services -n synctra
```

View ingress:

```bash
kubectl get ingress -n synctra
```

View HPA:

```bash
kubectl get hpa -n synctra
```

Inspect backend logs:

```bash
kubectl logs deployment/backend -n synctra
```

Inspect frontend logs:

```bash
kubectl logs deployment/frontend -n synctra
```

Check backend rollout:

```bash
kubectl rollout status deployment/backend -n synctra
```

Check frontend rollout:

```bash
kubectl rollout status deployment/frontend -n synctra
```

---

# Cleaning Up AWS Resources

Because Kubernetes creates AWS resources such as the Application Load Balancer, the ingress should be deleted before destroying the EKS infrastructure.

Remove the ingress:

```bash
kubectl delete ingress synctra-ingress -n synctra
```

Wait for the load balancer to be removed, then run:

```bash
terraform destroy
```

This prevents orphaned AWS load balancer resources from blocking VPC or EKS teardown.

---

# Project Status

The Synctra application is currently implemented as a full-stack, containerized cloud deployment.

Completed areas include:

* Full-stack React frontend
* Node.js/Express backend
* MongoDB integration
* JWT authentication
* Email verification and password reset
* Workspace and project management
* Task management
* Dashboard analytics
* Automated backend testing
* Frontend testing setup
* Docker containerization
* Docker Compose
* Terraform infrastructure
* AWS VPC
* Amazon EKS
* Managed EKS node group
* Amazon ECR
* Kubernetes deployments and services
* AWS Load Balancer Controller
* Internet-facing Application Load Balancer
* AWS Secrets Manager integration
* Secrets Store CSI Driver
* EKS Pod Identity
* Kubernetes Horizontal Pod Autoscaling
* GitHub Actions CI/CD
* Automated container image publishing
* Automated EKS deployment from `main`

---

# Engineering Highlights

This project demonstrates practical experience across the full application lifecycle:

```text
Application Development
        ↓
Testing
        ↓
Containerization
        ↓
Infrastructure as Code
        ↓
Cloud Infrastructure
        ↓
Kubernetes
        ↓
Secrets Management
        ↓
CI/CD
        ↓
Automated Deployment
        ↓
Horizontal Scaling
```

Key engineering concepts demonstrated include:

* Full-stack application architecture
* REST API development
* Authentication and authorization
* Automated testing
* Docker image creation
* Immutable container image tagging
* Infrastructure as Code with Terraform
* AWS networking
* Kubernetes orchestration
* EKS cluster management
* IAM and least-privilege access
* EKS Pod Identity
* AWS Secrets Manager
* Kubernetes service discovery
* AWS Application Load Balancing
* Horizontal Pod Autoscaling
* GitHub Actions CI/CD
* OIDC-based AWS authentication

