import { contestantsData } from '../data/contestants-data.js';
import { contestantImages } from '../data/contestant-images.js';

/**
 * The contestants, formatted for use in components. Bakers only change when
 * an episode airs, so this reads the static data synced from Airtable
 * (see scripts/sync-static-data.js) instead of fetching it live.
 * @returns {Promise<Array>} Array of formatted contestant objects
 */
export async function fetchContestants() {
  const contestants = contestantsData.map(record => ({
    id: record.id,
    name: record.data.Name || 'Unknown Contestant',
    ...record.data,
    imageUrl: contestantImages[record.data.Name] || ''
  }));
  return contestants.sort((a, b) => a.name.localeCompare(b.name));
}
