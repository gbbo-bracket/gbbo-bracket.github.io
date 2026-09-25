import { LitElement, html, css } from 'lit';
import '../home/gbbo-standings.js';
import '../shared/gbbo-loading-container.js';
import { pastYears } from './static-data.js';
import { FINALS_WEEK_ID, fetchWeekStandings } from '../../js/utils/nominations.js';

// The current season. Update it (and the archive in static-data.js) once it ends.
const CURRENT_YEAR = '2026';

// The toggles: the current season's Finals picks, then the archived final
// standings from past seasons. `final` marks the season totals that get the
// podium medals and colours.
const STATIC_OPTIONS = {
  finals: { id: FINALS_WEEK_ID, label: 'Finals', title: `${CURRENT_YEAR} Finals Picks`, kind: 'week' },
  archive: Object.keys(pastYears).map(year => ({
    id: year,
    label: year,
    title: `${year} Final Results`,
    kind: 'archive',
    final: true,
    standings: pastYears[year]
  }))
};

/**
 * A row of toggles above the standings card that switches it between the
 * current season's Finals picks and the final standings from past seasons.
 */
export class GBBOStandingsPicker extends LitElement {
  static properties = {
    selected: { type: String },
    description: { type: String },
    weekStandingsCache: { type: Object }
  };

  constructor() {
    super();
    this.selected = STATIC_OPTIONS.finals.id;
    this.description = '';
    this.weekStandingsCache = {};
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

  connectedCallback() {
    super.connectedCallback();
    // Finals is selected by default, so load its picks straight away
    this.handleSelect(this.selected);
  }

  get options() {
    return [
      STATIC_OPTIONS.finals,
      ...STATIC_OPTIONS.archive
    ];
  }

  async handleSelect(id) {
    this.selected = id;

    const option = this.options.find(item => item.id === id);
    if (option?.kind === 'week' && !(id in this.weekStandingsCache)) {
      try {
        const standings = await fetchWeekStandings(id);
        this.weekStandingsCache = { ...this.weekStandingsCache, [id]: standings };
      } catch (error) {
        console.error(`Failed to load standings for ${option.label}:`, error);
        this.weekStandingsCache = { ...this.weekStandingsCache, [id]: [] };
      }
    }
  }

  // undefined means the Finals picks are still being fetched
  resolveStandings(option) {
    if (option.kind === 'archive') return option.standings;
    return this.weekStandingsCache[option.id];
  }

  render() {
    const option = this.options.find(item => item.id === this.selected) || STATIC_OPTIONS.finals;
    const standings = this.resolveStandings(option);

    return html`
      <div class="standings-toggles">
        ${this.options.map((item, index) => html`
          ${index > 0 ? html`<span class="separator" aria-hidden="true">|</span>` : ''}
          <button
            @click="${() => this.handleSelect(item.id)}"
            aria-current="${item.id === this.selected ? 'true' : 'false'}"
          >${item.label}</button>
        `)}
      </div>

      ${standings === undefined ? html`
        <gbbo-loading-container></gbbo-loading-container>
      ` : html`
        <gbbo-standings
          .standings="${standings}"
          title="${option.title}"
          ?final="${!!option.final}"
          description="${this.description}"
        ></gbbo-standings>
      `}
    `;
  }
}

customElements.define('gbbo-standings-picker', GBBOStandingsPicker);
