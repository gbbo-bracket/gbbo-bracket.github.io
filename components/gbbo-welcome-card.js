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
      </div>
    `;
  }
}

customElements.define('gbbo-welcome-card', GBBOWelcomeCard); 