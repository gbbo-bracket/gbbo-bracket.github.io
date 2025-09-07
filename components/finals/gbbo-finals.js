import { LitElement, html, css } from 'lit';
import '../foundations/card.js';
import '../foundations/primary-button.js';
import '../contestants/gbbo-contestants-data.js';
import '../shared/gbbo-loading-container.js';
import { fetchContestants } from '../../js/utils/bakers.js';
import { fetchNames } from '../../js/utils/participants.js';
import { createFinalistNomination } from '../../js/utils/nominations.js';

export class GBBOFinals extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .finals-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .form-group-row {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .form-group-row {
        flex-direction: column;
      }
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-select {
      padding: 0.75rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      background-color: white;
      transition: border-color 0.2s ease;
      width: 100%;
    }

    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-select:disabled {
      background-color: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .error {
      background-color: rgba(247, 198, 217, 0.1);
      border: 1px solid rgba(217, 76, 87, 0.3);
      color: #d94c57;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .error-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .success {
      background-color: rgba(187, 247, 208, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #16a34a;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .success-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .submit-error {
      background-color: rgba(247, 198, 217, 0.1);
      border: 1px solid rgba(217, 76, 87, 0.3);
      color: #d94c57;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .submit-error-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
  `;

  static properties = {
    contestants: { type: Array },
    names: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    submitting: { type: Boolean },
    submitSuccess: { type: Boolean },
    submitError: { type: String },
    selectedWinner: { type: Object },
    selectedFinalist1: { type: Object },
    selectedFinalist2: { type: Object },
  };

  constructor() {
    super();
    this.contestants = [];
    this.names = [];
    this.loading = false;
    this.error = '';
    this.submitting = false;
    this.submitSuccess = false;
    this.submitError = '';
    this.selectedWinner = null;
    this.selectedFinalist1 = null;
    this.selectedFinalist2 = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchContestants();
    this.fetchNames();
  }

  async fetchContestants() {
    this.loading = true;
    this.error = '';
    
    try {
      this.contestants = await fetchContestants();
    } catch (error) {
      this.error = error.message;
      console.error('Failed to fetch contestants for voting:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchNames() {
    try {
      this.names = await fetchNames();
    } catch (error) {
      console.error('Failed to fetch names:', error);
    }
  }

  async handleRetry() {
    await this.fetchContestants();
    await this.fetchNames();
  }

  // Method to find contestant by ID
  getContestantById(id) {
    return this.contestants.find(contestant => contestant.id === id);
  }

  // Handle winner selection change
  handleWinnerChange(e) {
    const selectedId = e.target.value;
    this.selectedWinner = selectedId ? this.getContestantById(selectedId) : null;
  }

  handleFinalist1Change(e) {
    const selectedId = e.target.value;
    this.selectedFinalist1 = selectedId ? this.getContestantById(selectedId) : null;
  }

  handleFinalist2Change(e) {
    const selectedId = e.target.value;
    this.selectedFinalist2 = selectedId ? this.getContestantById(selectedId) : null;
  }

  render() {
    return html`
      <gbbo-card title="On your marks... get set... finals!">
        ${this.loading ? html`
          <gbbo-loading-container></gbbo-loading-container>
        ` : ''}
        
        ${this.error ? html`
          <div class="error">
            <div class="error-title">Error Loading Contestants</div>
            <div>${this.error}</div>
            <primary-button 
              @click="${this.handleRetry}"
              ?disabled="${this.loading}"
            >
              ${this.loading ? 'Loading...' : 'Try Again'}
            </primary-button>
          </div>
        ` : ''}

        ${this.submitSuccess ? html`
          <div class="success">
            <div class="success-title">Finals Submitted Successfully!</div>
            <div>Your finals have been recorded. Thank you for voting!</div>
          </div>
        ` : ''}

        ${this.submitError ? html`
          <div class="submit-error">
            <div class="submit-error-title">Error Submitting Finals</div>
            <div>${this.submitError}</div>
          </div>
        ` : ''}

        ${!this.loading && !this.error && !this.submitSuccess ? html`
          <form class="finals-form" @submit=${this._handleSubmit}>
            <div class="form-group-row">
              <label class="form-label" for="name">Your Name</label>
              <select class="form-select" id="name" name="name" required ?disabled="${this.names.length === 0}">
                <option value="" disabled selected>Select Your Name...</option>
                ${this.names.map(name => html`
                  <option value="${name.id}">${name.name}</option>
                `)}
              </select>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label class="form-label" for="winner">All-around winner</label>
                <select 
                  class="form-select" 
                  id="winner" 
                  name="winner" 
                  required 
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleWinnerChange}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedWinner}">
                </gbbo-contestants-card>
              </div>

              <div class="form-group">
                <label class="form-label" for="finalist-1">Finalist</label>
                <select
                  class="form-select"
                  id="finalist-1"
                  name="finalist-1"
                  required
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleFinalist1Change}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedFinalist1}">
                </gbbo-contestants-card>
              </div>

              <div class="form-group">
                <label class="form-label" for="finalist-2">Finalist</label>
                <select
                  class="form-select"
                  id="finalist-2"
                  name="finalist-2"
                  required
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleFinalist2Change}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedFinalist2}">
                </gbbo-contestants-card>
              </div>
            </div>

            <primary-button 
              type="submit" 
              @click="${this._handleButtonClick}"
              ?disabled="${this.contestants.length === 0 || this.submitting}"
            >
              ${this.submitting ? 'Submitting...' : 'Submit'}
            </primary-button>
          </form>
        ` : ''}
      </gbbo-card>
    `;
  }

  _handleButtonClick(e) {
    e.preventDefault();
    console.log('Submit button clicked');
    
    // Find the form and trigger submit
    const form = this.shadowRoot.querySelector('form');
    if (form) {
      console.log('Form found, triggering submit');
      // Create a submit event and dispatch it
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    } else {
      console.error('Form not found');
    }
  }

  _handleSubmit(e) {
    e.preventDefault();

    console.log('Form submitted');
    
    const formData = new FormData(e.target);
    const votes = {
      participantId: formData.get('name'),
      winnerId: formData.get('winner'),
      finalist1Id: formData.get('finalist-1'),
      finalist2Id: formData.get('finalist-2')
    };

    console.log('Votes:', votes);

    // Find contestant names for logging
    const voterName = this.names.find(n => n.id === votes.participantId)?.name;
    const winnerName = this.contestants.find(c => c.id === votes.winnerId)?.name;
    const finalist1Name = this.contestants.find(c => c.id === votes.finalist1Id)?.name;
    const finalist2Name = this.contestants.find(c => c.id === votes.finalist2Id)?.name;

    console.log('Votes submitted:', {
      ...votes,
      voterName,
      winnerName,
      finalist1Name,
      finalist2Name,
    });
    
    this._submitVotes(votes);
  }

  async _submitVotes(votes) {
    this.submitting = true;
    this.submitError = '';
    
    try {
      const nomination = await createFinalistNomination(votes);
      console.log('Nomination created successfully:', nomination);
      this.submitSuccess = true;
    } catch (error) {
      console.error('Error submitting votes:', error);
      this.submitError = error.message || 'Failed to submit your votes. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  _resetForm() {
    this.submitSuccess = false;
    this.submitError = '';
    
    // Reset form fields
    const form = this.shadowRoot.querySelector('form');
    if (form) {
      form.reset();
    }
  }
}

customElements.define('gbbo-finals', GBBOFinals); 