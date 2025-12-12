# Prisma Schema Update for Multilingual Support

## What You Need to Do

### Step 1: Update Your Prisma Schema

Open your `prisma/schema.prisma` file and locate the `Property` model. Update the `name` and `description` fields:

**Before:**
```prisma
model Property {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  // ... other fields
}
```

**After:**
```prisma
model Property {
  id          Int      @id @default(autoincrement())
  name        Json     // Stores { "fr": "...", "en": "..." }
  description Json?    // Stores { "fr": "...", "en": "..." }
  // ... other fields
}
```

### Step 2: Create and Run Migration

After updating the schema, run these commands:

```bash
# Generate migration
npx prisma migrate dev --name add_multilingual_support

# This will:
# 1. Create a new migration file
# 2. Apply it to your database
# 3. Regenerate Prisma Client
```

### Step 3: Handle Existing Data (If You Have Properties)

If you already have properties in your database, you'll need to migrate the existing data. Here's a migration script:

**Option A: PostgreSQL**
```sql
-- Convert existing string data to JSON format
UPDATE "Property" 
SET 
  name = jsonb_build_object('fr', name::text, 'en', name::text),
  description = CASE 
    WHEN description IS NOT NULL 
    THEN jsonb_build_object('fr', description::text, 'en', description::text)
    ELSE NULL 
  END;
```

**Option B: MySQL**
```sql
-- Convert existing string data to JSON format
UPDATE Property 
SET 
  name = JSON_OBJECT('fr', name, 'en', name),
  description = CASE 
    WHEN description IS NOT NULL 
    THEN JSON_OBJECT('fr', description, 'en', description)
    ELSE NULL 
  END;
```

### Step 4: Verify

After migration, check your database:

```bash
# Open Prisma Studio
npx prisma studio
```

Look at a Property record - the `name` field should now show:
```json
{
  "fr": "Belle Maison",
  "en": "Beautiful House"
}
```

## Important Notes

⚠️ **Backup First**: Always backup your database before running migrations!

✅ The code is already updated to handle this change - both old (string) and new (JSON) formats are supported.

✅ New properties will automatically have both French and English versions thanks to the Google Translation API.

## Troubleshooting

**Error: "Type 'Json' is not supported"**
- Make sure you're using a supported database (PostgreSQL, MySQL, SQLite with JSON1)
- For PostgreSQL, the `Json` type maps to `jsonb`

**Migration fails**
- Backup your database
- Try creating the migration without applying: `npx prisma migrate dev --create-only`
- Review the generated SQL file before applying

## Next Steps

After completing the migration:
1. ✅ Create a test property with French text
2. ✅ Verify both FR and EN versions are saved
3. ✅ Check that property listings display correctly
4. Update any custom queries to handle JSON fields
