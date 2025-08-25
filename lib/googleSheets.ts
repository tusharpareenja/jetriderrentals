import { google } from 'googleapis';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface FormSubmission {
  name: string;
  car: string;
  phone: string;
  email: string;
  pickupDate: string;
  returnDate: string;
  message: string;
}

export async function addFormSubmissionToSheet(data: FormSubmission) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:G'; // Adjust based on your sheet structure

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const values = [
      [
        new Date().toISOString(), // Timestamp
        data.name,
        data.car,
        data.phone,
        data.email,
        data.pickupDate,
        data.returnDate,
        data.message,
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      message: 'Form submission added successfully',
      data: response.data,
    };
  } catch (error) {
    console.error('Error adding form submission to Google Sheets:', error);
    return {
      success: false,
      message: 'Failed to add form submission to Google Sheets',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getFormSubmissions() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:H'; // Adjust based on your sheet structure

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    
    // Skip header row and map to objects
    const submissions = rows.slice(1).map((row) => ({
      timestamp: row[0],
      name: row[1],
      car: row[2],
      phone: row[3],
      email: row[4],
      pickupDate: row[5],
      returnDate: row[6],
      message: row[7],
    }));

    return {
      success: true,
      submissions,
    };
  } catch (error) {
    console.error('Error fetching form submissions from Google Sheets:', error);
    return {
      success: false,
      message: 'Failed to fetch form submissions from Google Sheets',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
