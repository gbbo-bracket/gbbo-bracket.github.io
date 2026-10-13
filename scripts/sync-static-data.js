// Pulls the current Bakers, Participants (standings), and Weeks tables from
// Airtable and rewrites the static data files under js/data/. The site reads
// those files instead of calling Airtable for this mostly-static data, so run
// this by hand whenever it changes in Airtable: a participant is added, a
// week's results are scored, or the active week/air dates change.
//
//   npm run sync-static-data

import Airtable from 'airtable';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

try {
  process.loadEnvFile();
} catch (error) {
  console.error('Could not load .env - make sure VITE_AIRTABLE_API_KEY is set in the environment.');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'js', 'data');
const BASE_ID = 'appt74I8hmWadsxFz';

const apiKey = process.env.VITE_AIRTABLE_API_KEY;
if (!apiKey) {
  console.error('Missing VITE_AIRTABLE_API_KEY. Add it to .env before running this script.');
  process.exit(1);
}

const base = new Airtable({ apiKey, endpointUrl: 'https://api.airtable.com' }).base(BASE_ID);

// Added locally to each participant record: { [weekRecordId]: overall total up to that week }
const TOTALS_FIELD = 'Total Points By Week';

const TABLES = [
  { tableId: 'tblr3HgyuPk2rOLQJ', exportName: 'contestantsData', file: 'contestants-data.js', description: 'Bakers/contestants table', skipFields: ['Image'] },
  { tableId: 'tblX7SVGLgZ59tiWB', exportName: 'participantsData', file: 'participants-data.js', description: 'Participants (standings) table' },
  { tableId: 'tblCV1RozeH3oz1DW', exportName: 'weeksData', file: 'weeks-data.js', description: 'Weeks (baker results) table' }
];

// skipFields are dropped from each record. Baker photos are skipped because
// Airtable's attachment links expire; they live in js/data/contestant-images.js
async function fetchRecords(tableId, skipFields = []) {
  const airtableRecords = await base(tableId).select().all();
  return airtableRecords.map(record => ({
    id: record.id,
    data: Object.fromEntries(Object.entries(record.fields).filter(([field]) => !skipFields.includes(field)))
  }));
}

function writeStaticFile({ exportName, file, description }, records) {
  const contents = `// ${description}, synced from Airtable.
// Regenerate with: npm run sync-static-data
// Last synced: ${new Date().toISOString()}
export const ${exportName} = ${JSON.stringify(records, null, 2)};
`;
  writeFileSync(join(DATA_DIR, file), contents);
  console.log(`Wrote ${records.length} records to js/data/${file}`);
}

// A week counts as scored once its Star Baker result has been entered. The
// most recent one (by air date) is the week the participants' current
// Total Points run up to.
function findLatestScoredWeek(weekRecords) {
  return weekRecords
    .filter(week => week.data['Star Baker']?.length)
    .sort((a, b) => String(b.data['Air date']).localeCompare(String(a.data['Air date'])))[0];
}

// Total Points in Airtable is always the running total, so it is saved per
// week as it is synced: the overall total up to that week. A total that is
// already saved for a week is never overwritten, so re-scoring later weeks
// can't change what an earlier week showed.
async function addTotalsByWeek(participants, weekRecords) {
  const latestWeek = findLatestScoredWeek(weekRecords);
  if (!latestWeek) return participants;

  let existing = [];
  try {
    ({ participantsData: existing } = await import(pathToFileURL(join(DATA_DIR, 'participants-data.js')).href));
  } catch (error) {
    // First run - nothing has been saved locally yet
  }
  const savedById = new Map(existing.map(record => [record.id, record.data[TOTALS_FIELD] || {}]));

  return participants.map(record => {
    const saved = { ...savedById.get(record.id) };
    if (!(latestWeek.id in saved)) {
      saved[latestWeek.id] = record.data['Total Points'] || 0;
    }
    return { ...record, data: { ...record.data, [TOTALS_FIELD]: saved } };
  });
}

async function main() {
  const weekTable = TABLES.find(table => table.exportName === 'weeksData');
  const weekRecords = await fetchRecords(weekTable.tableId, weekTable.skipFields);

  for (const table of TABLES) {
    let records = table === weekTable ? weekRecords : await fetchRecords(table.tableId, table.skipFields);
    if (table.exportName === 'participantsData') {
      records = await addTotalsByWeek(records, weekRecords);
    }
    writeStaticFile(table, records);
  }
}

main().catch(error => {
  console.error('Sync failed:', error);
  process.exit(1);
});
