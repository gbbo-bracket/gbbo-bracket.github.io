import { participantsData } from '../data/participants-data.js';

/**
 * The participant roster and their current points, formatted for use in
 * components. This only changes when a participant is added directly in
 * Airtable or a week is scored, so it reads the static data synced from
 * Airtable (see scripts/sync-static-data.js) instead of fetching it live.
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
