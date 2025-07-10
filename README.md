# Hono Backend

Backend application using Hono framework with authentication, payment processing, and database integration.

## Setup

### 1. Install Dependencies
```sh
bun install
```

### 2. Environment Configuration
Copy the example environment file and configure your variables:
```sh
cp .env.example .env
```

Edit `.env` file with your actual configuration values:

#### Required Environment Variables

**Database Configuration:**
- `DATABASE_URL`: PostgreSQL connection string

**Authentication Configuration:**
- `BETTER_AUTH_SECRET`: Secret key for authentication (generate a secure random string)
- `BETTER_AUTH_URL`: Your backend URL (e.g., https://your-backend.fly.dev)
- `BETTER_AUTH_TRUSTED_ORIGINS`: Comma-separated list of trusted frontend URLs

**Xendit Payment Configuration:**
- `XENDIT_API_KEY`: Your Xendit API key
- `XENDIT_API_URL`: Xendit API endpoint (default: https://api.xendit.co/v2/invoices)
- `XENDIT_CALLBACK_TOKEN`: Xendit webhook callback token

**Server Configuration:**
- `PORT`: Server port (default: 8080)

**CORS Configuration:**
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `CORS_ALLOW_HEADERS`: Comma-separated list of allowed headers
- `CORS_ALLOW_METHODS`: Comma-separated list of allowed HTTP methods

**Application Configuration:**
- `APP_NAME`: Your application name
- `EXTERNAL_ID_PREFIX`: Prefix for external IDs (default: "sumopod-")

### 3. Database Setup
```sh
npx prisma migrate deploy
npx prisma generate
```

### 4. Development
```sh
bun run dev
```

### 5. Production Build
```sh
bun run build
bun run start
```

## Deployment

This application is configured for deployment on Fly.io. Make sure to set all required environment variables in your Fly.io app configuration.

```sh
fly deploy
```

## API Endpoints

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `GET /api/data/balance` - Get user balance
- `GET /api/data/transactions` - Get user transactions
- `GET /api/data/payments` - Get user payments
- `POST /create-invoice` - Create payment invoice
- `POST /xendit-webhook` - Xendit payment webhook

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique values for `BETTER_AUTH_SECRET`
- Ensure your `XENDIT_CALLBACK_TOKEN` is secure and matches your Xendit webhook configuration
- Configure CORS origins appropriately for your deployment environment
