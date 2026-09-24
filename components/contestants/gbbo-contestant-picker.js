import { LitElement, html, css } from 'lit';

const EMPTY_AVATAR_EMOJI = '🧁';

/**
 * A compact, row-oriented picker for choosing one baker from a list: a small
 * portrait and name that can be stepped through with arrows, or tapped to open
 * a pop-up list of every baker to jump straight to one. Unlike gbbo-contestants-card
 * (which shows a bio on click), this never shows bios - it only exists to pick
 * a baker for something like a vote.
 */
export class GBBOContestantPicker extends LitElement {
  static properties = {
    contestants: { type: Array },
    selected: { type: Object },
    label: { type: String },
    disabled: { type: Boolean },
    modalOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.contestants = [];
    this.selected = null;
    this.label = 'Baker';
    this.disabled = false;
    this.modalOpen = false;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .picker-row {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .step-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--body-text);
      cursor: pointer;
      padding: 0.5rem 0.25rem;
      border-radius: 0.25rem;
      flex-shrink: 0;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .step-button:hover:not(:disabled) {
      background-color: rgba(190, 228, 210, 0.35);
      color: var(--heading-text);
    }

    .step-button:disabled {
      color: rgba(124, 116, 103, 0.35);
      cursor: not-allowed;
    }

    .picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
      background-color: rgba(190, 228, 210, 0.1);
      border: 1px solid rgba(169, 208, 245, 0.3);
      border-radius: 0.75rem;
      padding: 1rem;
      cursor: pointer;
      font-family: inherit;
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .picker:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(247, 198, 217, 0.2);
    }

    .picker:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .picker-image {
      width: 150px;
      height: 150px;
      border-radius: 0.5rem;
      object-fit: cover;
      flex-shrink: 0;
      background-color: rgba(255, 253, 245, 0.9);
      background-image: url('./images/gbbo-avatar.jpg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    .picker-image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }

    .picker-name {
      font-weight: 600;
      color: var(--body-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* A <dialog> renders in the browser's top layer, so it always covers the
       whole viewport - unlike position:fixed, which a backdrop-filter ancestor
       would otherwise trap inside its own box. */
    dialog.modal {
      padding: 0;
      border: none;
      border-radius: 1rem;
      max-width: 420px;
      width: 90%;
      max-height: 80vh;
      background-color: var(--canvas);
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.25);
    }

    dialog.modal::backdrop {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-content {
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid rgba(247, 198, 217, 0.3);
      position: sticky;
      top: 0;
      background-color: var(--canvas);
    }

    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--heading-text);
      margin: 0;
    }

    .modal-close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--body-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .modal-close-button:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--berry-red);
    }

    .modal-body {
      padding: 0.75rem;
    }

    .contestant-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .contestant-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      background: none;
      border: none;
      text-align: left;
      padding: 0.5rem 0.75rem;
      font-family: inherit;
      font-size: 1rem;
      color: var(--body-text);
      cursor: pointer;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .contestant-button:hover {
      background-color: rgba(190, 228, 210, 0.35);
    }

    .contestant-button.selected {
      background-color: rgba(169, 208, 245, 0.35);
      color: var(--heading-text);
      font-weight: 600;
    }

    .contestant-list-image {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      object-fit: cover;
      flex-shrink: 0;
      background-color: rgba(255, 253, 245, 0.9);
      background-image: url('./images/gbbo-avatar.jpg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    .contestant-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .contestant-check {
      color: var(--royal-blue);
      flex-shrink: 0;
    }
  `;

  get dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  // Clicking the backdrop lands on the dialog itself (not .modal-content), since
  // the dialog element's own box is what the top layer renders full-screen behind
  handleDialogClick(e) {
    if (e.target === e.currentTarget) this.closeModal();
  }

  openModal() {
    if (this.disabled || this.contestants.length === 0) return;
    this.modalOpen = true;
    this.dialog?.showModal();
  }

  closeModal() {
    this.modalOpen = false;
    this.dialog?.close();
  }

  selectContestant(contestant) {
    this.dispatchEvent(new CustomEvent('contestant-change', { detail: { contestant }, bubbles: true, composed: true }));
    this.closeModal();
  }

  step(direction) {
    const total = this.contestants.length;
    if (total === 0) return;

    const currentIndex = this.selected ? this.contestants.findIndex(c => c.id === this.selected.id) : -1;
    const nextIndex = currentIndex === -1
      ? (direction > 0 ? 0 : total - 1)
      : (currentIndex + direction + total) % total;

    this.selectContestant(this.contestants[nextIndex]);
  }

  render() {
    const noContestants = this.contestants.length === 0;
    const imageUrl = this.selected?.Image?.[0]?.url;

    return html`
      <div class="picker-row">
        <button
          type="button"
          class="step-button"
          ?disabled="${this.disabled || noContestants}"
          aria-label="Previous ${this.label}"
          @click="${() => this.step(-1)}"
        >
          &lsaquo;
        </button>

        <button
          type="button"
          class="picker"
          ?disabled="${this.disabled || noContestants}"
          aria-haspopup="dialog"
          aria-label="Choose ${this.label}: currently ${this.selected?.name || 'none selected'}"
          @click="${this.openModal}"
        >
          ${imageUrl
            ? html`<img class="picker-image" src="${imageUrl}" alt="" />`
            : html`<span class="picker-image picker-image-placeholder">${EMPTY_AVATAR_EMOJI}</span>`}
          <span class="picker-name">${this.selected?.name || 'Select baker...'}</span>
        </button>

        <button
          type="button"
          class="step-button"
          ?disabled="${this.disabled || noContestants}"
          aria-label="Next ${this.label}"
          @click="${() => this.step(1)}"
        >
          &rsaquo;
        </button>
      </div>

      <dialog class="modal" aria-label="Select ${this.label}" @click="${this.handleDialogClick}" @close="${() => { this.modalOpen = false; }}">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Select ${this.label}</h2>
            <button class="modal-close-button" @click="${this.closeModal}" aria-label="Close">✕</button>
          </div>
          <div class="modal-body">
            <ul class="contestant-list">
              ${this.contestants.map(contestant => html`
                <li>
                  <button
                    class="contestant-button ${this.selected?.id === contestant.id ? 'selected' : ''}"
                    @click="${() => this.selectContestant(contestant)}"
                  >
                    ${contestant.Image?.[0]?.url
                      ? html`<img class="contestant-list-image" src="${contestant.Image[0].url}" alt="" />`
                      : html`<span class="contestant-list-image picker-image-placeholder">${EMPTY_AVATAR_EMOJI}</span>`}
                    <span class="contestant-name">${contestant.name}</span>
                    ${this.selected?.id === contestant.id ? html`<span class="contestant-check">✓</span>` : ''}
                  </button>
                </li>
              `)}
            </ul>
          </div>
        </div>
      </dialog>
    `;
  }
}

customElements.define('gbbo-contestant-picker', GBBOContestantPicker);
