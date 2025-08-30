import { LitElement, html, css } from 'lit';

export class GBBOHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.1);
    }
    
    .emoji {
      font-size: 6rem;
      margin-bottom: 1rem;
      animation: bounce 1s infinite;
    }
    
    @media (max-width: 768px) {
      .emoji {
        font-size: 5rem;
      }
      
      header {
        padding: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji {
        font-size: 4rem;
      }
      
      header {
        padding: 1rem;
      }
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      font-weight: 700;
      color: #8b4513;
      margin-bottom: 0.5rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 4rem;
      }
    }
    
    @media (max-width: 640px) {
      h1 {
        font-size: 3rem;
      }
    }
    
    p {
      font-size: 1.25rem;
      color: #1e40af;
      font-weight: 300;
      letter-spacing: 0.025em;
    }
    
    @media (max-width: 768px) {
      p {
        font-size: 1.125rem;
      }
    }
    
    @media (max-width: 640px) {
      p {
        font-size: 1rem;
      }
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -30px, 0);
      }
      70% {
        transform: translate3d(0, -15px, 0);
      }
      90% {
        transform: translate3d(0, -4px, 0);
      }
    }
  `;

  render() {
    return html`
      <header>
        <div class="emoji">🧁</div>
        <h1>GBBO Bracket 2025</h1>
        <p>The Great British Bake Off Tournament</p>
      </header>
    `;
  }
}

customElements.define('gbbo-header', GBBOHeader); 