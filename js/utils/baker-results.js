import airtableService from '../airtable-service.js';

/**
 * Fetch weeks from the baker results table
 * @returns {Promise<Array>} Array of formatted week objects
 */
export async function fetchWeeks() {
  try {
    console.log('Fetching weeks from baker results table...');
    const records = await airtableService.fetchRecords('tblCV1RozeH3oz1DW');
    const weeks = records.map(record => ({
      id: record.id,
      week: record.data.Title || 'Unknown Week',
      ...record.data
    })).sort((a, b) => a.week.localeCompare(b.week));
    console.log('Weeks loaded:', weeks);
    return weeks;
  } catch (error) {
    console.error('Failed to fetch weeks:', error);
    throw error;
  }
}
