# Smart Village Revolution - Website

## Development

### Prerequisites
- Node.js 20+
- npm or bun
- MongoDB connection string

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the `my-app` directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes
- `npm run type-check` - Run TypeScript type checking
- `npm run check` - Run all checks (lint, format, type-check)
- `npm run check:fix` - Run all checks and auto-fix issues

### Data Migration
- `npm run import-news` - Import news articles from static data
- `npm run import-awards` - Import awards from static data
- `npm run import-activities` - Import activity reports from static data

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Public pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── components/        # React components
├── lib/                   # Utility libraries
├── models/                # Mongoose models
├── scripts/               # Migration scripts
└── public/                # Static assets
```

## CI/CD

The project uses GitHub Actions for CI/CD:

- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on every push/PR
  - Linting
  - Format checking
  - Type checking
  - Build verification

- **Deploy Pipeline** (`.github/workflows/deploy.yml`): Runs on main branch
  - Runs all CI checks
  - Deploys to production server

## Code Style

- ESLint configuration: `.eslintrc.json`
- Prettier configuration: `.prettierrc.json`
- EditorConfig: `.editorconfig`

## License

All rights Reserved by ZeroOne Code Club, Department of Student Activity Center, K L Deemed to be University
