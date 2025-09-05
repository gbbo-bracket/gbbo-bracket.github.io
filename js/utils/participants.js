import airtableService from '../airtable-service.js';

/**
 * Fetch names from the standings table
 * @returns {Promise<Array>} Array of formatted name objects
 */
export async function fetchNames() {
    try {
      console.log('Fetching names from standings table...');
      const records = await airtableService.fetchRecords(airtableService.standingsTableId);
      const names = records.map(record => ({
        id: record.id,
        name: record.data.Name || 'Unknown Name',
        ...record.data
      }));
      console.log('Names loaded:', names);
      return names;
    } catch (error) {
      console.error('Failed to fetch names:', error);
      throw error;
    }
  }
  