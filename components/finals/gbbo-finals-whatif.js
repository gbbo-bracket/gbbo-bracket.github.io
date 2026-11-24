import { LitElement, html, css } from 'lit';
import { FINALS_WEEK_ID, fetchWeekStandings } from '../../js/utils/nominations.js';
import { contestantImages } from '../../js/data/contestant-images.js';
import { contestantsData } from '../../js/data/contestants-data.js';
import '../standings/gbbo-finals-standings.js';

// The bakers still in the competition are the three finalists
const finalists = contestantsData
  .filter(baker => !baker.data['Is Eliminated?'])
  .map(baker => baker.data.Name);

// End of Series Bonus (see the Rules page)
const WINNER_POINTS = 7;
const FINALIST_POINTS = 3;

// Points a participant's Finals picks earn if `winner` takes the crown: +7 for
// picking the winner, +3 for every other pick who makes the Finals
function finalsPoints(picks, winner) {
  if (!picks) return 0;
  const pickedWinner = picks.winner?.name === winner;
  const others = pickedWinner ? [picks.finalist1, picks.finalist2] : [picks.winner, picks.finalist1, picks.finalist2];
  const finalistPoints = others.filter(baker => baker && finalists.includes(baker.name)).length * FINALIST_POINTS;
  return (pickedWinner ? WINNER_POINTS : 0) + finalistPoints;
}

/**
 * Finals page: the Finals standings card with a "What happens if ... wins?"
 * picker above it. Choosing a finalist re-scores everyone's Finals picks as
 * if that baker won and the table re-ranks with an animation; choosing them
 * again goes back to the real standings.
 */
export class GBBOFinalsWhatIf extends LitElement {
  static properties = {
    standings: { type: Array },
    winner: { type: String },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.25rem;
      color: var(--heading-text);
      text-align: center;
      margin: 0 0 1.5rem;
    }

    .whatif {
      text-align: center;
      margin-bottom: 2rem;
    }

    .hint {
      color: var(--body-text);
      margin: 0 0 1rem;
      min-height: 1.5em;
    }

    .options {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 1.1rem 0.4rem 0.4rem;
      background: rgba(255, 253, 245, 0.9);
      border: 2px solid rgba(247, 198, 217, 0.5);
      border-radius: 999px;
      color: var(--royal-blue);
      font-family: inherit;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.2s ease, background-color 0.2s ease;
    }

    .option:hover {
      transform: translateY(-2px);
      border-color: var(--icing-pink);
    }

    .option:focus-visible {
      outline: 2px solid var(--royal-blue);
      outline-offset: 2px;
    }

    .option[aria-pressed='true'] {
      background: rgba(251, 232, 166, 0.8);
      border-color: var(--golden-brown);
    }

    .photo {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      overflow: hidden;
      background: var(--powder-blue);
      flex: none;
    }

    .photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .error {
      text-align: center;
      color: var(--berry-red);
    }
  `;

  constructor() {
    super();
    this.standings = null;
    this.baseStandings = null;
    this.realStandings = null;
    this.winner = '';
    this.error = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      const standings = await fetchWeekStandings(FINALS_WEEK_ID);
      // Totals already include any Finals points that have been scored, so
      // take those back out; every scenario then adds its own
      this.baseStandings = standings.map(person => ({ ...person, total: (person.total ?? 0) - person.points }));
      this.realStandings = standings;
      this.standings = standings;
    } catch (error) {
      console.error('Failed to load Finals standings:', error);
      this.error = 'Could not load the standings. Please try again later.';
    }
  }

  select(name) {
    this.winner = this.winner === name ? '' : name;
    this.standings = this.winner ? this.scenario(this.winner) : this.realStandings;
  }

  scenario(winner) {
    return this.baseStandings
      .map(person => {
        const points = finalsPoints(person.picks, winner);
        return { ...person, points, total: person.total + points };
      })
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }

  render() {
    return html`
      <h2>Finals</h2>
      <div class="whatif">
        <p class="hint">Pick a finalist to see how the standings change if they win...</p>
        <div class="options">
          ${finalists.map(name => html`
            <button type="button" class="option" aria-pressed="${this.winner === name}" @click="${() => this.select(name)}">
              <span class="photo">${contestantImages[name] ? html`<img src="${contestantImages[name]}" alt="">` : ''}</span>
              ${name}${this.winner === name ? ' 🏆' : ''}
            </button>
          `)}
        </div>
      </div>

      ${this.error ? html`<p class="error">${this.error}</p>` : html`
        <gbbo-finals-standings
          .standings="${this.standings}"
          .baselineOrder="${(this.realStandings || []).map(person => person.name)}"
        ></gbbo-finals-standings>
      `}
    `;
  }
}

customElements.define('gbbo-finals-whatif', GBBOFinalsWhatIf);
