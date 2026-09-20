import { LitElement, html, css, svg } from 'lit';
import { UK, US, REGION_CHANGE_EVENT, getRegion, toggleRegion } from '../../js/utils/region.js';

/**
 * A flag button in the nav bar that switches between the UK and US schedules.
 * It shows the flag of the region you are currently viewing; clicking it swaps
 * to the other one.
 */
export class GBBORegionToggle extends LitElement {
  static properties = {
    region: { type: String }
  };

  constructor() {
    super();
    this.region = getRegion();
    this.handleRegionChange = this.handleRegionChange.bind(this);
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid rgba(247, 198, 217, 0.6);
      border-radius: 2rem;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--link-text);
      transition: all 0.2s ease;
    }

    button:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--link-text-on-hover);
      transform: translateY(-1px);
    }

    button:focus-visible {
      outline: 2px solid var(--royal-blue);
      outline-offset: 2px;
    }

    .flag {
      display: block;
      width: 1.5rem;
      height: 0.75rem;
      border-radius: 2px;
      box-shadow: 0 0 0 1px rgba(33, 65, 119, 0.15);
    }

    @media (max-width: 768px) {
      button {
        padding: 0.3rem 0.5rem;
        gap: 0.35rem;
        font-size: 0.75rem;
      }

      .flag {
        width: 1.25rem;
        height: 0.625rem;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
  }

  handleRegionChange(event) {
    this.region = event.detail.region;
  }

  handleClick() {
    this.region = toggleRegion();
  }

  renderUKFlag() {
    return svg`
      <svg class="flag" viewBox="0 0 60 30" role="presentation" aria-hidden="true">
        <clipPath id="uk-diagonals">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" stroke-width="4" clip-path="url(#uk-diagonals)" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
      </svg>
    `;
  }

  renderUSFlag() {
    const stripeHeight = 30 / 13;
    const stripes = [0, 2, 4, 6, 8, 10, 12].map(index => svg`
      <rect y="${index * stripeHeight}" width="60" height="${stripeHeight}" fill="#b31942" />
    `);
    const stars = [0, 1, 2, 3].flatMap(row => [0, 1, 2, 3, 4].map(column => svg`
      <circle cx="${2.4 + column * 4.8}" cy="${2 + row * 4}" r="1" fill="#ffffff" />
    `));

    return svg`
      <svg class="flag" viewBox="0 0 60 30" role="presentation" aria-hidden="true">
        <rect width="60" height="30" fill="#ffffff" />
        ${stripes}
        <rect width="24" height="${stripeHeight * 7}" fill="#0a3161" />
        ${stars}
      </svg>
    `;
  }

  render() {
    const showingUK = this.region === UK;
    const otherRegion = showingUK ? US : UK;

    return html`
      <button
        @click="${this.handleClick}"
        title="Showing ${this.region} air dates. Switch to ${otherRegion}."
        aria-label="Showing ${this.region} air dates. Switch to ${otherRegion} air dates."
      >
        ${showingUK ? this.renderUKFlag() : this.renderUSFlag()}
        <span>${this.region}</span>
      </button>
    `;
  }
}

customElements.define('gbbo-region-toggle', GBBORegionToggle);
