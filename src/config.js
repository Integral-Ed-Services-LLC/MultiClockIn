export const EnvironmentTypes = {
  DEVELOP: 'develop',
  PRODUCTION: 'production'
};

export const ENV = import.meta.env.ENV || EnvironmentTypes.DEVELOP;

export const AirtableConfig = {
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY,

  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID
};
