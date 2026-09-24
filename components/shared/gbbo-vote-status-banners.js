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
    // [{ id, week, voted }] for each active week
    weekStatuses: { type: Array }
  };

  constructor() {
    super();
    this.profile = getProfile();
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

    try {
      const activeWeeks = await fetchActiveWeeks();
      const weekStatuses = await Promise.all(activeWeeks.map(async week => ({
        id: week.id,
        week: week.week,
        voted: await this.hasVoted(week.id, profileAtRequest.id)
      })));

      // The profile may have changed again while these requests were in flight
      if (this.profile === profileAtRequest) this.weekStatuses = weekStatuses;
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
            variant="reminder"
            message="Log in to make sure you have this week's picks."
            ctaText="Vote now"
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
            message="You've already voted for ${status.week}."
            ctaText="View your picks"
            ctaHref="/vote"
          ></gbbo-banner>
        ` : html`
          <gbbo-banner
            variant="reminder"
            message="Don't forget to vote for ${status.week}!"
            ctaText="Vote now"
            ctaHref="/vote"
          ></gbbo-banner>
        `)}
      </div>
    `;
  }
}

customElements.define('gbbo-vote-status-banners', GBBOVoteStatusBanners);
