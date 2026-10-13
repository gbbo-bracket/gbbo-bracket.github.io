import { css, html } from 'lit';
import { GBBOStandingsTable } from './gbbo-standings-table.js';
import { participantsData } from '../../js/data/participants-data.js';

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_CLASSES = ['first', 'second', 'third'];

/**
 * Season standings: rank, participant and total points. Hand it a past
 * season's results with `.standings`, or leave `.standings` empty to show the
 * current season's running totals. Medals and the gold/silver/bronze rank
 * colors only appear when `final` is set, since only a finished season has
 * final results.
 */
export class GBBOFinalStandings extends GBBOStandingsTable {
  static properties = {
    ...GBBOStandingsTable.properties,
    final: { type: Boolean }
  };

  static styles = [
    GBBOStandingsTable.styles,
    css`
      .rank.first {
        color: var(--golden-brown);
      }

      .rank.second {
        color: var(--powder-blue);
      }

      .rank.third {
        color: var(--berry-red);
      }

      .medal {
        margin-right: 0.5rem;
      }
    `
  ];

  constructor() {
    super();
    this.final = false;
    this.currentStandings = null;
  }

  willUpdate(changedProperties) {
    // The picker swaps the standings whenever a toggle is clicked, so react to
    // every change rather than only reading the value once on connect.
    if (changedProperties.has('standings') && !Array.isArray(this.standings)) {
      // Computed once and remembered so switching back is instant
      this.currentStandings ??= this.processStandingsData(participantsData);
      this.standings = this.currentStandings;
    }

    if (this.standings) this.loading = false;
  }

  processStandingsData(records) {
    // Extract participant names and total points, then sort by points descending
    return records
      .map(record => ({
        name: record.data.Name || record.data.Participant || 'Unknown',
        points: parseInt(record.data['Total Points'] || 0)
      }))
      .filter(participant => participant.name !== 'Unknown')
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  }

  get columns() {
    return [
      {
        label: 'Rank',
        className: 'rank',
        cellClass: (participant, index) => this.final ? (RANK_CLASSES[index] || '') : '',
        render: (participant, index) => html`${this.final && MEDALS[index]
          ? html`<span class="medal">${MEDALS[index]}</span>` : ''}${index + 1}`
      },
      { label: 'Participant', className: 'participant-name', render: participant => participant.name },
      { label: 'Total Points', className: 'points', render: participant => participant.points }
    ];
  }
}

customElements.define('gbbo-final-standings', GBBOFinalStandings);
