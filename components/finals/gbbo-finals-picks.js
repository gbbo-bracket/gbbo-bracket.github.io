import { LitElement, html, css } from 'lit';
import { finalsPicks } from '../../js/data/finals-picks-data.js';
import { contestantImages } from '../../js/data/contestant-images.js';
import { contestantsData } from '../../js/data/contestants-data.js';

// Bakers who are out of the competition, so their photos can be faded with a ❌
const eliminatedBakers = new Set(
  contestantsData.filter(baker => baker.data['Is Eliminated?']).map(baker => baker.data.Name)
);

// Only participants who submitted Finals picks get a card
const picksSubmitted = finalsPicks.filter(person => person.winner);

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
      margin: 0 0 0.75rem;
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
        ${this.renderPick('All-around Winner 👑', person.winner, 'winner')}
        ${person.finalists.map(name => this.renderPick('Finalist', name))}
      </section>
    `;
  }

  render() {
    return html`
      <h2>Finals</h2>
      <div class="grid">
        ${picksSubmitted.map(person => this.renderPerson(person))}
      </div>
    `;
  }
}

customElements.define('gbbo-finals-picks', GBBOFinalsPicks);
