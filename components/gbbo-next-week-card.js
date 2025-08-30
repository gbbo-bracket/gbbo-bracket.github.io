import { LitElement, html, css } from 'lit';
import './gbbo-loading-container.js';
import { airtableService } from '../js/airtable-service.js';

export class GBBONextWeekCard extends LitElement {
  static properties = {
    nextWeek: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    countdownText: { type: String }
  };

  constructor() {
    super();
    this.nextWeek = null;
    this.loading = false;
    this.error = '';
    this.countdownText = '';
    this.countdownInterval = null;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .next-week-card {
      margin-top: 2rem;
      background-color: rgba(255, 253, 245, 0.9);
      padding: 3rem;
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
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #D94C57, #F7C6D9, #A9D0F5);
    }
    
    @media (max-width: 768px) {
      .next-week-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .next-week-card {
        padding: 1.5rem;
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: #214177;
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
      color: #214177;
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
      color: #7C7467;
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      .week-description {
        font-size: 1rem;
      }
    }
    
    .video-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto 2rem;
      aspect-ratio: 16 / 9;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
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
      background: linear-gradient(135deg, #D94C57, #F7C6D9);
      color: #FFFDF5;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    
    .countdown-timer {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #214177;
      margin-bottom: 0.5rem;
    }
    
    .countdown-label {
      font-size: 0.875rem;
      color: #7C7467;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .countdown-timer {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .countdown-timer {
        font-size: 1.25rem;
      }
    }
    
    .error {
      padding: 2rem;
      text-align: center;
      color: #D94C57;
    }
    

    
    .retry-button {
      background-color: #D94C57;
      color: #FFFDF5;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
      transition: background-color 0.2s;
    }
    
    .retry-button:hover {
      background-color: #214177;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.fetchNextWeek();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  async fetchNextWeek() {
    this.loading = true;
    this.error = '';
    
    try {
      console.log('Fetching next week data from Airtable...');
      const records = await airtableService.fetchRecords('tblCV1RozeH3oz1DW');
      
      // Filter records with air dates and sort by air date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      const upcomingWeeks = records
        .filter(record => {
          const airDate = record.data['Air date'];
          return airDate && airDate !== '';
        })
        .map(record => ({
          ...record,
          parsedAirDate: new Date(record.data['Air date'])
        }))
        .filter(record => {
          // Only include dates that are today or in the future
          return record.parsedAirDate >= today;
        })
        .sort((a, b) => a.parsedAirDate - b.parsedAirDate);
      
      // Get the next upcoming week (earliest future date)
      const nextWeek = upcomingWeeks[0];
      
      if (nextWeek) {
        this.nextWeek = nextWeek;
        console.log('Next week data:', nextWeek);
      } else {
        this.error = 'No upcoming weeks found';
      }
      
    } catch (error) {
      this.error = error.message;
      console.error('Failed to fetch next week data:', error);
    } finally {
      this.loading = false;
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
    }
    
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    if (!this.nextWeek?.parsedAirDate) {
      this.countdownText = '';
      return;
    }

    // Create target date at 8PM GMT+1
    const airDate = new Date(this.nextWeek.parsedAirDate);
    const targetDate = new Date(airDate);
    targetDate.setHours(20, 0, 0, 0); // Set to 8PM
    
    // Convert to GMT+1 (CET/CEST)
    const gmtPlus1Offset = 1 * 60; // GMT+1 in minutes
    const targetDateGMTPlus1 = new Date(targetDate.getTime() - (gmtPlus1Offset * 60 * 1000));

    const now = new Date();
    const timeDiff = targetDateGMTPlus1.getTime() - now.getTime();
    const oneHourInMs = 60 * 60 * 1000;
    
    if (Math.abs(timeDiff) <= oneHourInMs) {
      this.countdownText = 'Episode is live!';
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
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
          <button class="retry-button" @click="${this.handleRefresh}">
            Retry
          </button>
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
    const title = data.Title || 'Upcoming Week';
    const description = data.Description || data.Summary || '';
    const trailerUrl = data['Trailer URL'] || data.Trailer || data['YouTube URL'] || '';
    
    const youtubeId = this.extractYouTubeId(trailerUrl);

    // Start countdown when we have the next week data
    if (!this.countdownInterval) {
      setTimeout(() => this.startCountdown(), 100);
    }

    return html`
      <div class="next-week-card">
      ${this.countdownText ? html`
        <div class="coming-soon-badge">Coming Up in ${this.countdownText}</div>
      ` : ''}
        
        <h2>${title}</h2>
        
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
        ` : ''}
        
        ${description ? html`
          <p class="week-description">${description}</p>
        ` : ''}
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
    
    return this.renderNextWeek();
  }
}

customElements.define('gbbo-next-week-card', GBBONextWeekCard); 