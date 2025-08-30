# Airtable Setup Guide

## Configuration

Your Airtable integration is configured to read from:
- **Base ID**: `appSJQe0OFR0pEtOj`
- **Table ID**: `tblr3HgyuPk2rOLQJ`
- **Field ID**: `fld0jifHbIykXaoqm`

## Setup Steps

1. **Get your Airtable Personal Access Token (PAT)**:
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Give it a name like "GBBO Bracket App"
   - Add scopes: `data.records:read` for your base
   - Select your base: `appSJQe0OFR0pEtOj`
   - Copy the token (it starts with `pat...`)

2. **Set up environment variables**:
   Create a `.env` file in your project root:
   ```
   VITE_AIRTABLE_API_KEY=your_actual_api_key_here
   ```

3. **Alternative: Direct Configuration**:
   If you prefer not to use environment variables, you can directly set the PAT in `js/airtable-service.js`:
   ```javascript
   this.apiKey = 'your_actual_pat_here';
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## Security Note

- Never commit your actual API key to version control
- Use environment variables for production deployments
- The `.env` file should be added to your `.gitignore`

## Troubleshooting

- If you see "YOUR_API_KEY_HERE" errors, make sure you've set up your API key correctly
- Check the browser console for detailed error messages
- Verify that your Airtable base, table, and field IDs are correct
- Ensure your API key has access to the specified base 