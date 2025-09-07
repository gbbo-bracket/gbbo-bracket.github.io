import { LitElement, html, css } from 'lit';
import './gbbo-contestants-modal.js';

export class GBBOContestantsCard extends LitElement {
  static properties = {
    contestant: { type: Object },
    withDetailsModal: { type: Boolean },
    modalOpen: { type: Boolean },
    withResults: { type: Boolean }
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

    .contestants-card.eliminated {
      border: 1px solid var(--icing-pink);
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
    this.withDetailsModal = false;
    this.modalOpen = false;
    this.withResults = false;
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

  render() {
    return html`
      <div class="contestants-card ${this.withResults ? this.contestant['Eliminated'] ? 'eliminated' : '' : ''}" @click="${this.contestant ? this.openDetailsModal : null}">
        ${this.contestant?.Image?.[0]?.url ?
          html`<img class="contestants-image" src="${this.contestant.Image?.[0]?.url}" alt="${this.contestant.name}" />` :
          html`<div class="contestants-image"></div>`
        }
        <p class="contestants-name">${this.contestant?.name || 'Baker'}</p>
        ${this.withResults ? html`
          <div class="contestants-results">
            ${this.contestant['Star Baker'] ? html`
              <div>
                ${this.contestant['Star Baker'].map(() => html`
                  <span>⭐</span>
                `)}
              </div>
            ` : ''}
            ${this.contestant['Technical'] ? html`
              <div>
                ${this.contestant['Technical'].map(() => html`
                  <span>🧁</span>
                `)}
              </div>
            ` : ''}
            ${this.contestant['Eliminated'] ? html`
              <div>
                ${this.contestant['Eliminated'].map(() => html`
                  <span>❌</span>
                `)}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <gbbo-contestants-modal 
        .open="${this.modalOpen}"
        .contestant="${this.contestant}"
        @modal-close="${this.handleModalClose}"
      ></gbbo-contestants-modal>
    `;
  }
}

customElements.define('gbbo-contestants-card', GBBOContestantsCard); 