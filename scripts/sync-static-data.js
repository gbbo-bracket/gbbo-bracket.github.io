// Pulls the Bakers and Participants tables from Airtable and rewrites the
// static data files under js/data/. The site reads those files for the data
// that never changes during a season - who the bakers and participants are -
// so run this by hand whenever one of them is added or renamed in Airtable.
// Results, points, air dates and the active week are not saved here: the site
// fetches those live on every page load.
//
//   npm run sync-static-data

import Airtable from 'airtable';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

const TABLES = [
  { tableId: 'tblr3HgyuPk2rOLQJ', exportName: 'contestantsData', file: 'contestants-data.js', description: 'Bakers/contestants table', skipFields: ['Image'] },
  { tableId: 'tblX7SVGLgZ59tiWB', exportName: 'participantsData', file: 'participants-data.js', description: 'Participants (names) table', keepFields: ['Name', 'Emoji'] }
];

// skipFields are dropped from each record, and when keepFields is given only
// those fields are saved. Baker photos are skipped because Airtable's
// attachment links expire; they live in js/data/contestant-images.js
async function fetchRecords(tableId, { skipFields = [], keepFields = null } = {}) {
  const airtableRecords = await base(tableId).select().all();
  return airtableRecords.map(record => ({
    id: record.id,
    data: Object.fromEntries(Object.entries(record.fields).filter(([field]) =>
      !skipFields.includes(field) && (!keepFields || keepFields.includes(field))))
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

async function main() {
  for (const table of TABLES) {
    writeStaticFile(table, await fetchRecords(table.tableId, table));
  }
}

main().catch(error => {
  console.error('Sync failed:', error);
  process.exit(1);
});
