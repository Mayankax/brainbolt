# BrainBolt ⚡

An adaptive quiz application that intelligently adjusts question difficulty based on your performance using momentum-based algorithms. Challenge yourself, climb the leaderboard, and track your progress in real-time.

## Demo Video

https://drive.google.com/file/d/16Q01v-gLX2RcNCL8BsyPqSWpe9dbsZ1b/view?usp=sharing

## Features

- **Adaptive Difficulty System** - Questions automatically adjust to your skill level using a momentum-based algorithm with streak tracking and hysteresis
- **Real-time Leaderboards** - Compete globally with score rankings, max streaks, and accuracy statistics
- **Anonymous Quick Start** - Jump right in without registration - token-based authentication gets you started instantly
- **Performance Metrics** - Track your current streak, difficulty level, total score, and answer accuracy
- **Optimized Performance** - Redis caching for fast question delivery and PostgreSQL for reliable data persistence
- **Modern UI** - Built with Next.js and shadcn/ui components for a responsive, polished experience

## Tech Stack

### Frontend
- **Next.js 16** with React 19 and TypeScript
- **TailwindCSS 4** for styling
- **shadcn/ui** component library
- **TanStack Query** for data fetching
- **Zustand** for state management

### Backend
- **Express** REST API with TypeScript
- **Prisma ORM** with PostgreSQL
- **Redis** for caching and performance
- **JWT** authentication
- **Zod** for validation

### Infrastructure
- **Docker & Docker Compose** for containerization
- **npm workspaces** for monorepo management

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** 20+ and **npm** (for local development)

## Getting Started

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayankax/brainbolt.git
   cd brainbolt
   ```

2. **Start all services**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - Health check: http://localhost:4000/health

The application will automatically:
- Set up PostgreSQL database
- Run Prisma migrations
- Start Redis cache
- Launch the API server
- Start the Next.js frontend

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   cd apps/api && npm install
   cd ../web && npm install
   ```

2. **Start PostgreSQL and Redis**
   ```bash
   docker compose up postgres redis -d
   ```

3. **Configure environment variables**
   
   Create `apps/api/.env`:
   ```env
   DATABASE_URL=postgresql://brainbolt:brainbolt@localhost:5432/brainbolt
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key
   PORT=4000
   ```

   Create `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/v1
   ```

4. **Run database migrations**
   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed  # Optional: seed with sample questions
   ```

5. **Start development servers**
   ```bash
   # From project root
   npm run dev
   ```

   Or start individually:
   ```bash
   # Terminal 1 - API
   cd apps/api
   npm run dev

   # Terminal 2 - Web
   cd apps/web
   npm run dev
   ```

## Project Structure

```
brainbolt/
├── apps/
│   ├── api/                 # Express REST API
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Auth, validation
│   │   │   └── lib/         # Prisma, Redis clients
│   │   └── prisma/          # Database schema & migrations
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/         # App router pages
│           ├── components/  # React components
│           ├── lib/         # Utilities
│           └── providers/   # Context providers
├── docker/                  # Dockerfiles
└── docker-compose.yml       # Service orchestration
```

## API Endpoints

### Authentication
- `POST /v1/auth/anonymous` - Create anonymous user session

### Quiz
- `GET /v1/quiz/next` - Get next adaptive question
- `POST /v1/quiz/answer` - Submit answer and get feedback

### Metrics
- `GET /v1/quiz/metrics` - Get user statistics

### Leaderboard
- `GET /v1/leaderboard/global` - Get global rankings

All quiz, metrics, and leaderboard endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## How the Adaptive System Works

BrainBolt uses a sophisticated adaptive algorithm to match question difficulty to your skill level:

1. **Momentum Tracking** - Builds confidence score based on recent performance
2. **Streak System** - Consecutive correct answers boost your score multiplier (up to 5x)
3. **Hysteresis** - Requires sustained performance (2+ streak) before increasing difficulty
4. **Dynamic Scoring** - Higher difficulty questions yield more points
5. **Graceful Degradation** - Wrong answers reduce difficulty when momentum drops

Difficulty ranges from 1 (easy) to 10 (expert), with smooth transitions to keep you challenged but not overwhelmed.

## Development Commands

### Root workspace
```bash
npm run dev          # Start both API and web in parallel
npm run build        # Build all workspaces
```

### API workspace
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run production build
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create new migration
```

### Web workspace
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Environment Variables

### API (`apps/api/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection string | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `PORT` | API server port | `4000` |

### Web (`apps/web/.env.local`)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:4000/v1` |

## Contributing

Contributions are welcome! Here are some ways you can help:

- Add new question categories and tags
- Improve the adaptive algorithm
- Enhance UI/UX components
- Add multiplayer features
- Write tests
- Improve documentation

Please ensure your code follows the existing style and include tests for new features.

## Support

- **Issues** - Report bugs or request features via [GitHub Issues](https://github.com/Mayankax/brainbolt/issues)
- **Discussions** - Ask questions in [GitHub Discussions](https://github.com/Mayankax/brainbolt/discussions)

## License

This project is open source and available under the MIT License.

## Maintainer

Maintained by [@Mayankax](https://github.com/Mayankax)

---

Built with ⚡ by developers who love adaptive learning
