import { LitElement, html, css } from 'lit';

export class GBBOHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1rem;
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
      margin-top: 0;
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
  `;

  render() {
    return html`
      <header>
        <div class="emoji">🧁</div>
        <h1>GBBO Bracket 2025</h1>
      </header>
    `;
  }
}

customElements.define('gbbo-header', GBBOHeader);