<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Forum API

RESTful API developed with NestJS following Clean Architecture and Domain-Driven Design (DDD) principles, implementing a comprehensive forum system with questions, answers, comments, and notifications.

## About The Project

This project is a robust backend application that implements an educational forum system, allowing students to ask questions and instructors (and other students) to provide answers. The architecture is designed to be scalable, testable, and maintainable, following software engineering best practices.

### Key Features

- JWT authentication and authorization
- User management (students and instructors)
- Complete question and answer system
- Comment system for questions and answers
- File attachment upload for questions and answers
- Best answer selection
- Real-time notification system
- Distributed caching with Redis
- Optimized pagination and search

## Architecture

The project is organized in layers following Clean Architecture:

```
src/
├── core/                    # Application core (Entities, Events, Errors)
├── domain/                  # Business rules and use cases
│   ├── forum/              # Forum domain
│   └── notification/       # Notification domain
└── infra/                  # Infrastructure layer
    ├── http/               # Controllers and presentation
    ├── database/           # Prisma repositories
    ├── cache/              # Redis implementation
    ├── auth/               # JWT authentication
    ├── cryptography/       # Hashing and encryption
    ├── storage/            # File upload
    └── events/             # Event handlers
```

### Applied Principles

- **Clean Architecture**: Clear separation between business rules and implementation details
- **Domain-Driven Design**: Rich domain modeling with aggregates and value objects
- **SOLID**: Cohesive code with low coupling and high testability
- **Domain Events**: Asynchronous communication between bounded contexts
- **Repository Pattern**: Persistence layer abstraction
- **Dependency Inversion**: Interfaces in domain, implementations in infrastructure

## Tech Stack

### Backend

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Static typing and type safety
- **Prisma**: Modern database ORM
- **Passport JWT**: Authentication strategy

### Infrastructure

- **PostgreSQL**: Main relational database
- **Redis**: Distributed cache and query optimization
- **CloudFlare R2**: File and attachment storage
- **Docker**: Service containerization

### Testing

- **Vitest**: Unit and E2E testing framework
- **Supertest**: HTTP integration testing
- **Faker**: Test data generation

### Code Quality

- **ESLint**: Static code analysis
- **Prettier**: Consistent formatting
- **GitHub Actions**: Automated CI/CD

## Prerequisites

- Node.js 22.x
- PNPM 9.x
- Docker and Docker Compose
- PostgreSQL 15.x (via Docker)
- Redis 7.x (via Docker)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/hmartiins/Nest-Clean-Architeture
cd Nest-Clean-Architeture
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nest-clean?schema=public"

# JWT
JWT_PRIVATE_KEY="<base64-encoded-private-key>"
JWT_PUBLIC_KEY="<base64-encoded-public-key>"

# Redis
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_DB=0

# AWS S3
AWS_BUCKET_NAME="<your-bucket-name>"
AWS_ACCESS_KEY_ID="<your-access-key>"
AWS_SECRET_ACCESS_KEY="<your-secret-key>"
CLOUDFLARE_ACCOUNT_ID="<your-cloudflare-account-id>"

# Server
PORT=3333
```

To generate JWT keys:

```bash
# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert to base64
cat private_key.pem | base64
cat public_key.pem | base64
```

### 4. Start Services with Docker

```bash
docker-compose up -d
```

This command will start:

- PostgreSQL on port 5432
- Redis on port 6379

### 5. Run Migrations

```bash
pnpm exec prisma migrate deploy
```

### 6. Generate Prisma Client

```bash
pnpm exec prisma generate
```

## Running The Application

### Development Mode

```bash
pnpm start:dev
```

The application will be available at `http://localhost:3333`

### Production Mode

```bash
# Build
pnpm build

# Start
pnpm start:prod
```

### Debug Mode

```bash
pnpm start:debug
```

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Run with coverage
pnpm test:cov
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run in watch mode
pnpm test:e2e:watch
```

Make sure you have a `.env.test` file configured for E2E tests.

## Available Scripts

```bash
pnpm build              # Build the project
pnpm start              # Start in production mode
pnpm start:dev          # Start in development mode
pnpm start:debug        # Start in debug mode
pnpm lint               # Run linter and fix issues
pnpm lint:check         # Check linting only
pnpm format             # Format code
pnpm format:check       # Check formatting
pnpm test               # Run unit tests
pnpm test:e2e           # Run E2E tests
pnpm test:cov           # Run tests with coverage
```

## Database Structure

### Main Entities

- **Users**: System users (students and instructors)
- **Questions**: Questions created by users
- **Answers**: Answers to questions
- **Comments**: Comments on questions and answers
- **Attachments**: Files attached to questions and answers
- **Notifications**: System notifications

## API Endpoints

### Authentication

- `POST /sessions` - Authenticate user
- `POST /accounts` - Register new user

### Questions

- `GET /questions` - List recent questions
- `GET /questions/:slug` - Get question by slug
- `POST /questions` - Create new question
- `PUT /questions/:id` - Edit question
- `DELETE /questions/:id` - Delete question
- `GET /questions/:id/answers` - List answers for a question
- `GET /questions/:id/comments` - List comments on a question
- `POST /questions/:id/comments` - Comment on a question
- `DELETE /questions/comments/:id` - Delete question comment

### Answers

- `POST /questions/:questionId/answers` - Answer question
- `PUT /answers/:id` - Edit answer
- `DELETE /answers/:id` - Delete answer
- `PATCH /answers/:id/choose-as-best` - Choose best answer
- `GET /answers/:id/comments` - List comments on an answer
- `POST /answers/:id/comments` - Comment on an answer
- `DELETE /answers/comments/:id` - Delete answer comment

### Attachments

- `POST /attachments` - Upload file

### Notifications

- `GET /notifications` - List user notifications
- `PATCH /notifications/:id/read` - Mark notification as read

## Performance and Optimizations

- **Redis Caching**: Frequent queries are cached to reduce database load
- **Pagination**: All listing endpoints support pagination
- **Eager Loading**: Relationships are loaded efficiently
- **Domain Events**: Asynchronous notification processing

## CI/CD

The project uses GitHub Actions for automation:

- **Lint**: Code quality verification
- **Unit Tests**: Unit test execution
- **E2E Tests**: End-to-end test execution with PostgreSQL and Redis

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Best Practices of This Repo

- Always run tests before committing
- Keep code formatted with Prettier
- Follow ESLint standards
- Write tests for new features
- Document significant changes
- Use semantic commits
