import airtableService from '../airtable-service.js';

/**
 * Fetch weeks from the baker results table
 * @returns {Promise<Array>} Array of formatted week objects
 */
export async function fetchAllWeeks() {
  try {
    console.log('Fetching weeks from baker results table...');
    const records = await airtableService.fetchRecords('tblCV1RozeH3oz1DW');
    const weeks = records.map(record => ({
      id: record.id,
      week: record.data.Title || 'Unknown Week',
      isActive: record.data['Is active?'] || false,
      ...record.data
    })).sort((a, b) => a.week.localeCompare(b.week));
    console.log('Weeks loaded:', weeks);
    return weeks;
  } catch (error) {
    console.error('Failed to fetch weeks:', error);
    throw error;
  }
}

export async function fetchActiveWeeks() {
  try {
    console.log('Fetching active weeks from baker results table...');
    const records = await airtableService.fetchFilteredRecords({
      filterByFormula: `{Is active?} = TRUE()`
    }, 'tblCV1RozeH3oz1DW');
    
    const activeWeeks = records.map(record => ({
      id: record.id,
      week: record.data.Title || 'Unknown Week',
      isActive: record.data['Is active?'] || false,
      ...record.data
    })).sort((a, b) => a.week.localeCompare(b.week));
    
    console.log('Active weeks loaded:', activeWeeks);
    return activeWeeks;
  } catch (error) {
    console.error('Failed to fetch active weeks:', error);
    throw error;
  }
}

/**
 * Fetch a single week from the baker results table by its record ID, whether or
 * not it's currently active - used when a page votes on one fixed week (Finals)
 * @param {string} weekId - Record ID of the week in the baker results table
 * @returns {Promise<Object|null>} The formatted week object, or null if it doesn't exist
 */
export async function fetchWeek(weekId) {
  try {
    const records = await airtableService.fetchFilteredRecords({
      filterByFormula: `RECORD_ID() = "${weekId}"`
    }, 'tblCV1RozeH3oz1DW');

    const record = records[0];
    if (!record) return null;
    return {
      id: record.id,
      week: record.data.Title || 'Unknown Week',
      isActive: record.data['Is active?'] || false,
      ...record.data
    };
  } catch (error) {
    console.error(`Failed to fetch week ${weekId}:`, error);
    throw error;
  }
}
