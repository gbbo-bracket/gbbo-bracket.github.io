import { LitElement, html, css } from 'lit';

export class GBBORulesCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .rules-card {
      margin-top: 2rem;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      max-width: 64rem;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    @media (max-width: 768px) {
      .rules-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .rules-card {
        padding: 1.5rem;
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      color: #8b4513;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      h2 {
        font-size: 2.25rem;
      }
    }
    
    @media (max-width: 640px) {
      h2 {
        font-size: 1.875rem;
      }
    }
    
    .subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      .subtitle {
        font-size: 1.125rem;
      }
    }
    
    @media (max-width: 640px) {
      .subtitle {
        font-size: 1rem;
      }
    }
    
    .rules-section {
      background-color: rgba(139, 69, 19, 0.1);
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(139, 69, 19, 0.2);
    }
    
    .rules-section h3 {
      font-size: 1.25rem;
      color: #8b4513;
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .rules-section p {
      font-size: 1rem;
      color: #6b7280;
      margin-bottom: 0;
    }
    
    .scoring-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .scoring-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .scoring-item .label {
      font-weight: 500;
      color: #374151;
    }
    
    .scoring-item .points {
      font-weight: 700;
      font-size: 1.5rem;
      color: #8b4513;
    }
    
    @media (max-width: 640px) {
      .scoring-item .points {
        font-size: 1.25rem;
      }
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
      <div class="rules-card">
        <h2>🏆 GBBO Bracket Rules 🏆</h2>
        <p class="subtitle">
          Everything you need to know to play the Great British Bake Off Bracket game!
        </p>
        
        <!-- Voting Deadline -->
        <div class="rules-section">
          <h3>⏰ Voting Deadline</h3>
          <p>
            Votes must be in by <strong>Tuesday at 8PM GMT / 3PM EST / 12PM PST</strong>
          </p>
        </div>
        
        <!-- Honor System -->
        <div class="rules-section">
          <h3>🤝 Fair Play</h3>
          <p>
            We're operating on the <strong>honor system</strong> so please play fair!
          </p>
        </div>
        
        <!-- Scoring System -->
        <div class="rules-section">
          <h3>📊 Scoring System</h3>
          <div class="scoring-grid">
            <div class="scoring-item">
              <span class="label">⭐ Star Baker</span>
              <span class="points">4 points</span>
            </div>
            <div class="scoring-item">
              <span class="label">🥇 Wins Technical</span>
              <span class="points">2 points</span>
            </div>
            <div class="scoring-item">
              <span class="label">❌ Eliminated</span>
              <span class="points">3 points</span>
            </div>
          </div>
        </div>
        
        <!-- End of Series Bonus -->
        <div class="rules-section">
          <h3>🎯 End of Series Bonus</h3>
          <div class="scoring-grid">
            <div class="scoring-item">
              <span class="label">Each correct finalist</span>
              <span class="points">+3 points</span>
            </div>
            <div class="scoring-item">
              <span class="label">🏆 Correct overall winner</span>
              <span class="points">+7 points</span>
            </div>
          </div>
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

customElements.define('gbbo-rules-card', GBBORulesCard); 