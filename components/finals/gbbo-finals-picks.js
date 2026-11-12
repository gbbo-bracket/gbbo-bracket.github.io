import { LitElement, html, css } from 'lit';
import { finalsPicks } from '../../js/data/finals-picks-data.js';
import { contestantImages } from '../../js/data/contestant-images.js';
import { contestantsData } from '../../js/data/contestants-data.js';

// Bakers who are out of the competition, so their photos can be faded with a ❌
const eliminatedBakers = new Set(
  contestantsData.filter(baker => baker.data['Is Eliminated?']).map(baker => baker.data.Name)
);

// Finals points a participant can still earn: 7 if their All-around Winner is
// still in, plus 3 for each other finalist who is still in
const WINNER_POINTS = 7;
const FINALIST_POINTS = 3;

function possiblePoints(person) {
  const winnerPoints = eliminatedBakers.has(person.winner) ? 0 : WINNER_POINTS;
  const finalistPoints = person.finalists.filter(name => !eliminatedBakers.has(name)).length * FINALIST_POINTS;
  return winnerPoints + finalistPoints;
}

// Only participants who submitted Finals picks get a card, in alphabetical order
const picksSubmitted = finalsPicks
  .filter(person => person.winner)
  .sort((a, b) => a.name.localeCompare(b.name));

// The three bakers picked most often to reach the Finals, counting every pick
// of them whether as the All-around Winner or as one of the other two finalists
const TOP_PICKS_COUNT = 3;

const topPicks = [...picksSubmitted
  .flatMap(person => [person.winner, ...person.finalists])
  .reduce((counts, name) => counts.set(name, (counts.get(name) || 0) + 1), new Map())]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, TOP_PICKS_COUNT);

/**
 * Everyone's Finals picks: a card per participant who submitted them, showing
 * their All-around Winner and the two other finalists they picked. The picks are static data (js/data/finals-picks-data.js).
 */
export class GBBOFinalsPicks extends LitElement {
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
      margin: 0 0 0.5rem;
    }

    h3 {
      font-family: 'Playfair Display', serif;
      color: var(--heading-text);
      font-size: 1.4rem;
      margin: 2rem 0 1rem;
    }

    .intro {
      color: var(--body-text);
      margin-bottom: .5rem;
      max-width: 36rem;
    }

    .favorites {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .favorites h3 {
      margin: 0;
    }

    /* On desktop the heading sits beside the favorites instead of above them */
    @media (min-width: 768px) {
      .favorites {
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;
      }
    }

    .tally {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tally-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 1rem 0.4rem 0.4rem;
      background: rgba(255, 253, 245, 0.9);
      border: 1px solid rgba(247, 198, 217, 0.5);
      border-radius: 999px;
      color: var(--body-text);
    }

    .tally-item strong {
      color: var(--royal-blue);
    }

    .tally-item .photo {
      width: 2.25rem;
      height: 2.25rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .person {
      position: relative;
      overflow: hidden;
      background: rgba(255, 253, 245, 0.9);
      border: 1px solid rgba(247, 198, 217, 0.3);
      border-radius: 1.25rem;
      box-shadow: 0 10px 25px -12px rgba(33, 65, 119, 0.15);
      padding: 1.25rem;
    }

    .person::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--berry-red), var(--icing-pink), var(--powder-blue));
    }

    .person-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      color: var(--heading-text);
      margin: 0;
      font-weight: 600;
    }

    .possible-points {
      margin: 0 0 0.75rem;
      font-size: 0.9rem;
      color: var(--earl-grey);
      font-style: italic;
    }

    .pick {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 0.75rem;
    }

    .pick + .pick {
      margin-top: 0.25rem;
    }

    .pick.winner {
      background: rgba(251, 232, 166, 0.55);
    }

    .pick-label {
      display: block;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--earl-grey);
    }

    .pick-name {
      font-weight: 600;
      color: var(--royal-blue);
      font-size: 1.1rem;
    }

    .photo {
      position: relative;
      flex: none;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      overflow: hidden;
      background: var(--powder-blue);
    }

    .photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pick.winner .photo {
      border: 2px solid var(--golden-brown);
    }

    /* Eliminated bakers fade out like on the Contestants page, with a ❌ on top */
    .photo.eliminated::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--clotted-cream);
      opacity: 35%;
    }

    .photo .out {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      line-height: 1;
    }

  `;

  renderPhoto(name) {
    const src = contestantImages[name];
    const eliminated = eliminatedBakers.has(name);
    return html`
      <span class="photo ${eliminated ? 'eliminated' : ''}">
        ${src ? html`<img src="${src}" alt="${name}" loading="lazy">` : ''}
        ${eliminated ? html`<span class="out" role="img" aria-label="Eliminated">❌</span>` : ''}
      </span>
    `;
  }

  renderPick(label, name, extraClass = '') {
    return html`
      <div class="pick ${extraClass}">
        ${this.renderPhoto(name)}
        <div>
          <span class="pick-label">${label}</span>
          <span class="pick-name">${name}</span>
        </div>
      </div>
    `;
  }

  renderPerson(person) {
    return html`
      <section class="person">
        <h4 class="person-name">${person.emoji} ${person.name}</h4>
        <p class="possible-points">Possible finals points: +${possiblePoints(person)}</p>
        ${this.renderPick('All-around Winner 👑', person.winner, 'winner')}
        ${person.finalists.map(name => this.renderPick('Finalist', name))}
      </section>
    `;
  }

  render() {
    return html`
      <h2>Finals</h2>
      <div class="favorites">
        <h3>League Favorites:</h3>
        <div class="tally">
          ${topPicks.map(([name, count]) => html`
            <div class="tally-item">
              ${this.renderPhoto(name)}
              <span><strong>${name}</strong> · ${count} ${count === 1 ? 'pick' : 'picks'}</span>
            </div>
          `)}
        </div>
      </div>

      <div class="grid">
        ${picksSubmitted.map(person => this.renderPerson(person))}
      </div>
    `;
  }
}

customElements.define('gbbo-finals-picks', GBBOFinalsPicks);
