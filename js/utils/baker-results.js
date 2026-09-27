import { weeksData } from '../data/weeks-data.js';
import { FINALS_WEEK_ID } from './nominations.js';

function formatWeek(record) {
  return {
    id: record.id,
    week: record.data.Title || 'Unknown Week',
    isActive: record.data['Is active?'] || false,
    ...record.data
  };
}

/**
 * The weeks, formatted for use in components. Air dates and results only
 * change when an episode airs or the active week is toggled, so this reads
 * the static data synced from Airtable (see scripts/sync-static-data.js)
 * instead of fetching it live.
 * @returns {Promise<Array>} Array of formatted week objects
 */
export async function fetchAllWeeks() {
  return weeksData.map(formatWeek).sort((a, b) => a.week.localeCompare(b.week));
}

export async function fetchActiveWeeks() {
  const activeWeeks = weeksData
    .filter(record => record.data['Is active?'])
    .map(formatWeek)
    .sort((a, b) => a.week.localeCompare(b.week));
  // "Finals" sorts alphabetically ahead of "Week N", but it belongs after them
  activeWeeks.sort((a, b) => (a.id === FINALS_WEEK_ID) - (b.id === FINALS_WEEK_ID));

  return activeWeeks;
}

/**
 * A single week by its record ID, whether or not it's currently active -
 * used when <gbbo-vote> is given a single week-id
 * @param {string} weekId - Record ID of the week in the baker results table
 * @returns {Promise<Object|null>} The formatted week object, or null if it doesn't exist
 */
export async function fetchWeek(weekId) {
  const record = weeksData.find(record => record.id === weekId);
  return record ? formatWeek(record) : null;
}
