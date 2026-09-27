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
  { tableId: 'tblr3HgyuPk2rOLQJ', exportName: 'contestantsData', file: 'contestants-data.js', description: 'Bakers/contestants table' },
  { tableId: 'tblX7SVGLgZ59tiWB', exportName: 'participantsData', file: 'participants-data.js', description: 'Participants (standings) table' },
  { tableId: 'tblCV1RozeH3oz1DW', exportName: 'weeksData', file: 'weeks-data.js', description: 'Weeks (baker results) table' }
];

async function fetchRecords(tableId) {
  const airtableRecords = await base(tableId).select().all();
  return airtableRecords.map(record => ({ id: record.id, data: record.fields }));
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
    const records = await fetchRecords(table.tableId);
    writeStaticFile(table, records);
  }
}

main().catch(error => {
  console.error('Sync failed:', error);
  process.exit(1);
});
