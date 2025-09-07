import { LitElement, html, css } from 'lit';

export class GBBOBanner extends LitElement {
  static properties = {
    message: { type: String },
    ctaText: { type: String },
    ctaHref: { type: String }
  };

  constructor() {
    super();
    this.message = 'New to the league? Join before you start voting!';
    this.ctaText = 'Join Now';
    this.ctaHref = '/join';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .banner {
      background: var(--icing-pink);
      padding: 1rem 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(190, 228, 210, 0.3);
      box-shadow: 0 2px 4px rgba(33, 65, 119, 0.1);
    }
    
    .banner-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .banner-message {
      font-size: 1rem;
      color: var(--royal-blue);
      font-weight: 500;
      margin: 0;
    }
    
    /* Mobile styles */
    @media (max-width: 768px) {
      .banner {
        padding: 1.5rem;
      }
      
      .banner-content {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .banner-message {
        font-size: 1rem;
        margin-bottom: .5rem;
      }
    }
  `;

  render() {
    return html`
      <div class="banner">
        <div class="banner-content">
          <p class="banner-message">${this.message}</p>
          <primary-button href="${this.ctaHref}" class="banner-cta">${this.ctaText}</primary-button>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-banner', GBBOBanner);
