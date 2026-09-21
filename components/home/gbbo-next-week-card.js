import { LitElement, html, css } from 'lit';
import { airtableService } from '../../js/airtable-service.js';
import { US, REGION_CHANGE_EVENT, getRegion, getAirDate, parseAirDate } from '../../js/utils/region.js';
import '../foundations/primary-button.js';
import '../shared/gbbo-loading-container.js';
import '../shared/gbbo-callout.js';

export class GBBONextWeekCard extends LitElement {
  static properties = {
    nextWeek: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    countdownText: { type: String },
    region: { type: String }
  };

  constructor() {
    super();
    this.nextWeek = null;
    this.loading = false;
    this.error = '';
    this.countdownText = '';
    this.countdownInterval = null;
    this.region = getRegion();
    this.records = [];
    this.handleRegionChange = this.handleRegionChange.bind(this);
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
      text-align: center;
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
      display: inline-block;
      background: linear-gradient(135deg, var(--berry-red), var(--icing-pink));
      color: var(--body-text-on-dark);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
    }
    
    .countdown-label {
      font-size: 0.875rem;
      color: var(--body-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    .card-actions {
      display: flex;
      justify-content: center;
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
    this.fetchNextWeek();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(REGION_CHANGE_EVENT, this.handleRegionChange);
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  handleRegionChange(event) {
    this.region = event.detail.region;
    // The weeks are already loaded, so just pick the next one for the new region
    this.selectNextWeek();
  }

  async fetchNextWeek() {
    this.loading = true;
    this.error = '';
    
    try {
      console.log('Fetching next week data from Airtable...');
      this.records = await airtableService.fetchRecords('tblCV1RozeH3oz1DW');
      this.selectNextWeek();
      
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
    
    const upcomingWeeks = this.records
      .map(record => ({
        ...record,
        parsedAirDate: parseAirDate(getAirDate(record.data, this.region))
      }))
      .filter(record => {
        // Only include real dates that are today or in the future
        return !isNaN(record.parsedAirDate) && record.parsedAirDate >= today;
      })
      .sort((a, b) => a.parsedAirDate - b.parsedAirDate);
    
    // Get the next upcoming week (earliest future date)
    const nextWeek = upcomingWeeks[0];
    
    if (nextWeek) {
      this.nextWeek = nextWeek;
      this.error = '';
      console.log(`Next week data (${this.region}):`, nextWeek);
      this.startCountdown();
    } else {
      this.nextWeek = null;
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
      return;
    }

    const targetDate = this.getTargetDate();

    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
    const oneHourInMs = 60 * 60 * 1000;
    
    if (Math.abs(timeDiff) <= oneHourInMs) {
      this.countdownText = 'Episode is live!';
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let countdownParts = [];
    if (days > 0) countdownParts.push(`${days}d`);
    if (hours > 0) countdownParts.push(`${hours}h`);
    if (minutes > 0) countdownParts.push(`${minutes}m`);
    if (seconds > 0) countdownParts.push(`${seconds}s`);

    this.countdownText = countdownParts.join(' ') || '0s';
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

  renderNextWeek() {
    if (!this.nextWeek) {
      return html`
        <div class="next-week-card">
          <h2>That's all for now!</h2>
          <p>All weeks have been completed! Check back for the next season.</p>
        </div>
      `;
    }

    const { data } = this.nextWeek;
    const title = data.Title || '';
    const description = data.Description || '';
    const trailerUrl = data.Trailer || '';
    
    // Default: t7HMezGCWVw
    const youtubeId = trailerUrl ? this.extractYouTubeId(trailerUrl) : '';

    return html`
      <div class="next-week-card">
        <h2>${title ? title : 'Next Week: Coming Soon'}</h2>
        
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

        ${this.countdownText ? html`
          <div class="coming-soon-badge">Next episode in ${this.countdownText}</div>
        ` : ''}

        <div class="card-actions">
          <primary-button href="/vote">Vote now</primary-button>
        </div>
      </div>
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