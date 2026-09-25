import { LitElement, html, css } from 'lit';
import '../home/gbbo-standings.js';
import '../shared/gbbo-loading-container.js';
import { pastYears } from './static-data.js';
import airtableService from '../../js/airtable-service.js';
import { REGION_CHANGE_EVENT, getRegion, getAirDate, parseAirDate } from '../../js/utils/region.js';
import { FINALS_WEEK_ID, fetchWeekStandings } from '../../js/utils/nominations.js';

// The current season. Update it (and the archive in static-data.js) once it ends.
const CURRENT_YEAR = '2026';

const BAKER_RESULTS_TABLE_ID = 'tblCV1RozeH3oz1DW';

// The toggles that never change: the current season's Finals picks and the
// archived final standings from past seasons. Weeks are worked out at runtime
// from air dates and go in front of them. `final` marks the season totals that
// get the podium medals and colours.
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

// "Week 2: Biscuit Week" -> "Week 2", so the toggle stays short
function shortWeekLabel(title) {
  const match = /^Week\s+\d+/i.exec(title || '');
  return match ? match[0] : (title || 'Week');
}

// Nobody voted in Week 1, so it has no standings worth a toggle
const HIDDEN_WEEK_LABELS = ['Week 1'];

/**
 * A row of toggles above the standings card that switches it between the
 * current season's already-aired weeks (plus whichever week is up next, and
 * leaving out Week 1), Finals, and the final standings from past seasons.
 */
export class GBBOStandingsPicker extends LitElement {
  static properties = {
    selected: { type: String },
    description: { type: String },
    weekOptions: { type: Array },
    weekStandingsCache: { type: Object }
  };

  constructor() {
    super();
    this.selected = STATIC_OPTIONS.finals.id;
    this.description = '';
    this.weekOptions = [];
    this.weekStandingsCache = {};
    this.region = getRegion();
    this.handleRegionChange = this.handleRegionChange.bind(this);
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
    window.addEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
    this.loadWeekOptions();
    // Finals is selected until the weeks load, so start fetching its picks now
    this.handleSelect(this.selected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
  }

  handleRegionChange(event) {
    this.region = event.detail.region;
    this.loadWeekOptions();
  }

  // Weeks that have already aired, plus whichever week airs next - in the
  // visitor's region, since the UK and US see different episodes air first.
  async loadWeekOptions() {
    try {
      const records = await airtableService.fetchRecords(BAKER_RESULTS_TABLE_ID);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weeksWithDates = records
        .filter(record => record.id !== FINALS_WEEK_ID)
        .map(record => ({
          ...record,
          parsedAirDate: parseAirDate(getAirDate(record.data, this.region))
        }))
        .filter(record => !isNaN(record.parsedAirDate));

      const pastWeeks = weeksWithDates.filter(record => record.parsedAirDate < today);
      const nextWeek = weeksWithDates
        .filter(record => record.parsedAirDate >= today)
        .sort((a, b) => a.parsedAirDate - b.parsedAirDate)[0];

      const relevantWeeks = nextWeek ? [...pastWeeks, nextWeek] : pastWeeks;
      relevantWeeks.sort((a, b) => b.parsedAirDate - a.parsedAirDate);

      this.weekOptions = relevantWeeks
        .map(record => {
          const label = shortWeekLabel(record.data.Title);
          return { id: record.id, label, title: `${label} Standings`, kind: 'week' };
        })
        .filter(option => !HIDDEN_WEEK_LABELS.includes(option.label));

      // The previously selected week may no longer be on offer after a region switch
      if (!this.options.some(option => option.id === this.selected)) {
        this.handleSelect(STATIC_OPTIONS.finals.id);
      }
    } catch (error) {
      console.error('Failed to load standings week options:', error);
    }
  }

  get options() {
    return [
      ...this.weekOptions,
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

  // undefined means a week's standings are still being fetched
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
