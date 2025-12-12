# Fix: Prisma Client Not Generated

## Problem
The error `Cannot read properties of undefined (reading 'findUnique')` occurs because the Prisma client hasn't been regenerated after adding the `GoogleAnalyticsToken` model.

## Solution

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal where your Next.js dev server is running to stop it.

### Step 2: Regenerate Prisma Client
Run this command:

```bash
npx prisma generate
```

### Step 3: Restart Dev Server
Start your dev server again:

```bash
npm run dev
```

## Alternative: If File Lock Persists

If you still get the `EPERM: operation not permitted` error:

1. **Close all terminals** running Next.js
2. **Close VS Code/Cursor** (if it's running the dev server)
3. **Wait 5-10 seconds**
4. **Open a new terminal** and run:
   ```bash
   npx prisma generate
   ```
5. **Restart your dev server**

## Verify It Works

After regenerating, the error should be gone. The `prisma.googleAnalyticsToken` model will be available in your code.

