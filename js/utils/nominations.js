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
    
    // Prepare the fields object with the correct field IDs
    const fields = {
      [FIELD_IDS.week]: [weekId],           // Link to week record
      [FIELD_IDS.participant]: [participantId], // Link to participant record
      [FIELD_IDS.starBaker]: [starBakerId],     // Link to star baker record
      [FIELD_IDS.technical]: [technicalId],     // Link to technical baker record
      [FIELD_IDS.eliminated]: [eliminatedId]    // Link to eliminated baker record
    };

    console.log('Fields:', fields);
    
    const createdRecord = await airtableService.createRecord(NOMINATIONS_TABLE_ID, fields);
    
    console.log('Nomination created successfully:', createdRecord);
    return createdRecord;
    
  } catch (error) {
    console.error('Failed to create nomination:', error);
    throw error;
  }
}
