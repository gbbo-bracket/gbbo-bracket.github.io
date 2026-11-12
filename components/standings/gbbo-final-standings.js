import { css, html } from 'lit';
import { GBBOStandingsTable } from './gbbo-standings-table.js';
import { fetchNames, fetchTotalPoints } from '../../js/utils/participants.js';

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
    this.loadingCurrent = false;
  }

  willUpdate(changedProperties) {
    // The picker swaps the standings whenever a toggle is clicked, so react to
    // every change rather than only reading the value once on connect.
    if (changedProperties.has('standings') && !Array.isArray(this.standings)) {
      if (this.currentStandings) {
        // Fetched once and remembered so switching back is instant
        this.standings = this.currentStandings;
      } else {
        this.loadCurrentStandings();
      }
    }

    if (this.standings) this.loading = false;
  }

  // The current season's running totals are fetched live from Airtable; the
  // participant names come from the static roster
  async loadCurrentStandings() {
    if (this.loadingCurrent) return;
    this.loadingCurrent = true;
    this.loading = true;
    this.error = null;

    try {
      const [participants, totals] = await Promise.all([fetchNames(), fetchTotalPoints()]);
      this.currentStandings = participants
        .map(participant => ({ name: participant.name, points: totals.get(participant.id) || 0 }))
        .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
      this.standings = this.currentStandings;
    } catch (error) {
      console.error('Failed to load standings:', error);
      this.error = error.message;
      this.loading = false;
    } finally {
      this.loadingCurrent = false;
    }
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
