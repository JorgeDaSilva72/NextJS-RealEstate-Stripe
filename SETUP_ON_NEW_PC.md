# Setup Google Analytics on a New PC

## Prerequisites
- Node.js installed
- Git installed
- Access to the database (PostgreSQL)

## Step 1: Clone and Setup

```bash
# Clone the repository (if not already cloned)
git clone <repository-url>
cd NextJS-RealEstate-Stripe

# Checkout the feature branch
git checkout feature/google-analytics

# Install dependencies
npm install
```

## Step 2: Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Database
DATABASE_URL=your-database-connection-string

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/analytics/oauth2callback

# Google Analytics Property ID
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Create Database Table

The `GoogleAnalyticsToken` table needs to be created. Choose one method:

### Method A: Run SQL Script (Recommended if migration fails)

```bash
npx prisma db execute --file scripts/create_ga_token_table.sql
```

### Method B: Use Prisma Migrate

```bash
# Try to apply migrations
npx prisma migrate deploy

# If it fails, mark as applied and use Method A
npx prisma migrate resolve --applied 20251128171514_add_google_analytics_token
npx prisma db execute --file scripts/create_ga_token_table.sql
```

## Step 4: Generate Prisma Client

```bash
# Make sure dev server is NOT running
npx prisma generate
```

## Step 5: Verify Setup

1. **Check if table exists:**
   ```bash
   npx prisma studio
   ```
   Look for `GoogleAnalyticsToken` table in the database.

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Test the dashboard:**
   - Navigate to: `http://localhost:3000/fr/analytics/dashboard`
   - You should see the "Connect Google Analytics" button
   - If you see errors, check the console and follow troubleshooting below

## Troubleshooting

### Error: "Table does not exist"
**Solution:** Run the SQL script:
```bash
npx prisma db execute --file scripts/create_ga_token_table.sql
```

### Error: "EPERM: operation not permitted" (when running prisma generate)
**Solution:** 
- Stop the dev server (Ctrl+C)
- Close any database clients
- Run `npx prisma generate` again
- Restart dev server

### Error: "Migration failed"
**Solution:**
```bash
# Mark migration as applied
npx prisma migrate resolve --applied 20251128171514_add_google_analytics_token

# Create table manually
npx prisma db execute --file scripts/create_ga_token_table.sql

# Regenerate client
npx prisma generate
```

### Error: "Unauthorized" when clicking Connect
**Solution:** 
- Make sure you're logged in (Kinde authentication)
- Check that environment variables are set correctly
- Verify the redirect URI matches in Google Cloud Console

### Infinite reload loop
**Solution:**
- Check browser console for errors
- Verify the `/api/analytics/status` endpoint works
- Make sure the table exists in the database
- Check that Prisma client is generated correctly

## Quick Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] Database table created (`GoogleAnalyticsToken`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Dev server starts without errors
- [ ] Can access `/fr/analytics/dashboard`
- [ ] "Connect Google Analytics" button appears
- [ ] Clicking button redirects to login (if not authenticated) or Google OAuth

## Need Help?

See `SETUP_ANALYTICS_DB.md` for more detailed database setup instructions.

