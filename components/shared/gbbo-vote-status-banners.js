import { LitElement, html, css } from 'lit';
import './gbbo-banner.js';
import { fetchActiveWeeks } from '../../js/utils/baker-results.js';
import { fetchNomination } from '../../js/utils/nominations.js';
import { PROFILE_CHANGE_EVENT, getProfile } from '../../js/utils/profile.js';

/**
 * Sits at the bottom of the next-week card and nags the current profile to vote.
 * One banner per active week: a reminder if that profile hasn't saved a
 * nomination for the week yet, or a confirmation if they have. Prompts to log
 * in instead when no profile is picked, since there's no vote record to check
 * without one.
 */
export class GBBOVoteStatusBanners extends LitElement {
  static properties = {
    profile: { type: Object },
    // When set, only that week's status is shown (if it's currently open for
    // voting) instead of one banner per active week - lets a caller like the
    // next-week card keep this in sync with whichever week it's displaying.
    weekId: { type: String },
    // [{ id, week, voted }] for each active week (or just the given weekId)
    weekStatuses: { type: Array }
  };

  constructor() {
    super();
    this.profile = getProfile();
    this.weekId = '';
    this.weekStatuses = [];
    this.handleProfileChange = this.handleProfileChange.bind(this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .stack {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    gbbo-banner {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
    this.loadWeekStatuses();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
  }

  updated(changedProperties) {
    // Once a caller's own data has loaded in and it hands us the week to
    // scope to (or switches which week that is), re-check status for it
    if (changedProperties.has('weekId')) this.loadWeekStatuses();
  }

  async handleProfileChange(event) {
    this.profile = event.detail.profile;
    await this.loadWeekStatuses();
  }

  async loadWeekStatuses() {
    if (!this.profile) {
      this.weekStatuses = [];
      return;
    }

    const profileAtRequest = this.profile;
    const weekIdAtRequest = this.weekId;

    try {
      const activeWeeks = await fetchActiveWeeks();
      const weeksToCheck = weekIdAtRequest
        ? activeWeeks.filter(week => week.id === weekIdAtRequest)
        : activeWeeks;
      const weekStatuses = await Promise.all(weeksToCheck.map(async week => ({
        id: week.id,
        week: week.week,
        voted: await this.hasVoted(week.id, profileAtRequest.id)
      })));

      // The profile or the week we're scoped to may have changed again while
      // these requests were in flight
      if (this.profile === profileAtRequest && this.weekId === weekIdAtRequest) {
        this.weekStatuses = weekStatuses;
      }
    } catch (error) {
      console.error('Failed to load vote status banners:', error);
    }
  }

  async hasVoted(weekId, participantId) {
    try {
      await fetchNomination({ weekId, participantId });
      return true;
    } catch (error) {
      return false;
    }
  }

  render() {
    if (!this.profile) {
      return html`
        <div class="stack">
          <gbbo-banner
            variant="confirmed"
            message="Make sure you have this week's picks:"
            ctaText="Log in"
            ctaHref="/vote"
          ></gbbo-banner>
        </div>
      `;
    }

    if (this.weekStatuses.length === 0) return html``;

    return html`
      <div class="stack">
        ${this.weekStatuses.map(status => status.voted ? html`
          <gbbo-banner
            variant="confirmed"
            message="✓ You've already voted."
            ctaText="View your picks"
            ctaHref="/vote"
          ></gbbo-banner>
        ` : html`
          <gbbo-banner
            variant="reminder"
            message="You're missing out on potential points!"
            ctaText="Vote now"
            ctaHref="/vote"
          ></gbbo-banner>
        `)}
      </div>
    `;
  }
}

customElements.define('gbbo-vote-status-banners', GBBOVoteStatusBanners);
