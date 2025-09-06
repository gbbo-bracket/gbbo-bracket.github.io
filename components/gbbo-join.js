import { LitElement, html, css } from 'lit';
import { addParticipant, checkParticipantExists } from '../js/utils/join.js';

export class GBBOJoin extends LitElement {
  static properties = {
    isLoading: { type: Boolean },
    message: { type: String },
    messageType: { type: String }, // 'success', 'error', or 'info'
    name: { type: String }
  };

  constructor() {
    super();
    this.isLoading = false;
    this.message = '';
    this.messageType = '';
    this.name = '';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .join-card {
      background-color: rgba(255, 253, 245, 0.9);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.1);
      border: 1px solid rgba(247, 198, 217, 0.3);
    }
    
    @media (max-width: 768px) {
      .join-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .join-card {
        padding: 1.5rem;
      }
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: var(--heading-text);
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      h1 {
        font-size: 1.75rem;
      }
    }
    
    .description {
      font-size: 1.25rem;
      color: var(--body-text);
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      .description {
        font-size: 1.125rem;
      }
    }
    
    .form-container {
      background-color: rgba(251, 232, 166, 0.2);
      padding: 2rem;
      border-radius: 1rem;
      border: 1px solid rgba(190, 228, 210, 0.3);
    }
    
    @media (max-width: 640px) {
      .form-container {
        padding: 1.5rem;
      }
    }
    
    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;
    }
    
    label {
      display: block;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--heading-text);
      margin-bottom: 0.5rem;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 2px solid rgba(190, 228, 210, 0.5);
      border-radius: 0.5rem;
      background-color: rgba(255, 255, 255, 0.8);
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }
    
    input[type="text"]:focus {
      outline: none;
      border-color: rgba(33, 65, 119, 0.5);
      background-color: rgba(255, 255, 255, 1);
    }
    
    .join-button {
      background: linear-gradient(135deg, #2141779e 0%, #f7c6d9 100%);
      color: white;
      padding: 0.875rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 150px;
    }
    
    .join-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(33, 65, 119, 0.2);
    }
    
    .join-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .message {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
    }
    
    .message.success {
      background-color: rgba(34, 197, 94, 0.1);
      color: #15803d;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    
    .message.error {
      background-color: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .message.info {
      background-color: rgba(59, 130, 246, 0.1);
      color: #2563eb;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    
    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .rules-reminder {
      background-color: rgba(59, 130, 246, 0.1);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-top: 2rem;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    
    .rules-reminder h3 {
      font-size: 1.25rem;
      color: var(--heading-text);
      margin-top: 0;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    
    .rules-reminder p {
      font-size: 1rem;
      color: var(--body-text);
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    
    .rules-reminder p:last-child {
      margin-bottom: 0;
    }
    
    .rules-link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
    
    .rules-link:hover {
      text-decoration: underline;
    }
  `;

  handleInputChange(e) {
    this.name = e.target.value;
    // Clear any previous messages when user starts typing
    if (this.message) {
      this.message = '';
      this.messageType = '';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const trimmedName = this.name.trim();
    
    // Validation
    if (!trimmedName) {
      this.showMessage('Please enter your name.', 'error');
      return;
    }
    
    if (trimmedName.length < 2) {
      this.showMessage('Name must be at least 2 characters long.', 'error');
      return;
    }
    
    if (trimmedName.length > 50) {
      this.showMessage('Name must be less than 50 characters long.', 'error');
      return;
    }

    this.isLoading = true;
    this.showMessage('Adding you to the league...', 'info');

    try {
      // Check if participant already exists
      const exists = await checkParticipantExists(trimmedName);
      
      if (exists) {
        this.showMessage(`"${trimmedName}" is already in the league! Choose a different name or check the standings.`, 'error');
        return;
      }

      // Add the participant
      await addParticipant(trimmedName);
      
      this.showMessage(`Welcome to the league, ${trimmedName}! 🎉 You can now start voting on weekly episodes.`, 'success');
      this.name = ''; // Clear the form
      
    } catch (error) {
      console.error('Error adding participant:', error);
      this.showMessage('Sorry, there was an error adding you to the league. Please try again later.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  showMessage(text, type) {
    this.message = text;
    this.messageType = type;
  }

  render() {
    return html`
      <div class="join-card">
        <h1>Join the League</h1>
        <p class="description">
          Ready to test your baking intuition? Join our GBBO prediction league and compete with friends to see who can best predict the weekly outcomes!
        </p>
        
        <div class="form-container">
          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label for="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                .value=${this.name}
                @input=${this.handleInputChange}
                placeholder="Enter your name"
                ?disabled=${this.isLoading}
                maxlength="50"
              />
            </div>
            
            <button 
              type="submit" 
              class="join-button"
              ?disabled=${this.isLoading || !this.name.trim()}
            >
              ${this.isLoading ? html`<span class="loading-spinner"></span>` : ''}
              ${this.isLoading ? 'Joining...' : 'Join League'}
            </button>
          </form>
          
          ${this.message ? html`
            <div class="message ${this.messageType}">
              ${this.message}
            </div>
          ` : ''}
        </div>
        
        <div class="rules-reminder">
          <h3>New to the League?</h3>
          <p>Each week, predict who will be Star Baker, who will reign in the Technical, and who might leave the tent.</p>
          <p>Points are awarded based on accuracy. <a href="./rules.html" class="rules-link">Read the full rules</a> to learn how scoring works!</p>
        </div>
      </div>
    `;
  }
}

customElements.define('gbbo-join', GBBOJoin);
