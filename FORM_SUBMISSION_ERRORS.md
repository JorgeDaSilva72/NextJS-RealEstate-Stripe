# Fixing Form Submission Errors

## Error 1: Google Cloud Quota Project Not Set ❌

**Error Message:** `SERVICE_DISABLED` - "Your application is authenticating by using local Application Default Credentials. The translate.googleapis.com API requires a quota project"

**Fix:**

1. **Set the quota project:**
   ```bash
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   ```
   Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

2. **Find your project ID:**
   ```bash
   gcloud projects list
   ```
   Look for the PROJECT_ID column.

3. **Example:**
   ```bash
   gcloud auth application-default set-quota-project my-project-12345
   ```

---

## Error 2: User Not in Database ❌

**Error Message:** `Foreign key constraint violated: Property_userId_fkey (index)`

**This means:**
- You're not logged in, OR
- Your user account doesn't exist in the database

**Fix:**

1. **Make sure you're logged in** to your application (using Kinde Auth)
2. **Check if you can access the "Add Property" page** - if you can, you should be logged in
3. **Your user ID might not be in the database** - this happens on first login

**Quick test:**
- Try logging out and logging back in
- If the error persists, you need to ensure your user is created in the database on first login

---

## Quick Solution Steps:

1. Run: `gcloud auth application-default set-quota-project YOUR_PROJECT_ID`
2. Ensure you're logged in to the app
3. Try submitting the form again
