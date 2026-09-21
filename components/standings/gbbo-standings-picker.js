import { LitElement, html, css } from 'lit';
import '../home/gbbo-standings.js';
import { pastYears } from './static-data.js';

// The label for the live standings. Update it as the season goes on.
const CURRENT_LABEL = 'Week 1';

// The toggles, in the order they appear. `standings: null` means "fetch the
// live standings from Airtable"; the past seasons pass their static data.
const STANDINGS_OPTIONS = [
  { id: 'current', label: CURRENT_LABEL, title: 'Current Standings', standings: null },
  { id: '2025', label: '2025', title: '2025 Final Results', standings: pastYears[2025] },
  { id: '2024', label: '2024', title: '2024 Final Results', standings: pastYears[2024] }
];

/**
 * A row of toggles above the standings card that switches it between the live
 * standings and the final standings from past seasons.
 */
export class GBBOStandingsPicker extends LitElement {
  static properties = {
    selected: { type: String },
    description: { type: String }
  };

  constructor() {
    super();
    this.selected = STANDINGS_OPTIONS[0].id;
    this.description = '';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .standings-toggles {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 2rem;
    }

    button {
      background: none;
      border: none;
      border-radius: 0.5rem;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 1.1rem;
      font-weight: 400;
      color: var(--body-text);
      transition: color 0.2s ease;
    }

    button:hover {
      color: var(--link-text-on-hover);
    }

    button:focus-visible {
      outline: 2px solid var(--royal-blue);
      outline-offset: 2px;
    }

    button[aria-current='true'] {
      font-weight: 700;
      color: var(--royal-blue);
    }

    .separator {
      color: rgba(33, 65, 119, 0.35);
    }

    @media (max-width: 640px) {
      .standings-toggles {
        margin-bottom: 1.5rem;
      }

      button {
        font-size: 1rem;
        padding: 0.35rem 0.5rem;
      }
    }
  `;

  handleSelect(id) {
    this.selected = id;
  }

  render() {
    const option = STANDINGS_OPTIONS.find(item => item.id === this.selected) || STANDINGS_OPTIONS[0];

    return html`
      <div class="standings-toggles">
        ${STANDINGS_OPTIONS.map((item, index) => html`
          ${index > 0 ? html`<span class="separator" aria-hidden="true">|</span>` : ''}
          <button
            @click="${() => this.handleSelect(item.id)}"
            aria-current="${item.id === this.selected ? 'true' : 'false'}"
          >${item.label}</button>
        `)}
      </div>

      <gbbo-standings
        .standings="${option.standings}"
        title="${option.title}"
        description="${this.description}"
      ></gbbo-standings>
    `;
  }
}

customElements.define('gbbo-standings-picker', GBBOStandingsPicker);
