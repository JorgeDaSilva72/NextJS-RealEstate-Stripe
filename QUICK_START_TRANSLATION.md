# Quick Start - Complete the Integration

## Step 1: Generate Prisma Client

The Prisma schema has been updated, but the client needs to be regenerated.

**Stop your dev server first (Ctrl+C in terminal), then run:**

```bash
npx prisma generate
```

**Then restart the dev server:**

```bash
npm run dev
```

## Step 2: Set Up Google Cloud

### Add Environment Variable

Add this to your `.env` file (create if it doesn't exist):

```env
GOOGLE_PROJECT_ID=your-google-cloud-project-id
```

### Authenticate (Local Development)

```bash
gcloud auth application-default login
```

### Enable Translation API

1. Visit: https://console.cloud.google.com/apis/library/translate.googleapis.com
2. Click "Enable"

## Step 3: Test the Integration

### Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/translate -H "Content-Type: application/json" -d "{\"text\":\"Bonjour\",\"target\":\"en\"}"
```

Expected: `{"translation":"Hello"}`

### Test Property Creation

1. Go to: http://localhost:3000/user/properties/add
2. Enter French text in title and description
3. Submit the form
4. Check database with: `npx prisma studio`

## Step 4: Run Migration (If You Have Existing Data)

```bash
npx prisma migrate dev --name add_multilingual_support
```

## That's It!

Your translation integration is ready! Properties will now automatically be translated from French to English when created or edited.

## Need Help?

Check these guides:
- 📘 `GOOGLE_TRANSLATION_SETUP.md` - Authentication and setup
- 📘 `DATABASE_MIGRATION_GUIDE.md` - Database migration details
- 📘 `PRISMA_SCHEMA_UPDATE.md` - Schema changes explained
- 📘 `walkthrough.md` - Complete implementation details
