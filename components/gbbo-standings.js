import { LitElement, html, css } from 'lit';
import './gbbo-loading-container.js';
import { airtableService } from '../js/airtable-service.js';

export class GBBOStandings extends LitElement {
  static properties = {
    standings: { type: Array },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.standings = [];
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

    @media (max-width: 640px) {
      th, td {
        padding: 0.75rem 0.5rem;
        font-size: 0.9rem;
      }

      .standings-title {
        font-size: 1.75rem;
      }

      .participant-name {
        font-size: 1rem;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchStandings();
  }

  async fetchStandings() {
    try {
      this.loading = true;
      this.error = null;
      
      // Fetch standings data from the specific table using configurable fetchRecords
      const records = await airtableService.fetchRecords('tblX7SVGLgZ59tiWB');
      
      // Process and sort the standings
      this.standings = this.processStandingsData(records);
      
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
      .sort((a, b) => b.points - a.points);

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

  render() {
    if (this.loading) {
      return html`
        <div class="standings-container">
          <div class="standings-header">
            <h1 class="standings-title">Standings</h1>
            <p class="standings-subtitle">Current bracket leaderboard</p>
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
            <h1 class="standings-title">Standings</h1>
            <p class="standings-subtitle">Current bracket leaderboard</p>
          </div>
          <div class="glass-card">
            <div class="error">${this.error}</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="standings-container">
        <div class="standings-header">
          <h1 class="standings-title">Standings</h1>
          <p class="standings-subtitle">Current bracket leaderboard</p>
        </div>
        
        <div class="glass-card standings-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
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