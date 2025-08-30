// Airtable Service for GBBO Bracket
import Airtable from 'airtable';

class AirtableService {
  constructor() {
    // You'll need to set your PAT (Personal Access Token) as an environment variable or directly here
    // For development, you can set it directly. For production, use environment variables.
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY || 'YOUR_PAT_HERE';
    this.baseId = 'appSJQe0OFR0pEtOj';
    this.tableId = 'tblr3HgyuPk2rOLQJ';
    this.fieldId = 'fld0jifHbIykXaoqm';
    
    // Initialize Airtable with Personal Access Token
    this.base = new Airtable({ 
      apiKey: this.apiKey,
      // Modern Airtable uses Personal Access Tokens
      endpointUrl: 'https://api.airtable.com'
    }).base(this.baseId);
  }

  /**
   * Fetch all records from the specified table
   * @returns {Promise<Array>} Array of records with the specified field data
   */
  async fetchRecords() {
    try {
      const airtableRecords = await this.base(this.tableId).select().all();
      
      const records = airtableRecords.map(record => ({
        id: record.id,
        data: record.fields
      }));

      console.log(`Fetched ${records.length} records from Airtable`);
      return records;
      
    } catch (error) {
      console.error('Error fetching Airtable data:', error);
      throw new Error(`Failed to fetch data from Airtable: ${error.message}`);
    }
  }

  /**
   * Fetch a specific record by ID
   * @param {string} recordId - The Airtable record ID
   * @returns {Promise<Object>} The record data
   */
  async fetchRecord(recordId) {
    try {
      const record = await this.base(this.tableId).find(recordId);
      
      return {
        id: record.id,
        data: record.fields
      };
      
    } catch (error) {
      console.error(`Error fetching record ${recordId}:`, error);
      throw new Error(`Failed to fetch record: ${error.message}`);
    }
  }

  /**
   * Get field data with filtering options
   * @param {Object} options - Filter and sort options
   * @returns {Promise<Array>} Filtered array of field data
   */
  async fetchFilteredRecords(options = {}) {
    try {
      const selectOptions = {
        view: options.view || 'Grid view',
        ...options
      };
      
      const airtableRecords = await this.base(this.tableId).select(selectOptions).all();
      
      const records = airtableRecords.map(record => ({
        id: record.id,
        allFields: record.fields
      }));

      return records;
      
    } catch (error) {
      console.error('Error fetching filtered Airtable data:', error);
      throw new Error(`Failed to fetch filtered data: ${error.message}`);
    }
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export default airtableService; 