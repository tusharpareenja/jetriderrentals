"use server"

import { addFormSubmissionToSheet, FormSubmission } from '@/lib/googleSheets'

export async function submitToGoogleSheets(data: FormSubmission) {
  try {
    const result = await addFormSubmissionToSheet(data)
    return result
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error)
    return {
      success: false,
      message: 'Failed to submit to Google Sheets'
    }
  }
}
