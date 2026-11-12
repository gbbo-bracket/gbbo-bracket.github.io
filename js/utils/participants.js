import airtableService from '../airtable-service.js';
import { participantsData } from '../data/participants-data.js';

/**
 * The participant roster (names and emoji), formatted for use in components.
 * The roster doesn't change during the season, so it reads the static data
 * synced from Airtable (see scripts/sync-static-data.js) instead of fetching it live.
 * @returns {Promise<Array>} Array of formatted name objects
 */
export async function fetchNames() {
  const names = participantsData.map(record => ({
    id: record.id,
    name: record.data.Name || 'Unknown Name',
    ...record.data
  }));
  return names.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Every participant's current total points, fetched live from Airtable on page load
 * @returns {Promise<Map<string, number>>} Total points keyed by participant record ID
 */
export async function fetchTotalPoints() {
  const records = await airtableService.fetchRecords(airtableService.standingsTableId);
  return new Map(records.map(record => [record.id, parseInt(record.data['Total Points']) || 0]));
}
