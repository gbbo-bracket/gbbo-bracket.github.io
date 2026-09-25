/**
 * Region preference (UK or US).
 *
 * The show airs on different dates either side of the Atlantic, so the site lets
 * people pick which schedule they are following. The choice is remembered in
 * localStorage and broadcast on `window` so every component can react to it.
 */

export const UK = 'UK';
export const US = 'US';

const STORAGE_KEY = 'gbbo-region';
export const REGION_CHANGE_EVENT = 'gbbo-region-change';

/** Airtable field holding the air date for each region */
const AIR_DATE_FIELDS = {
  [UK]: 'Air date',
  [US]: '[US] Air date'
};

/**
 * The region the visitor is currently viewing, defaulting to the US since
 * most of the league watches there
 * @returns {string} UK or US
 */
export function getRegion() {
  try {
    return localStorage.getItem(STORAGE_KEY) === UK ? UK : US;
  } catch (error) {
    // Private browsing and blocked storage both throw here
    console.warn('Could not read the saved region, defaulting to US:', error);
    return US;
  }
}

/**
 * Save the region and let every listening component know it changed
 * @param {string} region - UK or US
 */
export function setRegion(region) {
  const next = region === UK ? UK : US;

  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    console.warn('Could not save the region:', error);
  }

  window.dispatchEvent(new CustomEvent(REGION_CHANGE_EVENT, { detail: { region: next } }));
}

/**
 * Swap between the two regions
 * @returns {string} The region that is now selected
 */
export function toggleRegion() {
  const next = getRegion() === UK ? US : UK;
  setRegion(next);
  return next;
}

/**
 * The air date for a week, in the selected region
 * @param {Object} data - The fields of an Airtable baker results record
 * @param {string} region - UK or US
 * @returns {string} The air date, or an empty string when the week has none.
 *                   Falls back to the UK date if a week has no US date yet.
 */
export function getAirDate(data = {}, region = getRegion()) {
  return data[AIR_DATE_FIELDS[region]] || data[AIR_DATE_FIELDS[UK]] || '';
}

/**
 * Turn an Airtable date (YYYY-MM-DD) into midnight on that day, in the
 * visitor's own time zone. `new Date('2026-09-22')` is midnight UTC, which is
 * still the 21st for anyone in the Americas, so parse the parts by hand.
 * @param {string} airDate - The Airtable date string
 * @returns {Date} The start of that day locally, or an invalid Date if there is none
 */
export function parseAirDate(airDate) {
  if (!airDate) return new Date(NaN);

  const [year, month, day] = String(airDate).split('-').map(Number);
  if (!year || !month || !day) return new Date(NaN);

  return new Date(year, month - 1, day);
}
