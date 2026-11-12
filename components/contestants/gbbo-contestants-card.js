import { LitElement, html, css } from 'lit';
import './gbbo-contestants-modal.js';

export class GBBOContestantsCard extends LitElement {
  static properties = {
    contestant: { type: Object },
    contestants: { type: Array },
    index: { type: Number },
    withDetailsModal: { type: Boolean },
    modalOpen: { type: Boolean },
    withResults: { type: Boolean },
    hideName: { type: Boolean }
  };

  static styles = css`
    .contestants-card {
      position: relative;
      width: 205px;
      height: 266px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(190, 228, 210, 0.1);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(169, 208, 245, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .contestants-card.eliminated::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--clotted-cream);
      opacity: 35%;
    }
    
    .contestants-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(247, 198, 217, 0.2);
    }

    .contestants-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .contestants-results {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      white-space: nowrap;
    }

    .results-separator {
      color: rgba(33, 65, 119, 0.35);
    }

    .contestants-name.struck {
      text-decoration: line-through;
    }

    .contestants-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.75rem;
      background-image: url('./images/gbbo-avatar.jpg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  `;

  constructor() {
    super();
    this.contestant = null;
    this.contestants = [];
    this.index = 0;
    this.withDetailsModal = false;
    this.modalOpen = false;
    this.withResults = false;
    this.hideName = false;
  }

  openDetailsModal() {
    if (this.contestant) {
      this.modalOpen = true;
    }
  }

  closeModal() {
    this.modalOpen = false;
  }

  handleModalClose() {
    this.closeModal();
  }

  // Stars and technicals share one row, e.g. "⭐⭐ | 🧁"
  renderResults() {
    const groups = [
      ['Star Baker', '⭐'],
      ['Technical', '🧁']
    ]
      .map(([field, emoji]) => (this.contestant[field] || []).map(() => emoji).join(''))
      .filter(Boolean);

    if (!groups.length) return '';

    return html`
      <div class="contestants-results">
        ${groups.map((group, i) => html`
          ${i > 0 ? html`<span class="results-separator" aria-hidden="true">|</span>` : ''}
          <span>${group}</span>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="contestants-card ${this.withResults ? this.contestant['Eliminated']?.length ? 'eliminated' : '' : ''}" @click="${this.contestant ? this.openDetailsModal : null}">
        ${this.contestant?.imageUrl ?
          html`<img class="contestants-image" src="${this.contestant.imageUrl}" alt="${this.contestant.name}" />` :
          html`<div class="contestants-image"></div>`
        }
        ${this.hideName ? '' : html`<p class="contestants-name ${this.withResults && this.contestant?.['Eliminated']?.length ? 'struck' : ''}">${this.contestant?.name || 'Baker'}</p>`}
        ${this.withResults ? this.renderResults() : ''}
      </div>

      <gbbo-contestants-modal 
        .open="${this.modalOpen}"
        .contestant="${this.contestant}"
        .contestants="${this.contestants}"
        .index="${this.index}"
        @modal-close="${this.handleModalClose}"
      ></gbbo-contestants-modal>
    `;
  }
}

customElements.define('gbbo-contestants-card', GBBOContestantsCard); 