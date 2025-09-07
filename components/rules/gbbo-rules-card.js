import { LitElement, html, css } from 'lit';
import '../shared/gbbo-loading-container.js';

export class GBBORulesCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      color: var(--heading-text);
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
      color: var(--body-text);
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
      background-color: rgba(251, 232, 166, 0.2);
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(190, 228, 210, 0.3);
    }
    
    .rules-section h3 {
      font-size: 1.25rem;
      color: var(--heading-text);
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .rules-section p {
      font-size: 1rem;
      color: var(--body-text);
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
      background-color: rgba(255, 253, 245, 0.8);
      padding: 0.75rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(33, 65, 119, 0.1);
    }
    
    .scoring-item .label {
      font-weight: 500;
      color: var(--body-text);
    }
    
    .scoring-item .points {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--berry-red);
    }
    
    @media (max-width: 640px) {
      .scoring-item .points {
        font-size: 1.25rem;
      }
    }
    

  `;

  render() {
    return html`
      <gbbo-card class="rules-card" title="🏆 GBBO Bracket Rules 🏆" body="Brackets open following the premiere of the first episode of the new series.">
        <!-- Voting Deadline -->
        <div class="rules-section">
          <h3>⏰ Voting Deadline</h3>
          <p>
            Votes must be in before new episodes premiere.
          </p>
          <p>
            That is <strong>Tuesday at 8PM GMT</strong> for the UK, or <strong>Friday at 12AM local time</strong> for the US.
          </p>
        </div>

        <div class="rules-section">
          <h3>📋 Scoring Release</h3>
          <p>
            To avoid spoilers, points will be updated after the US premiere, on <strong>Friday evenings</strong>.
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
              <span class="label">🔥 Wins Technical</span>
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
              <span class="label">🎖️ Each correct finalist</span>
              <span class="points">+3 points</span>
            </div>
            <div class="scoring-item">
              <span class="label">🏆 Correct overall winner</span>
              <span class="points">+7 points</span>
            </div>
          </div>
        </div>
      </gbbo-card>
    `;
  }
}

customElements.define('gbbo-rules-card', GBBORulesCard); 