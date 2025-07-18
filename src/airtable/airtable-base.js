import Airtable from 'airtable';
import { AirtableConfig } from '../config';

export const TimesheetBase = new Airtable({
  apiKey: AirtableConfig.API_KEY
}).base(AirtableConfig.BASE_ID);
