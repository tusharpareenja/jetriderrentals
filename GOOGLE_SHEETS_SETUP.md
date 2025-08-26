# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to store form submissions from your Jet Ride Rentals website.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `jet-rider-rentals-sheets`
   - Description: `Service account for Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file

## Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Jet Ride Rentals - Form Submissions"
4. Add the following headers in the first row:
   ```
   Timestamp | Name | Car | Phone | Email | Pickup Date | Return Date | Message
   ```
5. Copy the Sheet ID from the URL (it's the long string between `/d/` and `/edit`)

## Step 5: Share the Sheet

1. Click the "Share" button in the top right
2. Add your service account email (from the JSON file) with "Editor" permissions
3. Make sure to uncheck "Notify people" to avoid sending emails

## Step 6: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/jetriderrentals"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Google Sheets Configuration
GOOGLE_SHEET_ID="your_google_sheet_id_here"

# Google Service Account Credentials
# Copy these values from the downloaded JSON file
GOOGLE_SERVICE_ACCOUNT_TYPE="service_account"
GOOGLE_SERVICE_ACCOUNT_PROJECT_ID="your_project_id"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="your_private_key_id"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL="your_service_account_email@your_project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID="your_client_id"
GOOGLE_SERVICE_ACCOUNT_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
GOOGLE_SERVICE_ACCOUNT_TOKEN_URI="https://oauth2.googleapis.com/token"
GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email%40your_project.iam.gserviceaccount.com"
```

## Step 7: Extract Values from JSON

Open the downloaded JSON file and copy the values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project.iam.gserviceaccount.com"
}
```

## Step 8: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your website and fill out the contact form
3. Submit the form
4. Check your Google Sheet to see if the data was added

## Troubleshooting

### Common Issues:

1. **"Google Sheet ID not configured"**
   - Make sure `GOOGLE_SHEET_ID` is set correctly in your `.env.local`

2. **"Invalid credentials"**
   - Verify all service account credentials are copied correctly
   - Make sure the private key includes the `\n` characters

3. **"Permission denied"**
   - Ensure the service account email has "Editor" access to the Google Sheet
   - Check that the Google Sheets API is enabled

4. **"Sheet not found"**
   - Verify the Sheet ID is correct
   - Make sure the sheet exists and is accessible

### Security Notes:

- Never commit your `.env.local` file to version control
- Keep your service account credentials secure
- Consider using environment-specific sheets for development/production

## Form Fields

The form will collect the following data:
- **Timestamp**: Automatically added when form is submitted
- **Name**: Customer's full name (required)
- **Car**: Preferred car model (optional)
- **Phone**: Contact number (required)
- **Email**: Email address (required)
- **Pickup Date**: Preferred pickup date (optional)
- **Return Date**: Preferred return date (optional)
- **Message**: Additional requirements (optional)
