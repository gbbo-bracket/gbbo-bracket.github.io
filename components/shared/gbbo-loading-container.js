import { LitElement, html, css } from 'lit';

export class GBBOLoadingContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .loading-container {
        gap: 1rem;
      }
    }
    
    @media (max-width: 640px) {
      .loading-container {
        gap: 0.75rem;
      }
    }
    
    .emoji {
      font-size: 1.875rem;
      animation: bounce 3s infinite;
    }
    
    @media (max-width: 768px) {
      .emoji {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji {
        font-size: 1.25rem;
      }
    }
    
    .emoji:nth-child(1) {
      animation-delay: 0s;
    }
    
    .emoji:nth-child(2) {
      animation-delay: 0.25s;
    }
    
    .emoji:nth-child(3) {
      animation-delay: .5s;
    }
    
    .emoji:nth-child(4) {
      animation-delay: 1s;
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translate3d(0, 0, 0);
      }
      25% {
        transform: translate3d(0, -15px, 0);
      }
      50% {
        transform: translate3d(0, -8px, 0);
      }
      75% {
        transform: translate3d(0, -4px, 0);
      }
    }
  `;

  static properties = {
    emojis: { type: Array }
  };

  constructor() {
    super();
    this.emojis = ['🥖', '🍰', '🥧', '🍪'];
  }

  render() {
    return html`
      <div class="loading-container">
        ${this.emojis.map(emoji => html`<span class="emoji">${emoji}</span>`)}
      </div>
    `;
  }
}

customElements.define('gbbo-loading-container', GBBOLoadingContainer); 