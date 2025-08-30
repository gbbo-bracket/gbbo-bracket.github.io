import { LitElement, html, css } from 'lit';
import { airtableService } from '../js/airtable-service.js';

export class GBBONextWeekCard extends LitElement {
  static properties = {
    nextWeek: { type: Object },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.nextWeek = null;
    this.loading = false;
    this.error = '';
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
    
    .loading, .error {
      padding: 2rem;
      text-align: center;
      color: #7C7467;
    }
    
    .error {
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

  renderLoading() {
    return html`
      <div class="next-week-card">
        <div class="loading">
          <p>Loading next week...</p>
        </div>
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

    return html`
      <div class="next-week-card">
        <div class="coming-soon-badge">Coming Up Next</div>
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