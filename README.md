# Synctra

A full-stack project management platform for organizing workspaces, projects, tasks, and teams. Synctra provides a dashboard for tracking project status, task priority, task trends, and workspace productivity.

## Features

- User registration and authentication
- Email verification and password reset
- JWT-based authentication
- Workspace creation and management
- Workspace member management and invitations
- Project creation and project status tracking
- Task creation, assignment, priorities, statuses, due dates, and subtasks
- Task comments, activity history, assignees, and watchers
- Dashboard analytics for task trends, project status, task priority, and productivity
- Recent projects and upcoming tasks
- User profile and account settings
- Responsive React frontend with a reusable shadcn/ui component system

## Tech Stack

### Frontend

- React 19
- React Router 8
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Axios
- Recharts
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Zod
- Morgan

### Planned Cloud / DevOps

- Docker
- Docker Compose
- Terraform
- AWS
- Amazon ECR
- Amazon EKS
- Kubernetes
- GitHub Actions
- Prometheus
- Grafana

## Repository Structure

```text
synctra-project-management-platform/
├── backend/
│   ├── controllers/
│   ├── libs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20+
- npm
- MongoDB / MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/rohanshanavas/synctra-project-management-platform.git
cd synctra-project-management-platform
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

On Windows PowerShell, you can copy the file with:

```powershell
Copy-Item .env.example .env
```

Set the required backend environment variables in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb_uri_here
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

Start the backend in development mode:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set the frontend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

The repository includes example environment files so required configuration is documented without committing secrets.

- `backend/.env.example` contains backend configuration such as MongoDB, JWT, CORS, and SMTP settings.
- `frontend/.env.example` contains the frontend API URL.

Never commit real credentials, database passwords, JWT secrets, or email credentials.

## Frontend Commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Backend Commands

```bash
npm run dev
npm start
npm test
```

The backend test script is currently a placeholder and should be replaced with an automated test suite as the project evolves.

## API

The backend exposes API routes under:

```text
/api-v1
```

The root endpoint is:

```text
GET /
```

and returns a simple API availability message.

## Authentication

Synctra uses JWT-based authentication. The frontend stores the access token locally and sends it with API requests using the `Authorization: Bearer <token>` header.

Authentication-related features include registration, login, email verification, password reset, and protected application routes.

## Dashboard

The dashboard provides an overview of the selected workspace, including:

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

## Docker and AWS

The next deployment phase is to containerize the frontend and backend, provision AWS infrastructure with Terraform, and deploy the application to Amazon EKS.

The planned deployment architecture is:

```text
                    GitHub
                      │
                      ▼
               GitHub Actions
                      │
             Build / Test / Push
                      │
                      ▼
                 Amazon ECR
                      │
                      ▼
                 Amazon EKS
              ┌───────┴───────┐
              │               │
         Frontend         Backend API
                              │
                              ▼
                         MongoDB Atlas

                 Prometheus + Grafana
                         monitoring

                 Terraform
              infrastructure as code
```

Production secrets such as `MONGO_URI`, `JWT_SECRET`, and `SMTP_PASSWORD` should be supplied through managed secret/configuration mechanisms rather than committed to Git.

## Project Status

The full-stack application is implemented. The remaining cloud-native work includes containerization, infrastructure as code, Kubernetes deployment, CI/CD, and observability.

## License

This project is currently an educational/portfolio project.
