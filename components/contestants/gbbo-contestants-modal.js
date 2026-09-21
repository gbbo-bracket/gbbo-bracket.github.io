import { LitElement, html, css } from 'lit';

export class GBBOContestantsModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    contestant: { type: Object },
    contestants: { type: Array },
    index: { type: Number },
    activeIndex: { type: Number }
  };

  constructor() {
    super();
    this.open = false;
    this.contestant = null;
    this.contestants = [];
    this.index = 0;
    this.activeIndex = 0;
  }

  static styles = css`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background-color: var(--canvas);
      border-radius: 1rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.25);
      transform: scale(0.95) translateY(20px);
      transition: transform 0.3s ease;
    }

    .modal-overlay.open .modal-content {
      transform: scale(1) translateY(0);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 1px solid rgba(247, 198, 217, 0.3);
      /* Keep the browsing arrows in reach however long the bio is */
      position: sticky;
      top: 0;
      background-color: var(--canvas);
      z-index: 1;
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .modal-contestant-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(169, 208, 245, 0.4);
    }

    .modal-contestant-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--heading-text);
      margin: 0;
    }

    .modal-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .modal-position {
      font-size: 0.8125rem;
      color: var(--body-text);
      white-space: nowrap;
    }

    .modal-nav-button {
      background: none;
      border: none;
      font-size: 1.75rem;
      line-height: 1;
      color: var(--body-text);
      cursor: pointer;
      padding: 0 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .modal-nav-button:hover {
      background-color: rgba(190, 228, 210, 0.35);
      color: var(--heading-text);
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
      padding: 2rem;
    }

    .modal-bio-label-container {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }

    .modal-bio {
      color: var(--body-text);
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      text-align: left;
    }

    .modal-bio-label {
      font-weight: 600;
      color: var(--heading-text);
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 1rem;
      }

      .modal-header {
        padding: 1.5rem 1.5rem 1rem 1.5rem;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .modal-contestant-name {
        font-size: 1.25rem;
      }

      .modal-contestant-image {
        width: 48px;
        height: 48px;
      }

      .modal-position {
        display: none;
      }
    }
  `;

  get contestantList() {
    if (this.contestants?.length) return this.contestants;
    return this.contestant ? [this.contestant] : [];
  }

  get activeContestant() {
    return this.contestantList[this.activeIndex] || this.contestant;
  }

  get canBrowse() {
    return this.contestantList.length > 1;
  }

  willUpdate(changedProperties) {
    // Start browsing from the contestant whose card was clicked
    if (changedProperties.has('open') && this.open) {
      this.activeIndex = this.index;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      if (this.open) {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        // Add global keydown listener for Escape key
        document.addEventListener('keydown', this.handleKeyDown);
      } else {
        // Restore body scroll
        document.body.style.overflow = '';
        // Remove keydown listener
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up event listener and restore body scroll
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
  }

  handleKeyDown = (e) => {
    if (!this.open) return;

    // Close modal on Escape key
    if (e.key === 'Escape') {
      this.closeModal();
      return;
    }

    // Browse between contestants with the left and right arrow keys
    if (e.key === 'ArrowLeft') {
      this.browse(-1);
    } else if (e.key === 'ArrowRight') {
      this.browse(1);
    }
  };

  browse(step) {
    const total = this.contestantList.length;
    if (total < 2) return;

    // Wrap around so browsing never dead-ends
    this.activeIndex = (this.activeIndex + step + total) % total;
    // Show the next contestant from the top, however far the last one was scrolled
    this.renderRoot.querySelector('.modal-content')?.scrollTo({ top: 0 });
  }

  handlePreviousClick() {
    this.browse(-1);
  }

  handleNextClick() {
    this.browse(1);
  }

  handleOverlayClick(e) {
    // Close modal if clicking on the overlay (not the content)
    if (e.target === e.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('modal-close', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const contestant = this.activeContestant;
    if (!contestant) return '';

    return html`
      <div 
        class="modal-overlay ${this.open ? 'open' : ''}" 
        @click="${this.handleOverlayClick}"
      >
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              <img 
                class="modal-contestant-image" 
                src="${contestant.Image?.[0]?.url || ''}" 
                alt="${contestant.name || 'Contestant'}"
              />
              <h2 class="modal-contestant-name">${contestant.name || 'Unknown Contestant'}</h2>
            </div>
            <div class="modal-actions">
              ${this.canBrowse ? html`
                <button 
                  class="modal-nav-button" 
                  @click="${this.handlePreviousClick}"
                  aria-label="Previous contestant"
                >
                  &lsaquo;
                </button>
                <span class="modal-position">
                  ${this.activeIndex + 1} of ${this.contestantList.length}
                </span>
                <button 
                  class="modal-nav-button" 
                  @click="${this.handleNextClick}"
                  aria-label="Next contestant"
                >
                  &rsaquo;
                </button>
              ` : ''}
              <button 
                class="modal-close-button" 
                @click="${this.closeModal}"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="modal-body">
            <div class="modal-bio-label-container">
              <span class="modal-bio-label">Age:</span>
              <p class="modal-bio">
                ${contestant.Age || 'Unknown Age'}
              </p>
            </div>
            <div class="modal-bio-label-container">
            <span class="modal-bio-label">Location:</span>
            <p class="modal-bio">
              ${contestant.Location || 'Unknown Location'}
            </p>
            </div>
            <div class="modal-bio-label-container">
            <span class="modal-bio-label">Occupation:</span>
            <p class="modal-bio">
              ${contestant.Occupation || 'Unknown Occupation'}
            </p>
            </div>

            <p class="modal-bio">
              <span class="modal-bio-label">Bio:</span> ${contestant.Bio || 'No bio available for this contestant.'}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-contestants-modal', GBBOContestantsModal); 