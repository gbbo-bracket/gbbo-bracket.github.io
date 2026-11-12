import airtableService from '../airtable-service.js';
import { FINALS_WEEK_ID } from './nominations.js';

// Table ID for the weeks (baker results) table
const WEEKS_TABLE_ID = 'tblCV1RozeH3oz1DW';

function formatWeek(record) {
  return {
    id: record.id,
    week: record.data.Title || 'Unknown Week',
    isActive: record.data['Is active?'] || false,
    ...record.data
  };
}

// The weeks table is fetched once per page load and shared, since several
// components on a page (next-week card, standings, vote) all need it. It is
// dropped on a failure so the next attempt retries instead of re-serving the error.
let weekRecordsPromise = null;

/**
 * The raw weeks (baker results) records, fetched live from Airtable on page
 * load: results, air dates, and whether each week is open for voting.
 * @returns {Promise<Array<{id: string, data: Object}>>}
 */
export function fetchWeekRecords() {
  if (!weekRecordsPromise) {
    weekRecordsPromise = airtableService.fetchRecords(WEEKS_TABLE_ID).catch(error => {
      weekRecordsPromise = null;
      throw error;
    });
  }
  return weekRecordsPromise;
}

/**
 * The weeks, formatted for use in components
 * @returns {Promise<Array>} Array of formatted week objects
 */
export async function fetchAllWeeks() {
  const records = await fetchWeekRecords();
  return records.map(formatWeek).sort((a, b) => a.week.localeCompare(b.week));
}

export async function fetchActiveWeeks() {
  const records = await fetchWeekRecords();
  const activeWeeks = records
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
  const records = await fetchWeekRecords();
  const record = records.find(record => record.id === weekId);
  return record ? formatWeek(record) : null;
}
