import { css, html } from 'lit';
import { GBBOStandingsTable } from './gbbo-standings-table.js';
import '../contestants/gbbo-contestants-modal.js';

// The three picks shown per participant, and how to label/icon each one -
// matches the icons already used on the Contestants page
const PICK_FIELDS = [
  { key: 'starBaker', icon: '⭐', label: 'Star Baker' },
  { key: 'technical', icon: '🧁', label: 'Technical Winner' },
  { key: 'eliminated', icon: '❌', label: 'Eliminated' }
];

/**
 * One week's results, ranked by each participant's overall total up to that
 * week: the participant, their Star Baker / Technical / Eliminated picks, the
 * points they scored that week as "+N", and the overall total last. Each participant is
 * { name, points, total, picks } (see fetchWeekStandings).
 */
export class GBBOWeeklyStandings extends GBBOStandingsTable {
  static properties = {
    ...GBBOStandingsTable.properties,
    modalContestant: { type: Object },
    modalOpen: { type: Boolean }
  };

  static styles = [
    GBBOStandingsTable.styles,
    css`
      /* .picks-wrap stays inside a plain table-cell (no display override on
         the <td>) so it matches the row height and vertical-centering every
         other <td> gets - giving the cell display:flex directly used to pull
         it out of table layout, leaving it a couple of pixels shorter. */
      .picks-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
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
        font-family: inherit;
        color: var(--body-text);
        white-space: nowrap;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }

      .pick-tag:hover,
      .pick-tag:focus-visible {
        background-color: rgba(169, 208, 245, 0.3);
        border-color: rgba(169, 208, 245, 0.6);
      }

      .pick-tag:focus-visible {
        outline: 2px solid var(--royal-blue);
        outline-offset: 2px;
      }

      .pick-tag:disabled {
        cursor: default;
        opacity: 0.6;
      }

      .no-picks {
        font-size: 0.85rem;
        color: var(--body-text);
        opacity: 0.6;
        font-style: italic;
      }

      /* The overall total in the last column, in blue */
      .total {
        color: var(--royal-blue);
      }

      @media (max-width: 640px) {
        /* The week's points are plain body text on phones, so the overall
           total beside them is the one that stands out */
        .week {
          font-weight: 400;
          font-size: 0.9rem;
          color: var(--body-text);
        }

        /* The two points cells sit side by side at the end of the name's
           line, so only the first needs to push right */
        .points ~ .points {
          margin-left: 0;
        }
      }

      /* On phones the picks wrap onto their own line below the card's row */
      @media (max-width: 640px) {
        .picks-cell {
          order: 4;
          flex-basis: 100%;
        }
      }
    `
  ];

  constructor() {
    super();
    this.modalContestant = null;
    this.modalOpen = false;
  }

  willUpdate() {
    if (Array.isArray(this.standings)) this.loading = false;
  }

  // Opens the same baker detail modal the Contestants page uses. No
  // .contestants list is handed over, so the modal has nothing to browse
  // between and leaves out its previous/next arrows.
  openBakerModal(baker) {
    if (!baker) return;
    this.modalContestant = baker;
    this.modalOpen = true;
  }

  closeBakerModal() {
    this.modalOpen = false;
  }

  renderPicks(picks) {
    if (!picks) {
      return html`<span class="no-picks">No vote yet</span>`;
    }

    return PICK_FIELDS.map(field => {
      const baker = picks[field.key];
      return html`
        <button
          type="button"
          class="pick-tag"
          title="${field.label}"
          ?disabled="${!baker}"
          @click="${() => this.openBakerModal(baker)}"
        >${field.icon} ${baker?.name || 'Unknown'}</button>
      `;
    });
  }

  get columns() {
    // The picks column is left out when nobody has any to show
    const hasPicks = this.standings.some(participant => participant.picks);

    // Some weeks have no overall total saved (see sync-static-data.js), so
    // those rows show a dash there
    return [
      { label: 'Participant', className: 'participant-name', render: participant => participant.name },
      ...(hasPicks ? [{
        label: 'Picks',
        className: 'picks-cell',
        render: participant => html`<div class="picks-wrap">${this.renderPicks(participant.picks)}</div>`
      }] : []),
      {
        label: 'This Week',
        className: 'points',
        cellClass: () => 'week',
        render: participant => participant.points === 0
          ? html`-`
          : `+${participant.points}`
      },
      {
        label: 'Total Points',
        className: 'points',
        cellClass: () => 'total',
        render: participant => participant.total ?? '–'
      }
    ];
  }

  renderExtras() {
    return html`
      <gbbo-contestants-modal
        .open="${this.modalOpen}"
        .contestant="${this.modalContestant}"
        @modal-close="${this.closeBakerModal}"
      ></gbbo-contestants-modal>
    `;
  }
}

customElements.define('gbbo-weekly-standings', GBBOWeeklyStandings);
