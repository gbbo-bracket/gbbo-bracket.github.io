import { LitElement, html, css } from 'lit';
import './foundations/card.js';
import './foundations/primary-button.js';
import './gbbo-contestants-data.js';
import './gbbo-loading-container.js';
import { fetchContestants } from '../js/utils/bakers.js';
import { fetchNames } from '../js/utils/participants.js';
import { fetchWeeks } from '../js/utils/baker-results.js';

export class GBBOVote extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .vote-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group-row {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
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
  `;

  static properties = {
    contestants: { type: Array },
    names: { type: Array },
    weeks: { type: Array },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.contestants = [];
    this.names = [];
    this.weeks = [];
    this.loading = false;
    this.error = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchContestants();
    this.fetchNames();
    this.fetchWeeks();
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

  async fetchWeeks() {
    try {
      this.weeks = await fetchWeeks();
    } catch (error) {
      console.error('Failed to fetch weeks:', error);
    }
  }

  async handleRetry() {
    await this.fetchContestants();
    await this.fetchNames();
    await this.fetchWeeks();
  }

  render() {
    return html`
      <gbbo-card title="Ready... set... vote!">
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

        ${!this.loading && !this.error ? html`
          <form class="vote-form" @submit=${this._handleSubmit}>
            <div class="form-group-row">
              <label class="form-label" for="week">What week?</label>
              <select class="form-select" id="week" name="week" required ?disabled="${this.weeks.length === 0}">
                <option value="" disabled selected>Select Week...</option>
                ${this.weeks.map(week => html`
                  <option value="${week.id}">${week.week}</option>
                `)}
              </select>
            </div>

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
                <label class="form-label" for="star-baker">Star Baker</label>
                <select class="form-select" id="star-baker" name="starBaker" required ?disabled="${this.contestants.length === 0}">
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="technical">Technical Winner</label>
                <select class="form-select" id="technical" name="technical" required ?disabled="${this.contestants.length === 0}">
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="eliminated">Eliminated</label>
                <select class="form-select" id="eliminated" name="eliminated" required ?disabled="${this.contestants.length === 0}">
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
              </div>
            </div>

            <primary-button type="submit" ?disabled="${this.contestants.length === 0 || this.weeks.length === 0}">
              Submit Votes
            </primary-button>
          </form>
        ` : ''}
      </gbbo-card>
    `;
  }

  _handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const votes = {
      week: formData.get('week'),
      name: formData.get('name'),
      starBaker: formData.get('starBaker'),
      technical: formData.get('technical'),
      eliminated: formData.get('eliminated')
    };

    // Find contestant names for logging
    const voterName = this.names.find(n => n.id === votes.name)?.name;
    const starBakerName = this.contestants.find(c => c.id === votes.starBaker)?.name;
    const technicalName = this.contestants.find(c => c.id === votes.technical)?.name;
    const eliminatedName = this.contestants.find(c => c.id === votes.eliminated)?.name;

    console.log('Votes submitted:', {
      ...votes,
      voterName,
      starBakerName,
      technicalName,
      eliminatedName
    });
    
    // Placeholder API call
    this._submitVotes(votes);
  }

  async _submitVotes(votes) {
    try {
      // Placeholder API endpoint
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(votes)
      });

      if (response.ok) {
        console.log('Votes submitted successfully');
        // You could add success feedback here
      } else {
        console.error('Failed to submit votes');
        // You could add error feedback here
      }
    } catch (error) {
      console.error('Error submitting votes:', error);
      // You could add error feedback here
    }
  }
}

customElements.define('gbbo-vote', GBBOVote); 