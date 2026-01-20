# SmartVillage_V1


This project requires environment variables to connect to the PostgreSQL database and for admin authentication. 

**Create a `.env` file** in the `my-app` directory with the following variables:

```bash
# Database (Neon Console)
DATABASE_URL="your_postgresql_connection_string_here"

# Admin Credentials
ADMIN_EMAIL="your_admin_email"
ADMIN_PASSWORD="your_admin_password"
```

**Important Notes:**
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- The `.env` file is already excluded from git to protect your credentials
- Database and admin credentials are server-side only

**Where to get these values:**
- **DATABASE_URL**: Get your connection string from [Neon Console](https://console.neon.tech/)
- **Admin Credentials**: Set your own admin email and password for the GOP admin panel


KLSAC 2025
