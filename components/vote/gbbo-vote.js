import { LitElement, html, css } from 'lit';
import '../foundations/card.js';
import '../foundations/primary-button.js';
import '../contestants/gbbo-contestants-data.js';
import '../shared/gbbo-loading-container.js';
import { fetchContestants } from '../../js/utils/bakers.js';
import { fetchNames } from '../../js/utils/participants.js';
import { fetchActiveWeeks } from '../../js/utils/baker-results.js';
import { createNomination, fetchNomination } from '../../js/utils/nominations.js';

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
    activeWeeks: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    submitting: { type: Boolean },
    submitSuccess: { type: Boolean },
    submitError: { type: String },
    selectedStarBaker: { type: Object },
    selectedTechnical: { type: Object },
    selectedEliminated: { type: Object }
  };

  constructor() {
    super();
    this.contestants = [];
    this.names = [];
    this.activeWeeks = [];
    this.loading = false;
    this.error = '';
    this.submitting = false;
    this.submitSuccess = false;
    this.submitError = '';
    this.selectedStarBaker = null;
    this.selectedTechnical = null;
    this.selectedEliminated = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchContestants();
    this.fetchNames();
    this.fetchActiveWeeks();
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

  async fetchActiveWeeks() {
    try {
      this.activeWeeks = await fetchActiveWeeks();
    } catch (error) {
      console.error('Failed to fetch weeks:', error);
    }
  }

  async fetchNomination(votes) {
    try {
      const nomination = await fetchNomination(votes);
      console.log('Nomination fetched successfully:', nomination);
      this.selectedStarBaker = this.getContestantById(nomination.data['Star Baker'][0]);
      this.selectedTechnical = this.getContestantById(nomination.data['Wins Technical'][0]);
      this.selectedEliminated = this.getContestantById(nomination.data['Eliminated'][0]);
      console.log('Selected star baker:', this.selectedStarBaker);
      console.log('Selected technical:', this.selectedTechnical);
      console.log('Selected eliminated:', this.selectedEliminated);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  }

  async handleRetry() {
    await this.fetchContestants();
    await this.fetchNames();
    await this.fetchActiveWeeks();
  }

  // Method to find contestant by ID
  getContestantById(id) {
    return this.contestants.find(contestant => contestant.id === id);
  }

  handleStarBakerChange(e) {
    const selectedId = e.target.value;
    this.selectedStarBaker = selectedId ? this.getContestantById(selectedId) : null;
  }

  handleTechnicalChange(e) {
    const selectedId = e.target.value;
    this.selectedTechnical = selectedId ? this.getContestantById(selectedId) : null;
  }

  handleEliminatedChange(e) {
    const selectedId = e.target.value;
    this.selectedEliminated = selectedId ? this.getContestantById(selectedId) : null;
  }

  render() {
    return html`
      <gbbo-card title="On your marks... get set... vote!">
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
            <div class="success-title">Votes Submitted Successfully!</div>
            <div>Your nominations have been recorded. Thank you for voting!</div>
          </div>
        ` : ''}

        ${this.submitError ? html`
          <div class="submit-error">
            <div class="submit-error-title">Error Submitting Votes</div>
            <div>${this.submitError}</div>
          </div>
        ` : ''}

        ${!this.loading && !this.error && !this.submitSuccess ? html`
          <form class="vote-form" @submit=${this._handleSubmit}>
            <div class="form-group-row">
              <label class="form-label" for="week">What week?</label>
              <select class="form-select" id="week" name="week" required ?disabled="${this.activeWeeks?.length === 0}" @change="${this._handleNameAndWeekChange}">
                <option value="" disabled selected>Select Week...</option>
                ${this.activeWeeks?.length === 1 ? html`
                  <option value="${this.activeWeeks[0].id}" selected>${this.activeWeeks[0].week}</option>
                ` : this.activeWeeks?.map(week => html`
                    <option value="${week.id}">${week.week}</option>
                  `)}
              </select>
            </div>

            <div class="form-group-row">
              <label class="form-label" for="name">Your Name</label>
              <select class="form-select" id="name" name="name" required ?disabled="${this.names.length === 0}" @change="${this._handleNameAndWeekChange}">
                <option value="" disabled selected>Select Your Name...</option>
                ${this.names.map(name => html`
                  <option value="${name.id}">${name.name}</option>
                `)}
              </select>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label class="form-label" for="star-baker">Star Baker</label>
                <select 
                  class="form-select" 
                  id="star-baker" 
                  name="starBaker" 
                  required 
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleStarBakerChange}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedStarBaker}">
                </gbbo-contestants-card>
              </div>

              <div class="form-group">
                <label class="form-label" for="technical">Technical Winner</label>
                <select
                  class="form-select"
                  id="technical"
                  name="technical"
                  required
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleTechnicalChange}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedTechnical}">
                </gbbo-contestants-card>
              </div>

              <div class="form-group">
                <label class="form-label" for="eliminated">Eliminated</label>
                <select
                  class="form-select"
                  id="eliminated"
                  name="eliminated"
                  required
                  ?disabled="${this.contestants.length === 0}"
                  @change="${this.handleEliminatedChange}"
                >
                  <option value="" disabled selected>Select Baker...</option>
                  ${this.contestants.map(contestant => html`
                    <option value="${contestant.id}">${contestant.name}</option>
                  `)}
                </select>
                <gbbo-contestants-card
                  .contestant="${this.selectedEliminated}">
                </gbbo-contestants-card>
              </div>
            </div>

            <primary-button 
              type="submit" 
              @click="${this._handleButtonClick}"
              ?disabled="${this.contestants.length === 0 || this.activeWeeks.length === 0 || this.submitting}"
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

  _handleNameAndWeekChange(e) {
    const formData = new FormData(e.target.form);
    const votes = {
      weekId: formData.get('week'),
      participantId: formData.get('name')
    };
    console.log('Votes:', votes);
    if (votes.weekId && votes.participantId) {
      console.log('Fetching votes...');
      this.fetchNomination(votes);
    }
  }

  _handleSubmit(e) {
    e.preventDefault();

    console.log('Form submitted');
    
    const formData = new FormData(e.target);
    const votes = {
      weekId: formData.get('week'),
      participantId: formData.get('name'),
      starBakerId: formData.get('starBaker'),
      technicalId: formData.get('technical'),
      eliminatedId: formData.get('eliminated')
    };

    console.log('Votes:', votes);

    // Find contestant names for logging
    const voterName = this.names.find(n => n.id === votes.participantId)?.name;
    const starBakerName = this.contestants.find(c => c.id === votes.starBakerId)?.name;
    const technicalName = this.contestants.find(c => c.id === votes.technicalId)?.name;
    const eliminatedName = this.contestants.find(c => c.id === votes.eliminatedId)?.name;
    const weekName = this.activeWeeks.find(w => w.id === votes.weekId)?.week;

    console.log('Votes submitted:', {
      ...votes,
      voterName,
      starBakerName,
      technicalName,
      eliminatedName,
      weekName
    });
    
    this._submitVotes(votes);
  }

  async _submitVotes(votes) {
    this.submitting = true;
    this.submitError = '';
    
    try {
      const nomination = await createNomination(votes);
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

customElements.define('gbbo-vote', GBBOVote); 