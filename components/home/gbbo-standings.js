import { LitElement, html, css } from 'lit';
import '../shared/gbbo-loading-container.js';
import { airtableService } from '../../js/airtable-service.js';

export class GBBOStandings extends LitElement {
  static properties = {
    standings: { type: Array },
    title: { type: String },
    description: { type: String },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.standings = null;
    this.currentStandings = null;
    this.title = '';
    this.description = '';
    this.loading = true;
    this.error = null;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 4xl;
    }

    .standings-container {
      width: 100%;
    }

    .standings-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .standings-title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      font-weight: 700;
      color: var(--heading-text);
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .standings-subtitle {
      font-size: 1.25rem;
      color: var(--body-text);
      margin-bottom: 2rem;
    }

    .standings-table {
      background-color: rgba(255, 253, 245, 0.9);
      backdrop-filter: blur(8px);
      border-radius: 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(33, 65, 119, 0.1), 0 10px 10px -5px rgba(33, 65, 119, 0.04);
      overflow: hidden;
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--heading-text);
      font-weight: 600;
      padding: 1.5rem 2rem;
      text-align: left;
      font-size: 1.1rem;
      border-bottom: 2px solid rgba(247, 198, 217, 0.3);
    }

    th:first-child {
      text-align: center;
      width: 80px;
    }

    th:last-child {
      text-align: center;
      width: 120px;
    }

    td {
      padding: 1.25rem 2rem;
      border-bottom: 1px solid rgba(190, 228, 210, 0.3);
      transition: background-color 0.2s ease;
    }

    .picks-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .pick-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background-color: rgba(169, 208, 245, 0.15);
      border: 1px solid rgba(169, 208, 245, 0.35);
      border-radius: 999px;
      padding: 0.2rem 0.65rem;
      font-size: 0.85rem;
      color: var(--body-text);
      white-space: nowrap;
    }

    .no-picks {
      font-size: 0.85rem;
      color: var(--body-text);
      opacity: 0.6;
      font-style: italic;
    }

    tr:hover td {
      background-color: rgba(190, 228, 210, 0.1);
    }

    tr:last-child td {
      border-bottom: none;
    }

    .rank {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--heading-text);
      text-align: center;
    }

    .rank.first {
      color: var(--golden-brown);
    }

    .rank.second {
      color: var(--powder-blue);
    }

    .rank.third {
      color: var(--berry-red);
    }

    .participant-name {
      font-weight: 600;
      color: var(--body-text);
      font-size: 1.1rem;
    }

    .points {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--heading-text);
      text-align: center;
    }

    .error {
      text-align: center;
      padding: 3rem;
      color: var(--berry-red);
      font-size: 1.1rem;
    }

    .medal {
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .standings-title {
        font-size: 2.25rem;
      }

      .standings-subtitle {
        font-size: 1.1rem;
      }

      th, td {
        padding: 1rem;
        font-size: 0.95rem;
      }

      .standings-title {
        font-size: 2rem;
      }
    }

    /* Below the breakpoint there isn't room for a Rank/Participant/Picks/Points
       row of columns, so each participant becomes its own stacked card:
       rank, name and points on one line, picks wrapping onto their own line
       below instead of squeezing into a fifth narrow column. */
    @media (max-width: 640px) {
      .standings-title {
        font-size: 1.75rem;
      }

      thead {
        display: none;
      }

      table, tbody {
        display: block;
        width: 100%;
      }

      tr {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        column-gap: 0.75rem;
        row-gap: 0.5rem;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid rgba(190, 228, 210, 0.3);
      }

      tr:last-child {
        border-bottom: none;
      }

      td {
        display: block;
        padding: 0;
        border-bottom: none;
        font-size: 0.9rem;
      }

      .rank {
        order: 1;
        width: auto;
      }

      .participant-name {
        order: 2;
        font-size: 1rem;
      }

      .points {
        order: 3;
        margin-left: auto;
      }

      .picks-cell {
        order: 4;
        flex-basis: 100%;
      }
    }
  `;

  willUpdate(changedProperties) {
    // The standings can be swapped at any time - the picker hands over a past
    // season's results when one of its toggles is clicked - so react to every
    // change rather than only reading the value once on connect.
    if (changedProperties.has('standings')) {
      this.applyStandings();
    }
  }

  applyStandings() {
    // Standings set as an HTML attribute arrive as a JSON string.
    if (typeof this.standings === 'string') {
      try {
        this.standings = JSON.parse(this.standings);
      } catch (error) {
        console.error('Error parsing standings JSON:', error);
        this.standings = null;
        this.error = 'Invalid standings data format';
        this.loading = false;
        return;
      }
    }

    // Custom standings were handed to us, so there is nothing to fetch.
    if (Array.isArray(this.standings)) {
      this.error = null;
      this.loading = false;
      return;
    }

    // No standings given, so show the current ones from Airtable. They are
    // remembered after the first fetch so switching back does not reload them.
    if (this.currentStandings) {
      this.standings = this.currentStandings;
      this.error = null;
      this.loading = false;
      return;
    }

    this.fetchStandings();
  }

  async fetchStandings() {
    try {
      this.loading = true;
      this.error = null;
      
      if (!this.standings) {
        // Fetch standings data from the specific table using configurable fetchRecords
        const records = await airtableService.fetchRecords('tblX7SVGLgZ59tiWB');
        
        // Process and sort the standings
        this.currentStandings = this.processStandingsData(records);
        this.standings = this.currentStandings;
      }
      
    } catch (error) {
      console.error('Error fetching standings:', error);
      this.error = 'Failed to load standings data. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  processStandingsData(records) {
    // Extract participant names and total points, then sort by points descending
    const standings = records
      .map(record => ({
        name: record.data.Name || record.data.Participant || 'Unknown',
        points: parseInt(record.data['Total Points'] || 0)
      }))
      .filter(participant => participant.name !== 'Unknown')
      .sort((a, b) => {
        // First sort by points in descending order
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        // If points are equal, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });

    return standings;
  }

  getRankDisplay(index) {
    const rank = index + 1;
    let medal = '';
    
    if (rank === 1) medal = '🥇';
    else if (rank === 2) medal = '🥈';
    else if (rank === 3) medal = '🥉';
    
    return { rank, medal };
  }

  getRankClass(index) {
    if (index === 0) return 'first';
    if (index === 1) return 'second';
    if (index === 2) return 'third';
    return '';
  }

  renderPicks(picks) {
    if (!picks) {
      return html`<span class="no-picks">No vote yet</span>`;
    }

    return html`
      <span class="pick-tag" title="Star Baker">⭐ ${picks.starBaker}</span>
      <span class="pick-tag" title="Technical Winner">🧁 ${picks.technical}</span>
      <span class="pick-tag" title="Eliminated">❌ ${picks.eliminated}</span>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="standings-container">
          <div class="standings-header">
            <h1 class="standings-title">${this.title}</h1>
            <p class="standings-subtitle">${this.description}</p>
          </div>
          <div class="glass-card">
            <gbbo-loading-container></gbbo-loading-container>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="standings-container">
          <div class="standings-header">
            <h1 class="standings-title">${this.title}</h1>
            <p class="standings-subtitle">${this.description}</p>
          </div>
          <div class="glass-card">
            <div class="error">${this.error}</div>
          </div>
        </div>
      `;
    }

    // Only the per-week and Finals toggles hand over picks alongside points -
    // the live season total and the archived years don't have a single set
    // of picks to show, so the column is left out entirely for those.
    const hasPicks = this.standings.some(participant => participant.picks);

    return html`
      <div class="standings-container">
        <div class="standings-header">
          <h1 class="standings-title">${this.title}</h1>
          <p class="standings-subtitle">${this.description}</p>
        </div>

        <div class="glass-card standings-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                ${hasPicks ? html`<th>Picks</th>` : ''}
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              ${this.standings.map((participant, index) => {
                const { rank, medal } = this.getRankDisplay(index);
                const rankClass = this.getRankClass(index);

                return html`
                  <tr>
                    <td class="rank ${rankClass}">
                      ${medal ? html`<span class="medal">${medal}</span>` : ''}
                      ${rank}
                    </td>
                    <td class="participant-name">${participant.name}</td>
                    ${hasPicks ? html`
                      <td class="picks-cell">${this.renderPicks(participant.picks)}</td>
                    ` : ''}
                    <td class="points">${participant.points}</td>
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-standings', GBBOStandings); 