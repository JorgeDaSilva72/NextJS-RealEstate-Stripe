# Setup Google Analytics Database Table

## Problem
The `GoogleAnalyticsToken` table might not exist if the migration failed or wasn't run.

## Solution

### Option 1: Run the SQL script directly (Recommended)

If the migration fails, you can create the table manually:

```bash
npx prisma db execute --file scripts/create_ga_token_table.sql
```

### Option 2: Use Prisma Migrate

1. **If migration is marked as failed:**
   ```bash
   npx prisma migrate resolve --rolled-back 20251128171514_add_google_analytics_token
   ```

2. **Then apply the migration:**
   ```bash
   npx prisma migrate deploy
   ```

   If it still fails because of existing tables, use Option 1 instead.

### Option 3: Mark migration as applied and run SQL

If the migration is stuck:

```bash
# Mark as applied (if table already exists from manual creation)
npx prisma migrate resolve --applied 20251128171514_add_google_analytics_token

# Or create table manually
npx prisma db execute --file scripts/create_ga_token_table.sql
```

## Verify Table Exists

After running the script, verify the table exists:

```bash
npx prisma studio
```

Or check in your database client - you should see `GoogleAnalyticsToken` table in the `public` schema.

## Regenerate Prisma Client

After creating the table, regenerate the Prisma client:

```bash
# Stop your dev server first (Ctrl+C)
npx prisma generate
# Then restart: npm run dev
```

## Troubleshooting

**Error: "Table does not exist"**
- Run the SQL script from Option 1
- Verify with `npx prisma studio`

**Error: "Migration failed"**
- Use Option 3 to mark as applied and run SQL manually

**Error: "EPERM: operation not permitted"**
- Stop the dev server before running `prisma generate`
- Close any database clients that might be locking files

