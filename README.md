# Penguin Inspections

A full-stack web application for logging and recording PPE (Personal Protective Equipment) inspections. Built with a modern tech stack featuring React, Express.js, Node.js, and MySQL.

## 🎯 Project Overview

Penguin Inspections is a comprehensive inspection management system that enables users to:
- Log equipment inspections and maintenance records
- Track equipment lifecycle (acquisition, retirement, inspections)
- Generate inspection reports and history
- Manage rental equipment availability
- Track inspection schedules and compliance

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS/StyleSheets
- **Server**: Express.js (HTTPS/HTTP)
- **Port**: 3000 (HTTPS), 3001 (HTTP)

### Backend
- **Runtime**: Node.js 25.6
- **Framework**: Express.js
- **Database Driver**: mysql2
- **Authentication**: Passport.js with session support
- **Port**: 5000 (HTTPS), 5001 (HTTP)

### Database
- **Engine**: MySQL 9.4
- **Port**: 3306
- **Data Persistence**: Named Docker volume
- **Initialization**: SQL seed scripts for schema and data

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development Container**: VS Code Dev Container with host networking
- **SSL/TLS**: Self-signed certificates (development)

## 📋 Prerequisites

### Local Development
- Docker & Docker Compose (version 20.10+)
- Node.js 25.6+ and npm
- VS Code (recommended) with Remote - Containers extension
- Git

### Without Docker
- Node.js 25.6+
- npm or yarn
- MySQL 9.4+ (local installation)
- OpenSSL (for certificate generation)

## 🚀 Quick Start - Docker (Recommended)

### 1. Clone and Navigate
```bash
cd "Penguin Inspections"
```

### 2. Start All Services
```bash
docker-compose up -d
```

This will:
- Build the frontend image
- Build the backend image
- Start MySQL database with seeded data
- Start Express servers for frontend and backend
- Wait for all health checks to pass

### 3. Access the Application
- **Frontend**: https://localhost:3000
- **Backend API**: https://localhost:5000
- **MySQL**: localhost:3306

> Note: Browsers will warn about self-signed certificates. Accept/bypass the warning.

### 4. Verify Services
```bash
docker-compose ps
docker-compose logs -f frontend  # View frontend logs
docker-compose logs -f backend   # View backend logs
```

## 💻 Development Setup

### Option 1: VS Code Dev Container (Recommended)

1. **Install Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Remote - Containers"
   - Install the Microsoft extension

2. **Reopen in Container**
   - Press Ctrl+Shift+P
   - Search "Remote-Containers: Reopen in Container"
   - VS Code will build and start the dev container

3. **Install Dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

4. **Copy Environment File**
   ```bash
   cp .env-default .env
   ```

5. **Run Services**
   - Option A: Use Docker Compose (from host terminal)
     ```bash
     docker-compose up -d
     ```
   - Option B: Run directly in dev container
     ```bash
     # Terminal 1: Backend
     cd backend && npm run dev
     
     # Terminal 2: Frontend
     cd frontend && npm run devStart
     ```

For detailed dev container instructions, see [.devcontainer/README.md](.devcontainer/README.md)

### Option 2: Local Development (Without Docker)

1. **Install Dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Setup MySQL**
   ```bash
   # Create database and import seed
   mysql -u root -p < mySQL/dev-seed-full.sql
   ```

3. **Copy Environment File**
   ```bash
   cp .env-default .env
   ```

4. **Update .env for Local MySQL**
   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=admin
   MYSQL_PASSWORD=your_password
   ```

5. **Start Services**
   ```bash
   # Terminal 1: Backend (port 5000)
   cd backend && npm run dev
   
   # Terminal 2: Frontend (port 3000)
   cd frontend && npm run devStart
   ```

## 📦 Project Structure

```
Penguin Inspections/
├── .devcontainer/              # VS Code dev container config
│   ├── devcontainer.json      # Container specification
│   ├── Dockerfile             # Custom dev image
│   ├── init.sh                # Initialization script
│   └── README.md              # Dev container guide
├── frontend/                   # React + Express frontend server
│   ├── server.js              # Express server (HTTPS/HTTP)
│   ├── middleware/            # Authentication, routing middleware
│   ├── routers/               # API routers for pages
│   ├── react-app/             # React TypeScript application
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── components/    # React components
│   │   │   ├── assets/        # Images, fonts
│   │   │   └── vite.config.ts # Vite build config
│   │   └── dist/              # Built React app
│   ├── ssl/                   # Development SSL certificates
│   └── docker-entrypoint.sh   # Container startup script
├── backend/                    # Express backend API
│   ├── server.js              # Main server file
│   ├── db/                    # Database connection
│   ├── config/                # Passport, configuration
│   ├── middleware/            # Auth, routing middleware
│   ├── routers/               # API endpoints
│   │   ├── equipment.js       # Equipment management
│   │   ├── auth.js            # Authentication
│   │   ├── rent.js            # Rental system
│   │   ├── users.js           # User management
│   │   └── assets.js          # Asset serving
│   ├── assets/                # Images, logos
│   ├── ssl/                   # Development SSL certificates
│   └── docker-entrypoint.sh   # Container startup script
├── mySQL/                      # Database files
│   ├── docker-compose.yml     # MySQL service compose
│   └── dev-seed-full.sql      # Full schema + seed data
├── docker-compose.yml         # Main orchestration file
├── .gitignore                 # Git ignore rules
├── .env-default               # Default environment variables
└── README.md                  # This file
```

## 🔐 Environment Variables

Copy `.env-default` to `.env` and update as needed:

```bash
# Backend Configuration
BACKEND_URL=http://backend:5000
BACK_HTTPS_PORT=5000
BACK_HTTP_PORT=5001

# Frontend Configuration
FRONT_HTTPS_PORT=3000
FRONT_HTTP_PORT=3001

# Database Configuration
MYSQL_DATABASE=penguin_inspections
MYSQL_USER=admin
MYSQL_PASSWORD=1mK^Hm:tGpZ60g?v0mD7dQ
MYSQL_HOST=db
MYSQL_PORT=3306

# Node Environment
NODE_ENV=development
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/protected` - Check authentication
- `POST /auth/logout` - User logout

### Equipment Management
- `GET /equipment/allCompany/:domain` - Get all equipment for company
- `GET /equipment/item/:id` - Get equipment details
- `POST /equipment/add` - Add new equipment
- `PUT /equipment/update/:id` - Update equipment
- `DELETE /equipment/delete/:id` - Delete equipment

### Rentals
- `GET /rent/available` - Get available equipment for rent
- `POST /rent/reserve` - Reserve equipment
- `GET /rent/myrentals` - View user's rentals

### Assets
- `GET /asset/*` - Serve static assets (images, logos)

## 🧪 Testing

### Health Checks
```bash
# Frontend
curl -k https://localhost:3000/ping

# Backend
curl -k https://localhost:5000/

# Database
docker exec penguin-inspections-db mysql -u admin -p penguin_inspections -e "SELECT 1;"
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f frontend
```

## 🛠 Common Development Tasks

### Install Dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

### Build Frontend React App
```bash
cd frontend/react-app && npm run build
```

### Run Frontend in Development Mode
```bash
cd frontend && npm run devStart
```

### Run Backend in Development Mode
```bash
cd backend && npm run dev
```

### Reset Database
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate with fresh seed
```

### Rebuild Docker Images
```bash
docker-compose up -d --build
```

## 📚 Key Features

- **Inspection Logging**: Record detailed equipment inspections with photos and notes
- **Equipment Tracking**: Full lifecycle management from acquisition to retirement
- **Rental Management**: Track equipment availability and rental history
- **User Authentication**: Secure login with session management
- **Asset Management**: Store and serve equipment images and logos
- **Report Generation**: View inspection history and equipment status
- **HTTPS Security**: Development SSL certificates included
- **Database Persistence**: Named volumes for data persistence across restarts

## 🔄 Deployment

### Production Deployment

1. **Update Environment Variables**
   ```bash
   # Create secure .env with production values
   BACKEND_URL=https://api.example.com
   NODE_ENV=production
   # Use proper SSL certificates (not self-signed)
   ```

2. **Build Images**
   ```bash
   docker-compose -f docker-compose.yml build
   ```

3. **Deploy Services**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

4. **Configure SSL/TLS**
   - Replace development certificates in `backend/ssl/` and `frontend/ssl/`
   - Use proper certificates from a CA (Let's Encrypt, AWS ACM, etc.)

5. **Database Backup**
   ```bash
   docker exec penguin-inspections-db mysqldump -u admin -p penguin_inspections > backup.sql
   ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Database Connection Errors
```bash
# Check database is running
docker-compose ps db

# View database logs
docker-compose logs db

# Test connection
docker exec penguin-inspections-db mysql -u admin -p -e "SELECT 1;"
```

### Frontend Not Loading
```bash
# Clear browser cache and HTTPS exception
# Rebuild frontend
docker-compose up -d --build frontend

# Check logs
docker-compose logs frontend
```

### Container Build Issues
```bash
# Clean rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## 📝 License

See [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

## 📖 Additional Resources

- [Dev Container Guide](.devcontainer/README.md)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MySQL 9.4 Reference](https://dev.mysql.com/doc/)
