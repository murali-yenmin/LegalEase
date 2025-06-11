# LegalFlow - Legal Case Management System

A comprehensive legal case management system built with React TypeScript frontend and Express.js backend. Features JWT authentication, role-based access control, case management, client management, and document handling.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Advocate, Staff, Client)
  - Secure session management

- **Dashboard**
  - Real-time metrics and KPIs
  - Recent cases overview
  - Upcoming hearings calendar
  - Activity summaries

- **Case Management**
  - Create, view, edit, and delete cases
  - Case status tracking (Active, Pending, Completed, On-Hold)
  - Case type categorization (Civil, Criminal, Corporate, Family)
  - Advanced filtering and search

- **Client Management**
  - Client profiles with detailed information
  - Client type classification (Individual, Corporate, Government)
  - Contact information management
  - Client status tracking

- **Document Management**
  - File upload and storage
  - Document categorization
  - Version control

- **Invoicing System**
  - Invoice generation
  - Payment tracking
  - Financial reporting

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Query** for state management
- **Wouter** for routing
- **React Hook Form** for form handling

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **JWT** for authentication
- **Bcrypt** for password hashing

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legalflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials and other configuration values.

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build with webpack
npm run build:webpack

# Start webpack dev server
npm run dev:webpack

# Type checking
npm run check

# Database operations
npm run db:push
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/legalflow

# Application
NODE_ENV=development
PORT=5000

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## Default Login Credentials

For development and testing:
- **Email**: admin@legalflow.com
- **Password**: password

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── webpack.config.js      # Webpack configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Dashboard
- `GET /api/dashboard/metrics` - Dashboard metrics
- `GET /api/dashboard/recent-cases` - Recent cases
- `GET /api/dashboard/upcoming-hearings` - Upcoming hearings

### Cases
- `GET /api/cases` - List cases with filtering
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Clients
- `GET /api/clients` - List clients with filtering
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## Database Schema

The application uses PostgreSQL with the following main tables:
- **users** - System users with role-based access
- **clients** - Client information and contacts
- **cases** - Legal cases and their details
- **hearings** - Court hearings and schedules
- **documents** - Document storage and metadata
- **invoices** - Billing and payment tracking

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Using Webpack
```bash
npm run webpack:build
```

### Environment Configuration
Ensure all production environment variables are properly set, especially:
- `DATABASE_URL` for production database
- `JWT_SECRET` for secure token signing
- `NODE_ENV=production`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the code comments for implementation details