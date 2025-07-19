# 🥷 Number Ninja

A gamified math practice web application for kids, featuring ninja-themed challenges and progressive skill building.

## Features

### 🎮 Gaming Elements
- **Ninja Theme**: Progress through different belt ranks (White → Yellow → Green → Brown → Black → Master)
- **XP System**: Earn experience points based on accuracy and difficulty
- **Real-time Feedback**: Instant visual and audio feedback for answers
- **Progress Tracking**: Track performance across multiple sessions

### 🧮 Math Practice
- **Multiple Difficulty Levels**: Easy (1-10), Medium (1-20), Hard (1-50)
- **Operation Types**: Addition/Subtraction and Multiplication/Division
- **Timed Challenges**: 2-minute intensive practice sessions
- **Smart Problem Generation**: Age-appropriate problems with balanced difficulty

### 🏆 Progression System
- **Belt Advancement**: Unlock new ninja belts based on accumulated XP
- **Performance Metrics**: Track accuracy, speed, and improvement over time
- **Motivational Messages**: Encouraging feedback based on performance

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.11**: Latest Python features and performance
- **Pydantic**: Data validation and settings management
- **Uvicorn**: Lightning-fast ASGI server

### Frontend
- **React 18**: Modern UI library with hooks and functional components
- **Vite**: Ultra-fast build tool and development server
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication

### Infrastructure
- **Docker**: Containerized deployment for both services
- **Docker Compose**: Orchestration of multi-container application

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd numberninja
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development Mode

For development with hot reload:

```bash
# Start both services
docker-compose up

# Or start individually
docker-compose up backend
docker-compose up frontend
```

## Game Mechanics

### Difficulty Levels
- **White Belt (Easy)**: Numbers 1-10, basic operations
- **Yellow Belt (Medium)**: Numbers 1-20, slightly more complex
- **Brown Belt (Hard)**: Numbers 1-50, challenging problems

### XP Calculation
- Base XP: 10 points per correct answer
- Difficulty multiplier: Easy (1x), Medium (1.5x), Hard (2x)
- Accuracy bonus: 90%+ (5 bonus points), 75%+ (3 bonus points)

### Belt Progression
- White Belt: 0-99 XP
- Yellow Belt: 100-299 XP
- Green Belt: 300-599 XP
- Brown Belt: 600-999 XP
- Black Belt: 1000-1499 XP
- Master Belt: 1500+ XP

## API Endpoints

### Game Management
- `POST /api/game/start` - Start a new game session
- `POST /api/game/answer` - Submit an answer
- `POST /api/game/end/{session_id}` - End game session
- `GET /api/game/leaderboard` - Get top scores
- `GET /api/game/ninja-belt/{xp}` - Get belt info for XP amount

### Health Check
- `GET /health` - Service health status
- `GET /` - Welcome message

## Project Structure

```
numberninja/
├── backend/
│   ├── app/
│   │   ├── api/          # API route handlers
│   │   ├── models/       # Pydantic data models
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI application
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client functions
│   │   ├── App.jsx       # Main application component
│   │   └── App.css       # Styles and animations
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Deployment

### Using Helm (Kubernetes)

Deploy to Kubernetes using the included Helm chart:

```bash
# Install from OCI registry (after release)
helm install numberninja oci://ghcr.io/{owner}/numberninja/charts/numberninja --version 1.0.0

# Install from local chart
helm install numberninja ./charts/numberninja

# With custom values
helm install numberninja ./charts/numberninja -f my-values.yaml
```

See [Charts README](./charts/README.md) for detailed configuration options.

### Using Docker Compose (Local/Development)

```bash
# Start the application
docker-compose up --build

# Access the application
open http://localhost:3000
```

## Releases

This project uses automated releases via GitHub Actions. When you create a new release:

1. **Container Images** are built and published to GitHub Container Registry
2. **Helm Chart** is packaged and published to GitHub Releases and OCI registry
3. **Multi-architecture support** (linux/amd64, linux/arm64)

### Published Artifacts

- **Backend Image**: `ghcr.io/{owner}/numberninja/backend:{version}`
- **Frontend Image**: `ghcr.io/{owner}/numberninja/frontend:{version}`
- **Helm Chart**: `ghcr.io/{owner}/numberninja/charts/numberninja:{version}`

### Creating a Release

1. Merge changes to `main` branch
2. Create a new release in GitHub with semantic versioning (e.g., `v1.0.0`)
3. Automated workflows will build and publish all artifacts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- User authentication and profiles
- Persistent leaderboards with database
- Sound effects and background music
- More game modes (speed rounds, boss battles)
- Parent dashboard for progress tracking
- Multiplayer challenges
- Achievement system with badges

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for young math ninjas everywhere! 🥷🧮