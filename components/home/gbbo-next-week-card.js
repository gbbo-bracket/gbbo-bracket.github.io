import { LitElement, html, css } from 'lit';
import { weeksData } from '../../js/data/weeks-data.js';
import { UK, US, REGION_CHANGE_EVENT, getRegion, getAirDate, parseAirDate } from '../../js/utils/region.js';
import { fetchWeekStandings } from '../../js/utils/nominations.js';
import { PROFILE_CHANGE_EVENT, getProfile } from '../../js/utils/profile.js';
import { VOTE_FORM_URL } from '../../js/utils/external-links.js';
import '../foundations/primary-button.js';
import '../shared/gbbo-loading-container.js';
import '../shared/gbbo-banner.js';
import '../shared/gbbo-callout.js';
import './gbbo-standings.js';

// Where to watch an episode once it has premiered, per region
const WATCH_LINKS = {
  [UK]: {
    name: 'Channel 4',
    href: 'https://www.channel4.com/programmes/the-great-british-bake-off',
    logo: './images/channel-4-logo.svg'
  },
  [US]: {
    name: 'Netflix',
    href: 'https://www.netflix.com/title/80063224',
    logo: './images/netflix-logo-thumb.png'
  }
};

export class GBBONextWeekCard extends LitElement {
  static properties = {
    nextWeek: { type: Object },
    previousWeek: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    countdownText: { type: String },
    premiered: { type: Boolean },
    showingPrevious: { type: Boolean },
    region: { type: String },
    weekStandings: { type: Array },
    profile: { type: Object },
    selectedWeekId: { type: String }
  };

  constructor() {
    super();
    this.nextWeek = null;
    this.previousWeek = null;
    this.loading = false;
    this.error = '';
    this.countdownText = '';
    this.premiered = false;
    this.showingPrevious = false;
    this.countdownInterval = null;
    this.region = getRegion();
    this.records = [];
    this.weekStandings = null;
    this.standingsWeekId = null;
    this.profile = getProfile();
    this.selectedWeekId = null;
    this.orderedWeeks = [];
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleProfileChange = this.handleProfileChange.bind(this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .next-week-card {
      background-color: rgba(255, 253, 245, 0.9);
      padding: 3rem;
      padding-left: calc(3rem + 6px);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.1);
      border: 1px solid rgba(247, 198, 217, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .next-week-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 6px;
      background: linear-gradient(180deg, var(--berry-red), var(--icing-pink), var(--powder-blue));
    }
    
    @media (max-width: 768px) {
      .next-week-card {
        padding: 2rem;
        padding-left: calc(2rem + 6px);
      }
    }
    
    @media (max-width: 640px) {
      .next-week-card {
        padding: 1.5rem;
        padding-left: calc(1.5rem + 6px);
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: var(--heading-text);
      margin-top: 0;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      h2 {
        font-size: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      h2 {
        font-size: 1.75rem;
      }
    }
    
    .week-title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--heading-text);
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .week-title {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .week-title {
        font-size: 1.25rem;
      }
    }
    
    .week-description {
      font-size: 1.125rem;
      color: var(--body-text);
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      .week-description {
        font-size: 1rem;
      }
    }
    
    .video-container,
    .placeholder-image {
      display: block;
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto 2rem;
      aspect-ratio: 16 / 9;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      object-fit: cover;
    }
    
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .coming-soon-badge {
      display: flex;
      gap: 8px;
      background-color: rgba(169, 208, 245, 0.35); /* --powder-blue, softened */
      color: var(--royal-blue);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .countdown-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    a.coming-soon-badge {
      align-items: center;
      text-decoration: none;
    }

    .coming-soon-badge img {
      height: 1.5rem;
      width: auto;
    }

    .countdown-label {
      font-size: 0.875rem;
      color: var(--body-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .week-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }

    .week-nav-button {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: none;
      border: 1px solid var(--powder-blue);
      border-radius: 2rem;
      padding: 0.375rem 0.875rem;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--royal-blue);
      cursor: pointer;
    }

    .week-nav-button:hover,
    .week-nav-button:focus-visible {
      background-color: rgba(169, 208, 245, 0.35);
    }

    .spoiler-banner {
      background-color: var(--icing-pink);
      color: var(--royal-blue);
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .card-actions {
      display: flex;
      justify-content: center;
    }

    gbbo-standings {
      display: block;
      margin-top: 2.5rem;
    }

    .error {
      padding: 2rem;
      text-align: center;
      color: var(--berry-red);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
    window.addEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
    this.fetchNextWeek();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
    window.removeEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  handleRegionChange(event) {
    this.region = event.detail.region;
    // The weeks are already loaded, so just pick the next one for the new region
    this.selectNextWeek();
  }

  handleProfileChange(event) {
    this.profile = event.detail.profile;
  }

  // The week currently on display - either the upcoming one, or the one that
  // just aired when we're still showing it in place of a far-off countdown
  get currentWeek() {
    return this.showingPrevious && this.previousWeek ? this.previousWeek : this.nextWeek;
  }

  // The week on display: whichever one the viewer navigated to, otherwise the current one
  get displayWeek() {
    const selected = this.selectedWeekId && this.orderedWeeks.find(week => week.id === this.selectedWeekId);
    return selected || this.currentWeek;
  }

  get displayIndex() {
    const week = this.displayWeek;
    return this.orderedWeeks.findIndex(candidate => candidate.id === week?.id);
  }

  // Short label for the arrows, e.g. "Week 2" from "Week 2: Biscuit Week"
  weekLabel(week) {
    const title = week.data.Title || '';
    return title.match(/^Week \d+/i)?.[0] || title || 'Week';
  }

  goToWeek(week) {
    // Heading back to the current week drops the override so the countdown resumes
    this.selectedWeekId = week.id === this.currentWeek?.id ? null : week.id;
  }

  updated(changedProperties) {
    if (changedProperties.has('nextWeek') || changedProperties.has('previousWeek') || changedProperties.has('showingPrevious') || changedProperties.has('selectedWeekId')) {
      this.loadWeekStandings();
    }
  }

  // Picks and points only exist once someone has voted for the displayed
  // week, so the standings card stays hidden until there's something to show
  async loadWeekStandings() {
    const week = this.displayWeek;

    if (!week) {
      this.weekStandings = null;
      this.standingsWeekId = null;
      return;
    }

    if (week.id === this.standingsWeekId) return;
    this.standingsWeekId = week.id;
    this.weekStandings = null;

    try {
      const standings = await fetchWeekStandings(week.id);
      // A different week may have started loading while this fetch was in flight
      if (this.standingsWeekId === week.id) this.weekStandings = standings;
    } catch (error) {
      console.error('Failed to load week standings for next-week card:', error);
      if (this.standingsWeekId === week.id) this.weekStandings = null;
    }
  }

  async fetchNextWeek() {
    this.loading = true;
    this.error = '';
    
    try {
      this.records = weeksData;
      this.selectNextWeek();
      // Wait for the vote-status/standings data too, so the card doesn't
      // render its first pass with viewerHasVoted still false and then flash
      // to the correct banner once this resolves a moment later
      await this.loadWeekStandings();
    } catch (error) {
      this.error = error.message;
      console.error('Failed to fetch next week data:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Pick the next episode to show, using the air dates for the selected region
   */
  selectNextWeek() {
    // Filter records with air dates and sort by air date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    const weeksWithDates = this.records
      .map(record => ({
        ...record,
        parsedAirDate: parseAirDate(getAirDate(record.data, this.region))
      }))
      .filter(record => !isNaN(record.parsedAirDate));

    // Get the next upcoming week (earliest date today or later)
    const nextWeek = weeksWithDates
      .filter(record => record.parsedAirDate >= today)
      .sort((a, b) => a.parsedAirDate - b.parsedAirDate)[0];

    // Get the most recently aired week (latest date before today), used when
    // the next episode hasn't been picked yet - see updateCountdown()
    const previousWeek = weeksWithDates
      .filter(record => record.parsedAirDate < today)
      .sort((a, b) => b.parsedAirDate - a.parsedAirDate)[0];

    this.previousWeek = previousWeek || null;
    this.orderedWeeks = [...weeksWithDates].sort((a, b) => a.parsedAirDate - b.parsedAirDate);

    if (nextWeek) {
      this.nextWeek = nextWeek;
      this.error = '';
      console.log(`Next week data (${this.region}):`, nextWeek);
      this.startCountdown();
    } else {
      this.nextWeek = null;
      this.showingPrevious = false;
      this.countdownText = '';
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }
  }

  async handleRefresh() {
    await this.fetchNextWeek();
  }

  extractYouTubeId(url) {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  }

  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  /**
   * When the next episode actually drops. UK episodes premiere at 8PM GMT+1;
   * US episodes land at midnight local time.
   * @returns {Date} The moment the countdown is counting down to
   */
  getTargetDate() {
    const targetDate = new Date(this.nextWeek.parsedAirDate);

    if (this.region === US) {
      // Already midnight local on the air date
      return targetDate;
    }

    targetDate.setHours(20, 0, 0, 0); // Set to 8PM
    
    // Convert to GMT+1 (CET/CEST)
    const gmtPlus1Offset = 1 * 60; // GMT+1 in minutes
    return new Date(targetDate.getTime() - (gmtPlus1Offset * 60 * 1000));
  }

  updateCountdown() {
    if (!this.nextWeek?.parsedAirDate) {
      this.countdownText = '';
      this.premiered = false;
      this.showingPrevious = false;
      return;
    }

    const targetDate = this.getTargetDate();

    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
    this.premiered = timeDiff <= 0;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // Episodes air weekly, ~7 days apart. If the next one is still more than
    // 6 days out, the previous episode aired less than 24 hours ago - show
    // that episode instead of counting down to the following week.
    if (timeDiff > 6 * oneDayInMs && this.previousWeek) {
      this.showingPrevious = true;
      this.countdownText = '';
      return;
    }
    this.showingPrevious = false;

    // The premiere has already happened - nothing left to count down to
    if (timeDiff <= 0) {
      this.countdownText = 'Watch now';
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      return;
    }

    // More than a day out, a day-level count reads calmer than a ticking
    // clock - drop straight to "X days" instead of the full breakdown
    if (timeDiff > oneDayInMs) {
      const days = Math.floor(timeDiff / oneDayInMs);
      this.countdownText = `Next episode in ${days} day${days === 1 ? '' : 's'}`;
      return;
    }

    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let countdownParts = [];
    if (hours > 0) countdownParts.push(`${hours}h`);
    if (minutes > 0) countdownParts.push(`${minutes}m`);
    if (seconds > 0) countdownParts.push(`${seconds}s`);

    this.countdownText = `Next episode in ${countdownParts.join(' ') || '0s'}`;
  }

  /**
   * The countdown badge - once the episode has premiered, the whole badge
   * links out to where it can be watched in the selected region
   */
  renderBadge() {
    if (!this.premiered) {
      return html`<div class="coming-soon-badge">${this.countdownText}</div>`;
    }

    const { name, href, logo } = WATCH_LINKS[this.region] || WATCH_LINKS[US];
    return html`
      <a class="coming-soon-badge" href="${href}" target="_blank" rel="noopener noreferrer">
        <img src="${logo}" alt="Watch on ${name}">
        ${this.countdownText}
      </a>
    `;
  }

  renderLoading() {
    return html`
      <div class="next-week-card">
        <gbbo-loading-container></gbbo-loading-container>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="next-week-card">
        <div class="error">
          <p>Error: ${this.error}</p>
          <primary-button @click="${this.handleRefresh}">
            Retry
          </primary-button>
        </div>
      </div>
    `;
  }

  // Arrows to step back through earlier weeks, and forward again up to the current one
  renderWeekNav() {
    const index = this.displayIndex;
    const currentIndex = this.orderedWeeks.findIndex(week => week.id === this.currentWeek?.id);
    if (index < 0) return '';

    const previous = index > 0 ? this.orderedWeeks[index - 1] : null;
    const next = index < currentIndex ? this.orderedWeeks[index + 1] : null;
    if (!previous && !next) return '';

    return html`
      <nav class="week-nav" aria-label="Browse weeks">
        ${previous ? html`
          <button class="week-nav-button" @click="${() => this.goToWeek(previous)}" aria-label="Go to ${this.weekLabel(previous)}">
            <span aria-hidden="true">←</span> ${this.weekLabel(previous)}
          </button>
        ` : ''}
        ${next ? html`
          <button class="week-nav-button" @click="${() => this.goToWeek(next)}" aria-label="Go to ${this.weekLabel(next)}">
            ${this.weekLabel(next)} <span aria-hidden="true">→</span>
          </button>
        ` : ''}
      </nav>
    `;
  }

  // The countdown badge on the left and the week arrows on the right
  renderCountdownRow(displayWeek) {
    const showBadge = this.countdownText && displayWeek === this.currentWeek;
    const nav = this.renderWeekNav();
    if (!showBadge && !nav) return '';

    return html`
      <div class="countdown-row">
        ${showBadge ? this.renderBadge() : ''}
        ${nav}
      </div>
    `;
  }

  renderNextWeek() {
    if (!this.nextWeek) {
      return html`
        <div class="next-week-card">
          <h2>That's all for now!</h2>
          <p>All weeks have been completed! Check back for the next season.</p>
        </div>
      `;
    }

    const displayWeek = this.displayWeek;
    const { data } = displayWeek;
    const title = data.Title || '';
    const description = data.Description || '';
    const trailerUrl = data.Trailer || '';
    
    // Default: t7HMezGCWVw
    const youtubeId = trailerUrl ? this.extractYouTubeId(trailerUrl) : '';

    return html`
      <div class="next-week-card">
        ${this.renderCountdownRow(displayWeek)}

        <h2>${title ? title : 'Next Week: Coming Soon'}</h2>

        ${this.renderVoteStatusBanner(displayWeek)}

        ${description ? html`
          <p class="week-description">${description}</p>
        ` : ''}

        ${youtubeId ? html`
          <div class="video-container">
            <iframe 
              src="https://www.youtube.com/embed/${youtubeId}"
              title="GBBO Week Trailer"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        ` : html`
          <img class="placeholder-image" src="./images/series-17.jpg" alt="GBBO Week Trailer">
        `}

        ${this.renderWeekStandings(displayWeek)}
      </div>
    `;
  }

  // Whether the current profile has already made their picks for the
  // displayed week - checked from the fetched standings themselves rather
  // than a separate lookup, since a real (non-Finals) nomination always
  // fills in all three pick fields together
  get viewerHasVoted() {
    if (!this.profile || !this.weekStandings) return false;
    const own = this.weekStandings.find(participant => participant.id === this.profile.id);
    return !!own?.picks;
  }

  // Nags the current profile to vote for the displayed week, or confirms
  // they already have - reuses the standings fetch above instead of looking
  // up the viewer's own nomination separately
  renderVoteStatusBanner(displayWeek) {
    if (!this.weekStandings || this.standingsWeekId !== displayWeek.id) return '';

    return this.viewerHasVoted ? html`
      <gbbo-banner
        variant="confirmed"
        message="✓ You've already voted."
        ctaText="View your picks"
        ctaHref="${VOTE_FORM_URL}"
      ></gbbo-banner>
    ` : html`
      <gbbo-banner
        variant="reminder"
        message="Don't miss out on potential points!"
        ctaText="Vote now"
        ctaHref="${VOTE_FORM_URL}"
      ></gbbo-banner>
    `;
  }

  // Only worth showing once someone has actually voted for this week -
  // otherwise it's just an empty table of zero points and "No vote yet"
  renderWeekStandings(displayWeek) {
    if (!this.weekStandings || this.standingsWeekId !== displayWeek.id) return '';
    if (!this.weekStandings.some(participant => participant.picks || participant.points > 0)) return '';

    // Picks are a spoiler for anyone who hasn't voted yet, so everyone
    // else's stay hidden until the viewer has made their own
    const viewerHasVoted = this.viewerHasVoted;
    const standings = viewerHasVoted ? this.weekStandings : this.weekStandings.map(participant => ({
      ...participant,
      picks: participant.id === this.profile?.id ? participant.picks : null
    }));

    return html`
    ${viewerHasVoted ?
        html`
          <gbbo-standings
            .standings="${standings}"
          ></gbbo-standings>
        ` : html`
          <gbbo-banner
            variant="confirmed"
            message="You must vote to see everyone's picks this week."
            ctaText="Vote now"
            ctaHref="${VOTE_FORM_URL}"
          ></gbbo-banner>
        `}
    `;
  }

  render() {
    if (this.loading) {
      return this.renderLoading();
    }
    
    if (this.error) {
      return this.renderError();
    }
    
    return html`
      ${this.renderNextWeek()}
    `;
  }
}

customElements.define('gbbo-next-week-card', GBBONextWeekCard); 