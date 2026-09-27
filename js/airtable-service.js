// Airtable Service for GBBO Bracket
import Airtable from 'airtable';

// How long to wait on an Airtable request before giving up and surfacing an
// error, so the UI doesn't sit in a loading state forever (e.g. during rate limiting).
const REQUEST_TIMEOUT_MS = 30000;

function withTimeout(promise, ms = REQUEST_TIMEOUT_MS) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Airtable request timed out after ${ms / 1000}s`));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function isRateLimitError(error) {
  return error?.statusCode === 429 || error?.error === 'TOO_MANY_REQUESTS';
}

class AirtableService {
  constructor() {
    // You'll need to set your PAT (Personal Access Token) as an environment variable or directly here
    // For development, you can set it directly. For production, use environment variables.
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY || 'YOUR_PAT_HERE';
    this.baseId = 'appt74I8hmWadsxFz';
    this.tableId = 'tblr3HgyuPk2rOLQJ';
    this.standingsTableId = 'tblX7SVGLgZ59tiWB';
    this.fieldId = 'fld0jifHbIykXaoqm';

    // Initialize Airtable with Personal Access Token
    this.base = new Airtable({
      apiKey: this.apiKey,
      // Modern Airtable uses Personal Access Tokens
      endpointUrl: 'https://api.airtable.com',
      // Surface a 429 immediately instead of the SDK silently retrying with
      // backoff, which would otherwise hang the UI's loading state during a rate limit
      noRetryIfRateLimited: true,
      requestTimeout: REQUEST_TIMEOUT_MS
    }).base(this.baseId);
  }

  /**
   * Fetch all records from the specified table
   * @param {string} tableId - Optional table ID, defaults to the main table
   * @returns {Promise<Array>} Array of records with the specified field data
   */
  async fetchRecords(tableId = null) {
    try {
      const targetTableId = tableId || this.tableId;
      const airtableRecords = await withTimeout(this.base(targetTableId).select().all());

      const records = airtableRecords.map(record => ({
        id: record.id,
        data: record.fields
      }));

      console.log(`Fetched ${records.length} records from table ${targetTableId}`);
      return records;

    } catch (error) {
      console.error('Error fetching Airtable data:', error);
      if (isRateLimitError(error)) {
        throw new Error('Airtable rate limit exceeded. Please try again in a moment.');
      }
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
      const record = await withTimeout(this.base(this.tableId).find(recordId));

      return {
        id: record.id,
        data: record.fields
      };

    } catch (error) {
      console.error(`Error fetching record ${recordId}:`, error);
      if (isRateLimitError(error)) {
        throw new Error('Airtable rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(`Failed to fetch record: ${error.message}`);
    }
  }

  /**
   * Get field data with filtering options
   * @param {Object} options - Filter and sort options
   * @param {string} tableId - Optional table ID, defaults to the main table
   * @returns {Promise<Array>} Filtered array of field data
   */
  async fetchFilteredRecords(options = {}, tableId = null) {
    try {
      const targetTableId = tableId || this.tableId;
      const selectOptions = {
        view: options.view || 'Grid view',
        ...options
      };
      
      const airtableRecords = await withTimeout(this.base(targetTableId).select(selectOptions).all());

      const records = airtableRecords.map(record => ({
        id: record.id,
        data: record.fields
      }));

      return records;

    } catch (error) {
      console.error('Error fetching filtered Airtable data:', error);
      if (isRateLimitError(error)) {
        throw new Error('Airtable rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(`Failed to fetch filtered data: ${error.message}`);
    }
  }

  /**
   * Create a new record in the specified table
   * @param {string} tableId - The table ID to create the record in
   * @param {Object} fields - The field data for the new record
   * @returns {Promise<Object>} The created record data
   */
  async createRecord(tableId, fields) {
    try {
      console.log(`Creating record in table ${tableId} with fields:`, fields);
      console.log(`Using API key: ${this.apiKey.substring(0, 10)}...`);
      console.log(`Using base ID: ${this.baseId}`);
      
      const record = await withTimeout(this.base(tableId).create(fields));

      console.log(`Created new record in table ${tableId}:`, record.id);
      return {
        id: record.id,
        data: record.fields
      };

    } catch (error) {
      console.error(`Error creating record in table ${tableId}:`, error);
      console.error(`Error details:`, {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response
      });
      if (isRateLimitError(error)) {
        throw new Error('Airtable rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }

  /**
   * Update an existing record in the specified table
   * @param {string} tableId - The table ID the record lives in
   * @param {string} recordId - The Airtable record ID to update
   * @param {Object} fields - The field data to update
   * @returns {Promise<Object>} The updated record data
   */
  async updateRecord(tableId, recordId, fields) {
    try {
      const record = await withTimeout(this.base(tableId).update(recordId, fields));

      console.log(`Updated record ${recordId} in table ${tableId}`);
      return {
        id: record.id,
        data: record.fields
      };

    } catch (error) {
      console.error(`Error updating record ${recordId} in table ${tableId}:`, error);
      if (isRateLimitError(error)) {
        throw new Error('Airtable rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(`Failed to update record: ${error.message}`);
    }
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export default airtableService; 