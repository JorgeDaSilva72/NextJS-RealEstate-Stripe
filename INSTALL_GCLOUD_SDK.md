# Google Cloud SDK Installation Guide for Windows

## Quick Install (Recommended)

### Option 1: Download Installer

1. **Download Google Cloud SDK**:
   - Go to: https://cloud.google.com/sdk/docs/install#windows
   - Download the Windows installer (GoogleCloudSDKInstaller.exe)

2. **Run the installer**:
   - Double-click the downloaded file
   - Follow the installation wizard
   - ✅ Check "Run 'gcloud init'" at the end

3. **Authenticate**:
   ```powershell
   gcloud auth application-default login
   ```

4. **Set your project**:
   ```powershell
   gcloud config set project YOUR_PROJECT_ID
   ```

### Option 2: Use Chocolatey (If you have it)

```powershell
choco install gcloudsdk
```

## Alternative: Use Service Account Key (For Testing)

If you don't want to install gcloud CLI right now, you can use a service account key file:

1. **Create Service Account**:
   - Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Click "Create Service Account"
   - Name it: `translation-service`
   - Grant role: "Cloud Translation API User"
   - Click "Create Key" → JSON
   - Download the key file

2. **Save the key**:
   - Save as: `google-credentials.json` (in project root)
   - Add to `.gitignore`: `google-credentials.json`

3. **Update your code** (`src/lib/translation.js`):
   ```javascript
   import { TranslationServiceClient } from "@google-cloud/translate";
   import path from "path";
   
   const client = new TranslationServiceClient({
     keyFilename: path.join(process.cwd(), "google-credentials.json"),
     projectId: process.env.GOOGLE_PROJECT_ID,
   });
   ```

4. **Add to `.env`**:
   ```env
   GOOGLE_PROJECT_ID=your-google-cloud-project-id
   ```

## Verify Installation

After installing gcloud CLI, verify:

```powershell
gcloud --version
```

Should show something like:
```
Google Cloud SDK 456.0.0
```

## Quick Setup After Installation

```powershell
# Login
gcloud auth application-default login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Verify
gcloud config list
```

## For Production (Vercel/Netlify)

You'll use environment variables instead:
- Set `GOOGLE_PROJECT_ID` in deployment platform
- Upload service account JSON as secret
- Configure `GOOGLE_APPLICATION_CREDENTIALS` path

## Need Help?

- 📘 Full guide: `GOOGLE_TRANSLATION_SETUP.md`
- 🔗 Official docs: https://cloud.google.com/sdk/docs/install
