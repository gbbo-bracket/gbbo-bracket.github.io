import airtableService from '../airtable-service.js';
import { fetchNames } from './participants.js';
import { fetchContestants } from './bakers.js';

// Table ID for nominations
const NOMINATIONS_TABLE_ID = 'tblL01LW4xJwPHfiq';

// Record ID of the Finals week in the baker results table - the finals form
// nominates against this fixed week rather than one a participant picks
export const FINALS_WEEK_ID = 'recqnEKzRQ1v1lTke';

// Field IDs for the nominations table
const FIELD_IDS = {
  week: 'fldz1SM3R7mTx2ECm',           // Week record ID from baker results table
  participant: 'flduBixGGqW2A2xKT',    // Participant record ID
  starBaker: 'fldy85DDRLigSUwhE',       // Star baker nomination
  technical: 'fld5IBE5Q2QNmBWlk',       // Technical nomination
  eliminated: 'fldZSAtOaYf7nVDg9'       // Eliminated nomination
};

/**
 * Create or update a participant's nomination for a week in Airtable. A
 * participant can only have one nomination per week, so if they already have
 * one it's updated in place (preserving any points an admin has already
 * scored it with) rather than leaving behind a stale duplicate.
 * @param {Object} nominationData - The nomination data
 * @param {string} nominationData.weekId - Record ID of the week in the baker results table
 * @param {string} nominationData.participantId - Record ID of the participant who is nominating
 * @param {string} nominationData.starBakerId - Record ID of the baker nominated for star baker
 * @param {string} nominationData.technicalId - Record ID of the baker nominated for technical
 * @param {string} nominationData.eliminatedId - Record ID of the baker nominated for eliminated
 * @returns {Promise<Object>} The created or updated nomination record
 */
export async function createNomination({
  weekId,
  participantId,
  starBakerId,
  technicalId,
  eliminatedId
}) {
  try {
    // Validate required fields
    if (!weekId || !participantId || !starBakerId || !technicalId || !eliminatedId) {
      throw new Error('Missing required fields for nomination');
    }

    // Prepare the fields object with the correct field IDs
    const fields = {
      [FIELD_IDS.week]: [weekId],           // Link to week record
      [FIELD_IDS.participant]: [participantId], // Link to participant record
      [FIELD_IDS.starBaker]: [starBakerId],     // Link to star baker record
      [FIELD_IDS.technical]: [technicalId],     // Link to technical baker record
      [FIELD_IDS.eliminated]: [eliminatedId]    // Link to eliminated baker record
    };

    return await upsertNomination({ weekId, participantId, fields });

  } catch (error) {
    console.error('Failed to save nomination:', error);
    throw error;
  }
}

/**
 * Create the record if this participant has no nomination for the week yet,
 * otherwise update their existing one instead of creating a duplicate.
 */
async function upsertNomination({ weekId, participantId, fields }) {
  let existing = null;
  try {
    existing = await fetchNomination({ weekId, participantId });
  } catch (error) {
    // No existing nomination for this participant/week yet - a new one is created below
  }

  if (existing) {
    console.log(`Updating existing nomination ${existing.id}`);
    return await airtableService.updateRecord(NOMINATIONS_TABLE_ID, existing.id, fields);
  }

  console.log('Creating new nomination record');
  return await airtableService.createRecord(NOMINATIONS_TABLE_ID, fields);
}

/**
 * Create a new nomination record in Airtable
 * @param {Object} nominationData - The nomination data
 * @param {string} nominationData.weekId - Record ID of the week in the baker results table
 * @param {string} nominationData.participantId - Record ID of the participant who is nominating
 * @returns {Promise<Object>} The created nomination record
 */
export async function fetchNomination({
  weekId,
  participantId,
}) {
  try {
    console.log('Getting nomination record...');
    console.log('Input data:', {
      weekId,
      participantId,
    });
    
    // Validate required fields
    if (!weekId || !participantId) {
      throw new Error('Missing required fields for nomination');
    }

    console.log('Table ID:', NOMINATIONS_TABLE_ID);
    console.log('Filter by formula:', `AND({Week Record ID} = "${weekId}", {Participant Record ID} = "${participantId}")`);
    
    const nominationRecords = await airtableService.fetchFilteredRecords({
      filterByFormula: `AND({Week Record ID} = "${weekId}", {Participant Record ID} = "${participantId}")`
    }, NOMINATIONS_TABLE_ID);

    if (nominationRecords.length === 0) {
      throw new Error('No existing nomination found');
    } else if (nominationRecords.length > 1) {
      console.log('Multiple nominations found, returning the most recent one');
      return nominationRecords[nominationRecords.length - 1];
    } else {
      console.log('Single nomination found, returning it');
      return nominationRecords[0];
    }

  } catch (error) {
    console.error('Failed to fetch nomination:', error);
    throw error;
  }
}

export async function createFinalistNomination({
  participantId,
  winnerId,
  finalist1Id,
  finalist2Id,
}) {
  try {
    // Validate required fields
    if (!participantId || !winnerId || !finalist1Id || !finalist2Id) {
      throw new Error('Missing required fields for nomination');
    }

    // Prepare the fields object with the correct field IDs
    const fields = {
      [FIELD_IDS.week]: [FINALS_WEEK_ID],       // Link to week record
      [FIELD_IDS.participant]: [participantId], // Link to participant record
      'fldsc0oULKrEs8wDZ': [winnerId],        // Link to winner record
      'fldOugexvoVFbEAHx': [finalist1Id],     // Link to finalist1 record
      'fld6vuk7h63FT9PV0': [finalist2Id]      // Link to finalist2 record
    };

    return await upsertNomination({ weekId: FINALS_WEEK_ID, participantId, fields });

  } catch (error) {
    console.error('Failed to save finalist nomination:', error);
    throw error;
  }
}

/**
 * The points every participant scored for a given week (or Finals), plus
 * their Star Baker/Technical/Eliminated picks if they voted, for the
 * Standings page's per-week toggles. Participants who haven't been scored
 * for the week yet (or haven't voted at all) show as 0 points with no picks,
 * same as the overall standings do before any points are in. Picks are the
 * full baker record (not just a name) so Standings can open the same detail
 * modal the Contestants page uses when one is clicked.
 * @param {string} weekId - Record ID of the week in the baker results table
 * @returns {Promise<Array<{name: string, points: number, picks: ?{starBaker: ?Object, technical: ?Object, eliminated: ?Object}}>>}
 */
export async function fetchWeekStandings(weekId) {
  const [nominationRecords, participants, contestants] = await Promise.all([
    airtableService.fetchFilteredRecords({
      filterByFormula: `{Week Record ID} = "${weekId}"`
    }, NOMINATIONS_TABLE_ID),
    fetchNames(),
    fetchContestants()
  ]);

  const bakerById = new Map(contestants.map(contestant => [contestant.id, contestant]));
  const getBaker = id => id ? (bakerById.get(id) || null) : null;

  const nominationByParticipantId = new Map();
  nominationRecords.forEach(record => {
    const participantId = record.data['Participant']?.[0];
    if (participantId) nominationByParticipantId.set(participantId, record.data);
  });

  return participants
    .map(participant => {
      const nomination = nominationByParticipantId.get(participant.id);
      // The Finals form saves to this same table but doesn't fill these three
      // fields, so a Finals nomination correctly ends up with no picks here
      const hasWeeklyPicks = nomination && (nomination['Star Baker'] || nomination['Wins Technical'] || nomination['Eliminated']);

      return {
        name: participant.name,
        points: parseInt(nomination?.['Total Points']) || 0,
        picks: hasWeeklyPicks ? {
          starBaker: getBaker(nomination['Star Baker']?.[0]),
          technical: getBaker(nomination['Wins Technical']?.[0]),
          eliminated: getBaker(nomination['Eliminated']?.[0])
        } : null
      };
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}
