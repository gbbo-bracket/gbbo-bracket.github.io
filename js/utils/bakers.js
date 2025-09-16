import airtableService from '../airtable-service.js';

/**
 * Fetch contestants from Airtable and format them for use in components
 * @returns {Promise<Array>} Array of formatted contestant objects
 */
export async function fetchContestants() {
  try {
    console.log('Fetching contestants...');
    const records = await airtableService.fetchRecords();
    const contestants = records.map(record => ({
      id: record.id,
      name: record.data.Name || 'Unknown Contestant',
      ...record.data
    }));
    console.log('Contestants loaded:', contestants);
    return contestants.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Failed to fetch contestants:', error);
    throw error;
  }
}
