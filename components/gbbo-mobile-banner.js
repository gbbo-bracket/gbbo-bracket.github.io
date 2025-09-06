import { LitElement, html, css } from 'lit';
import './foundations/primary-button';

export class GBBOMobileBanner extends LitElement {
  static styles = css`
    :host {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .banner {
      background: var(--canvas);
      backdrop-filter: blur(8px);
      border-top: 1px solid rgba(247, 198, 217, 0.3);
      box-shadow: 0 -4px 6px -1px rgba(33, 65, 119, 0.1);
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      position: relative;
    }
    
    .banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 100%;
      position: relative;
    }
      
    .vote-button {
      position: absolute;
      top: -3.75rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      width: max-content;
      padding: .75rem 1.5rem;
      border-radius: 3rem;
      background-color: var(--berry-red);
      color: var(--body-text-on-dark);
      font-weight: 600;
      text-decoration: none;
      font-size: 1.25rem;
      border: .5rem solid var(--clotted-cream);
      box-shadow: 0 -4px 6px -1px rgba(33, 65, 119, 0.1);
    }
    
    /* Show only on mobile devices */
    @media (max-width: 768px) {
      :host {
        display: block;
      }
    }
  `;

  render() {
    return html`
      <div class="banner">
        <div class="banner-content">
          <a href="/vote" class="vote-button">
            Vote now
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-mobile-banner', GBBOMobileBanner);
