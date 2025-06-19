import Airtable from 'airtable';

const API_KEY =
  import.meta.env.VITE_AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;

const BASE_ID =
  import.meta.env.VITE_AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

export const TimesheetBase = new Airtable({ apiKey: API_KEY }).base(BASE_ID);
