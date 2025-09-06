import airtableService from '../airtable-service.js';

/**
 * Add a new participant to the standings table
 * @param {string} name - The participant's name
 * @returns {Promise<Object>} The created participant record
 */
export async function addParticipant(name) {
  try {
    console.log('Adding new participant to standings table:', name);
    
    // Prepare the fields object for the standings table
    const fields = {
      'Name': name,
    };

    console.log('Fields:', fields);
    
    const createdRecord = await airtableService.createRecord(
      airtableService.standingsTableId, 
      fields
    );
    
    console.log('Participant added successfully:', createdRecord);
    return createdRecord;
    
  } catch (error) {
    console.error('Failed to add participant:', error);
    throw error;
  }
}

/**
 * Check if a participant name already exists in the standings table
 * @param {string} name - The participant's name to check
 * @returns {Promise<boolean>} True if the name already exists
 */
export async function checkParticipantExists(name) {
  try {
    console.log('Checking if participant exists:', name);
    
    const records = await airtableService.fetchRecords(airtableService.standingsTableId);
    const existingParticipant = records.find(record => 
      record.data.Name && record.data.Name.toLowerCase() === name.toLowerCase()
    );
    
    return !!existingParticipant;
    
  } catch (error) {
    console.error('Failed to check participant existence:', error);
    throw error;
  }
}
