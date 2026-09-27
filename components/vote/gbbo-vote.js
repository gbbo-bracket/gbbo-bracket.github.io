import { LitElement, html, css, svg } from 'lit';
import '../foundations/card.js';
import '../foundations/primary-button.js';
import '../contestants/gbbo-contestant-picker.js';
import '../shared/gbbo-loading-container.js';
import '../shared/gbbo-profile-toggle.js';
import { fetchContestants } from '../../js/utils/bakers.js';
import { fetchActiveWeeks, fetchWeek } from '../../js/utils/baker-results.js';
import { FINALS_WEEK_ID, createFinalistNomination, createNomination, fetchNomination } from '../../js/utils/nominations.js';
import { PROFILE_CHANGE_EVENT, getProfile } from '../../js/utils/profile.js';

export class GBBOVote extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .profile-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .profile-row-label {
      font-size: 0.9375rem;
      color: var(--body-text);
    }

    .weeks {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      text-align: left;
    }

    .week {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .week-table {
      background-color: rgba(255, 253, 245, 0.9);
      border-radius: 1rem;
      border: 1px solid rgba(169, 208, 245, 0.3);
      overflow: hidden;
    }

    .week-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      background-color: rgba(247, 198, 217, 0.2);
      padding: 1rem 1.5rem;
      border-bottom: 2px solid rgba(247, 198, 217, 0.3);
    }

    .week-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }

    .week-heading-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .week-heading {
      font-family: inherit;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--heading-text);
      margin: 0;
    }

    .info-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125rem;
      height: 1.125rem;
      padding: 0;
      border: none;
      background: none;
      color: var(--heading-text);
      opacity: 0.55;
      cursor: pointer;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .info-toggle:hover,
    .info-toggle:focus-visible {
      opacity: 1;
    }

    .info-toggle svg {
      width: 100%;
      height: 100%;
    }

    .week-description {
      font-family: inherit;
      font-size: 0.9rem;
      color: var(--body-text);
      margin: 0;
      line-height: 1.4;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.25s ease, opacity 0.2s ease;
    }

    .week-description.open {
      max-height: 40rem;
      opacity: 1;
    }

    .picks-table {
      width: 100%;
      border-collapse: collapse;
    }

    /* On desktop each field is its own column: label on top, picker below,
       three columns across one row */
    .picks-table td.pick-cell {
      padding: 1.25rem 1.5rem;
      vertical-align: top;
      text-align: center;
      border-right: 1px solid rgba(190, 228, 210, 0.3);
    }

    .picks-table td.pick-cell:last-child {
      border-right: none;
    }

    .pick-label {
      display: block;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .pick-value {
      display: flex;
      justify-content: center;
    }

    .week-messages {
      padding: 1rem 1.5rem 0;
    }

    /* Below the breakpoint there isn't room for three columns, so each field
       goes back to being its own full-width row, label above picker */
    @media (max-width: 640px) {
      .picks-table, .picks-table tbody, .picks-table tr, .picks-table td {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }

      .picks-table td.pick-cell {
        text-align: left;
        border-right: none;
        border-bottom: 1px solid rgba(190, 228, 210, 0.3);
        padding: 1rem 1.5rem;
      }

      .picks-table tr td.pick-cell:last-child {
        border-bottom: none;
      }

      .pick-value {
        justify-content: flex-start;
      }
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

    .no-profile {
      color: var(--body-text);
      font-size: 1.0625rem;
    }

    .no-weeks {
      color: var(--body-text);
      font-size: 1.0625rem;
    }

    .success {
      background-color: rgba(187, 247, 208, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #16a34a;
      padding: 1rem;
      border-radius: 0.5rem;
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
    }

    .submit-error-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
  `;

  // The three baker picks, so the picker and its table row can be rendered from one place.
  // nominationField is the Nominations table column an existing pick is read back from
  static BAKER_FIELDS = [
    { name: 'starBaker', label: 'Star Baker', property: 'selectedStarBaker', nominationField: 'Star Baker' },
    { name: 'technical', label: 'Technical Winner', property: 'selectedTechnical', nominationField: 'Wins Technical' },
    { name: 'eliminated', label: 'Eliminated', property: 'selectedEliminated', nominationField: 'Eliminated' }
  ];

  // The Finals week asks for the overall winner and the other two finalists instead
  static FINALS_FIELDS = [
    { name: 'winner', label: 'All-around Winner', property: 'selectedWinner', nominationField: 'Finalist #1' },
    { name: 'finalist1', label: 'Finalist', property: 'selectedFinalist1', nominationField: 'Finalist #2' },
    { name: 'finalist2', label: 'Finalist', property: 'selectedFinalist2', nominationField: 'Finalist #3' }
  ];

  static fieldsForWeek(weekId) {
    return weekId === FINALS_WEEK_ID ? GBBOVote.FINALS_FIELDS : GBBOVote.BAKER_FIELDS;
  }

  static properties = {
    // Record ID of one week to vote on (e.g. Finals), shown whether or not it's active.
    // Left unset, every active week is shown
    weekId: { type: String, attribute: 'week-id' },
    heading: { type: String },
    contestants: { type: Array },
    activeWeeks: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    profile: { type: Object },
    // Keyed by week id: { <one selected baker per field property>, submitting, submitSuccess, submitError }
    weekVotes: { type: Object },
    // Keyed by week id: whether that week's description is expanded
    expandedDescriptions: { type: Object }
  };

  constructor() {
    super();
    this.weekId = '';
    this.heading = 'On your marks... get set... vote!';
    this.contestants = [];
    this.activeWeeks = [];
    // Stays true until the saved profile and the Airtable data have both loaded, so the
    // page never flashes another profile's picks before we know who is actually voting
    this.loading = true;
    this.error = '';
    this.profile = null;
    this.weekVotes = {};
    this.expandedDescriptions = {};
    this.handleProfileChange = this.handleProfileChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
    this.profile = getProfile();
    this.loadVotingData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
  }

  async loadVotingData() {
    this.loading = true;
    this.error = '';

    try {
      const [contestants, activeWeeks] = await Promise.all([fetchContestants(), this.fetchWeeks()]);
      this.contestants = contestants;
      this.activeWeeks = activeWeeks;
      await this.initializeWeekVotes();
    } catch (error) {
      this.error = error.message;
      console.error('Failed to load voting data:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchWeeks() {
    if (!this.weekId) return fetchActiveWeeks();
    const week = await fetchWeek(this.weekId);
    return week ? [week] : [];
  }

  async handleRetry() {
    await this.loadVotingData();
  }

  // Sets every active week back to the first baker, then lets any vote this profile
  // already cast for that week take over once it has loaded
  async initializeWeekVotes() {
    const weekVotes = {};
    this.activeWeeks.forEach(week => {
      weekVotes[week.id] = {
        ...this.defaultSelections(week.id),
        submitting: false,
        submitSuccess: false,
        submitError: ''
      };
    });
    this.weekVotes = weekVotes;

    if (!this.profile) return;
    await Promise.all(this.activeWeeks.map(week => this.applyExistingNomination(week.id)));
  }

  // Every pick for the week starts on the first baker still in the competition
  defaultSelections(weekId) {
    const firstContestant = this.activeContestants[0] || null;
    return Object.fromEntries(GBBOVote.fieldsForWeek(weekId).map(field => [field.property, firstContestant]));
  }

  async applyExistingNomination(weekId) {
    try {
      const nomination = await fetchNomination({ weekId, participantId: this.profile.id });
      this.updateWeekState(weekId, Object.fromEntries(GBBOVote.fieldsForWeek(weekId).map(field => [
        field.property,
        this.getContestantById(nomination.data[field.nominationField][0])
      ])));
    } catch (error) {
      // No existing nomination for this profile/week yet - the defaults already picked stand
    }
  }

  async handleProfileChange(event) {
    this.profile = event.detail.profile;
    // The initial load already applies whichever profile is saved once it finishes
    if (this.loading) return;

    this.activeWeeks.forEach(week => this.updateWeekState(week.id, {
      ...this.defaultSelections(week.id),
      submitSuccess: false,
      submitError: ''
    }));

    if (!this.profile) return;
    await Promise.all(this.activeWeeks.map(week => this.applyExistingNomination(week.id)));
  }

  // Method to find contestant by ID
  getContestantById(id) {
    return this.contestants.find(contestant => contestant.id === id);
  }

  // Bakers who have already been eliminated can't win star baker or technical,
  // or be eliminated again, so they're left off the picker options
  get activeContestants() {
    return this.contestants.filter(contestant => !contestant['Eliminated']);
  }

  updateWeekState(weekId, changes) {
    const current = this.weekVotes[weekId];
    if (!current) return;
    this.weekVotes = { ...this.weekVotes, [weekId]: { ...current, ...changes } };
  }

  setSelection(weekId, property, contestant) {
    this.updateWeekState(weekId, { [property]: contestant });
  }

  toggleDescription(weekId) {
    this.expandedDescriptions = {
      ...this.expandedDescriptions,
      [weekId]: !this.expandedDescriptions[weekId]
    };
  }

  renderInfoIcon() {
    return svg`
      <svg viewBox="0 0 20 20" role="presentation" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.5" />
        <line x1="10" y1="9" x2="10" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="10" cy="6" r="1" fill="currentColor" />
      </svg>
    `;
  }

  renderBakerCell(weekId, field, state) {
    return html`
      <td class="pick-cell">
        <span class="pick-label">${field.label}</span>
        <div class="pick-value">
          <gbbo-contestant-picker
            .contestants="${this.activeContestants}"
            .selected="${state[field.property]}"
            .label="${field.label}"
            .disabled="${this.activeContestants.length === 0}"
            @contestant-change="${(e) => this.setSelection(weekId, field.property, e.detail.contestant)}"
          ></gbbo-contestant-picker>
        </div>
      </td>
    `;
  }

  renderWeek(week) {
    const state = this.weekVotes[week.id];
    if (!state) return '';
    const descriptionOpen = !!this.expandedDescriptions[week.id];

    return html`
      <div class="week">
        <div class="week-table">
          <div class="week-header">
            <div class="week-info">
              <div class="week-heading-row">
                <h3 class="week-heading">${week.week}</h3>
                ${week.Description ? html`
                  <button
                    type="button"
                    class="info-toggle"
                    aria-expanded="${descriptionOpen}"
                    aria-label="${descriptionOpen ? 'Hide week details' : 'Show week details'}"
                    @click="${() => this.toggleDescription(week.id)}"
                  >
                    ${this.renderInfoIcon()}
                  </button>
                ` : ''}
              </div>
              ${week.Description ? html`
                <p class="week-description ${descriptionOpen ? 'open' : ''}">${week.Description}</p>
              ` : ''}
            </div>
            <primary-button
              type="button"
              @click="${() => this._handleSubmit(week.id)}"
              ?disabled="${this.contestants.length === 0 || state.submitting}"
            >
              Save
            </primary-button>
          </div>

          ${state.submitSuccess || state.submitError ? html`
            <div class="week-messages">
              ${state.submitSuccess ? html`
                <div class="success">
                  <div class="success-title">Votes Saved!</div>
                  <div>Your nominations for this week have been recorded. Thank you for voting!</div>
                </div>
              ` : ''}

              ${state.submitError ? html`
                <div class="submit-error">
                  <div class="submit-error-title">Error Saving Votes</div>
                  <div>${state.submitError}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <table class="picks-table">
            <tbody>
              <tr>
                ${GBBOVote.fieldsForWeek(week.id).map(field => this.renderBakerCell(week.id, field, state))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <gbbo-card title="${this.heading}">
        ${this.loading ? html`
          <gbbo-loading-container></gbbo-loading-container>
        ` : ''}

        ${!this.loading ? html`
          <div class="profile-row">
            ${this.profile ? html`<span class="profile-row-label">Showing submission for</span>` : ''}
            <gbbo-profile-toggle></gbbo-profile-toggle>
          </div>
        ` : ''}

        ${!this.loading && this.error ? html`
          <div class="error">
            <div class="error-title">Error Loading Voting</div>
            <div>${this.error}</div>
            <primary-button
              @click="${this.handleRetry}"
              ?disabled="${this.loading}"
            >
              ${this.loading ? 'Loading...' : 'Try Again'}
            </primary-button>
          </div>
        ` : ''}

        ${!this.loading && !this.error && !this.profile ? html`
          <div class="no-profile">Pick who you are above to start voting.</div>
        ` : ''}

        ${!this.loading && !this.error && this.profile && this.activeWeeks.length === 0 ? html`
          <div class="no-weeks">There's no week open for voting right now. Check back soon!</div>
        ` : ''}

        ${!this.loading && !this.error && this.profile && this.activeWeeks.length > 0 ? html`
          <div class="weeks">
            ${this.activeWeeks.map(week => this.renderWeek(week))}
          </div>
        ` : ''}
      </gbbo-card>
    `;
  }

  async _handleSubmit(weekId) {
    const state = this.weekVotes[weekId];
    if (!state || !this.profile) return;

    this.updateWeekState(weekId, { submitting: true, submitError: '', submitSuccess: false });

    try {
      if (weekId === FINALS_WEEK_ID) {
        await createFinalistNomination({
          participantId: this.profile.id,
          winnerId: state.selectedWinner?.id,
          finalist1Id: state.selectedFinalist1?.id,
          finalist2Id: state.selectedFinalist2?.id
        });
      } else {
        await createNomination({
          weekId,
          participantId: this.profile.id,
          starBakerId: state.selectedStarBaker?.id,
          technicalId: state.selectedTechnical?.id,
          eliminatedId: state.selectedEliminated?.id
        });
      }
      this.updateWeekState(weekId, { submitSuccess: true });
    } catch (error) {
      console.error('Error submitting votes:', error);
      this.updateWeekState(weekId, { submitError: error.message || 'Failed to submit your votes. Please try again.' });
    } finally {
      this.updateWeekState(weekId, { submitting: false });
    }
  }
}

customElements.define('gbbo-vote', GBBOVote);
