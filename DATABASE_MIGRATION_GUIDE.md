# Database Migration Guide for Translation Support

## Overview
This document provides guidance for migrating the Property model to support multilingual fields (French and English).

## Schema Changes Required

The following fields in the `Property` model need to be changed:
- `name`: Change from `String` to `Json`
- `description`: Change from `String?` to `Json?`

### Before Migration
```prisma
model Property {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  // ... other fields
}
```

### After Migration  
```prisma
model Property {
  id          Int      @id @default(autoincrement())
  name        Json     // { "fr": "...", "en": "..." }
  description Json?    // { "fr": "...", "en": "..." }
  // ... other fields
}
```

## Migration Steps

### Step 1: Update Prisma Schema
Locate your `prisma/schema.prisma` file and change the Property model:
- Change `name String` to `name Json`  
- Change `description String?` to `description Json?`

### Step 2: Create Migration (if using existing database)
If you have existing data, you'll need to migrate it:

```bash
# Generate migration 
npx prisma migrate dev --name add_multilingual_support

# This will create a migration file that you'll need to edit
```

### Step 3: Data Migration Script (Optional)
If you have existing properties, create a script to convert existing data:

```sql
-- Example SQL to convert existing data
-- Note: Adjust based on your actual database
UPDATE "Property" 
SET 
  name = json_build_object('fr', name, 'en', name),
  description = CASE 
    WHEN description IS NOT NULL 
    THEN json_build_object('fr', description, 'en', description)
    ELSE NULL 
  END;
```

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Update Application Code
The following files have been updated to handle multilingual data:
- ✅ `src/lib/actions/property.ts` - Updated saveProperty and editProperty
- ✅ `src/app/[locale]/user/properties/add/_components/AddPropertyForm.tsx` - Form now sends multilingual data

## Testing the Migration

1. **Test Property Creation**:
   - Create a new property with French text
   - Verify both FR and EN versions are saved in database

2. **Test Property Editing**:
   - Edit an existing property
   - Verify changes are saved in both languages

3. **Test Property Display**:
   - View property listings
   - Ensure properties display correctly

## Rollback Plan
If you need to rollback:
1. Keep a backup of your database before migration
2. Restore from backup if needed
3. Revert Prisma schema changes
4. Run `npx prisma generate` again

## Environment Variables
Ensure the following environment variable is set:
```env
GOOGLE_PROJECT_ID=your-google-cloud-project-id
```

## Important Notes
- ⚠️ This is a breaking change that affects the database schema
- 🔄 Existing properties will need data migration
- 📊 Update any queries or views that access `name` or `description` fields
- 🌐 Frontend display logic may need updates to show the correct language version
