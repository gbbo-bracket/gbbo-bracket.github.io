import { LitElement, html, css } from 'lit';

export class GBBOWelcomeCard extends LitElement {
  static properties = {
    currentSeason: { type: String },
    isSeasonActive: { type: Boolean },
    contestantCount: { type: Number }
  };

  constructor() {
    super();
    this.currentSeason = '2025';
    this.isSeasonActive = true;
    this.contestantCount = 12;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .welcome-card {
      margin-top: 2rem;
      background-color: rgba(255, 253, 245, 0.9);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.1);
      border: 1px solid rgba(247, 198, 217, 0.3);
    }
    
    @media (max-width: 768px) {
      .welcome-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .welcome-card {
        padding: 1.5rem;
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: #214177;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
      h2 {
        font-size: 1.875rem;
      }
    }
    
    @media (max-width: 640px) {
      h2 {
        font-size: 1.5rem;
      }
    }
    
    p {
      font-size: 1.25rem;
      color: #7C7467;
      margin-bottom: 2rem;
      line-height: 1.625;
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
    
    .season-info {
      background-color: rgba(251, 232, 166, 0.2);
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(190, 228, 210, 0.3);
    }
    
    .season-info h3 {
      font-size: 1.25rem;
      color: #214177;
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .season-info p {
      font-size: 1rem;
      color: #7C7467;
      margin-bottom: 0;
    }
    
    .emoji-container {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .emoji-container {
        gap: 1rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji-container {
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

  render() {
    return html`
      <div class="welcome-card">
        <h2>Welcome to the Bake Off!</h2>
        <p>Get ready for another delicious season of baking brilliance, soggy bottoms, and Paul Hollywood's handshake.</p>
        
        <div class="season-info">
          <h3>Season ${this.currentSeason}</h3>
          <p>${this.isSeasonActive ? 'Currently Active' : 'Coming Soon'} • ${this.contestantCount} Contestants</p>
        </div>
        
        <div class="emoji-container">
          <span class="emoji">🥖</span>
          <span class="emoji">🍰</span>
          <span class="emoji">🥧</span>
          <span class="emoji">🍪</span>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-welcome-card', GBBOWelcomeCard); 