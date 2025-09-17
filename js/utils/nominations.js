import airtableService from '../airtable-service.js';

// Table ID for nominations
const NOMINATIONS_TABLE_ID = 'tblL01LW4xJwPHfiq';

// Field IDs for the nominations table
const FIELD_IDS = {
  week: 'fldz1SM3R7mTx2ECm',           // Week record ID from baker results table
  participant: 'flduBixGGqW2A2xKT',    // Participant record ID
  starBaker: 'fldy85DDRLigSUwhE',       // Star baker nomination
  technical: 'fld5IBE5Q2QNmBWlk',       // Technical nomination
  eliminated: 'fldZSAtOaYf7nVDg9'       // Eliminated nomination
};

/**
 * Create a new nomination record in Airtable
 * @param {Object} nominationData - The nomination data
 * @param {string} nominationData.weekId - Record ID of the week in the baker results table
 * @param {string} nominationData.participantId - Record ID of the participant who is nominating
 * @param {string} nominationData.starBakerId - Record ID of the baker nominated for star baker
 * @param {string} nominationData.technicalId - Record ID of the baker nominated for technical
 * @param {string} nominationData.eliminatedId - Record ID of the baker nominated for eliminated
 * @returns {Promise<Object>} The created nomination record
 */
export async function createNomination({
  weekId,
  participantId,
  starBakerId,
  technicalId,
  eliminatedId
}) {
  try {
    console.log('Creating nomination record...');
    console.log('Input data:', {
      weekId,
      participantId,
      starBakerId,
      technicalId,
      eliminatedId
    });
    
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

    console.log('Fields:', fields);
    console.log('Field IDs:', FIELD_IDS);
    console.log('Table ID:', NOMINATIONS_TABLE_ID);
    
    const createdRecord = await airtableService.createRecord(NOMINATIONS_TABLE_ID, fields);
    
    console.log('Nomination created successfully:', createdRecord);
    return createdRecord;
    
  } catch (error) {
    console.error('Failed to create nomination:', error);
    throw error;
  }
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
    console.log('Creating nomination record...');
    console.log('Input data:', {
      participantId,
      winnerId, 
      finalist1Id,
      finalist2Id,
    });
    
    // Validate required fields
    if (!participantId || !winnerId || !finalist1Id || !finalist2Id) {
      throw new Error('Missing required fields for nomination');
    }
    
    // Prepare the fields object with the correct field IDs
    const fields = {
      [FIELD_IDS.week]: ['recqnEKzRQ1v1lTke'],  // Link to week record
      [FIELD_IDS.participant]: [participantId], // Link to participant record
      'fldsc0oULKrEs8wDZ': [winnerId],        // Link to winner record
      'fldOugexvoVFbEAHx': [finalist1Id],     // Link to finalist1 record
      'fld6vuk7h63FT9PV0': [finalist2Id]      // Link to finalist2 record
    };

    console.log('Fields:', fields);
    console.log('Field IDs:', FIELD_IDS);
    console.log('Table ID:', NOMINATIONS_TABLE_ID);
    
    const createdRecord = await airtableService.createRecord(NOMINATIONS_TABLE_ID, fields);
    
    console.log('Nomination created successfully:', createdRecord);
    return createdRecord;
    
  } catch (error) {
    console.error('Failed to create nomination:', error);
    throw error;
  }
}
