import { LitElement, html, css } from 'lit';
import './gbbo-loading-container.js';
import { fetchContestants } from '../js/utils/bakers.js';
import './gbbo-contestants-card.js';
import './foundations/card.js';

export class GBBOContestantsData extends LitElement {
  static properties = {
    records: { type: Array },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.records = [];
    this.loading = false;
    this.error = '';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .error {
      background-color: rgba(247, 198, 217, 0.1);
      border: 1px solid rgba(217, 76, 87, 0.3);
      color: var(--berry-red);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .error-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .records-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--body-text);
    }
    
    .empty-state .emoji {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .refresh-button {
      background-color: var(--mint-green);
      color: #214177;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: background-color 0.2s ease;
      margin-top: 1rem;
    }
    
    .refresh-button:hover {
      background-color: #A9D0F5;
    }
    
    .refresh-button:disabled {
      background-color: rgba(124, 116, 103, 0.2);
      cursor: not-allowed;
    }
    
    .record-count {
      text-align: center;
      color: #7C7467;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .data-container {
        padding: 1.5rem;
      }
      
      .header h3 {
        font-size: 1.5rem;
      }
      
      .records-grid {
        grid-template-columns: 1fr;
      }
    }
  `;


  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = '';
    
    try {
      this.records = await fetchContestants();
    } catch (error) {
      this.error = error.message;
      console.error('Failed to fetch Airtable data:', error);
    } finally {
      this.loading = false;
    }
  }

  async handleRefresh() {
    await this.fetchData();
  }

  render() {
    return html`
      <gbbo-card title="Contestants">
        ${this.loading ? html`
          <gbbo-loading-container></gbbo-loading-container>
        `  : ''}

        ${this.error ? html`
          <div class="error">
            <div class="error-title">Error Loading Data</div>
            <div>${this.error}</div>
            <button 
              class="refresh-button" 
              @click="${this.handleRefresh}"
              ?disabled="${this.loading}"
            >
              ${this.loading ? 'Loading...' : 'Try Again'}
            </button>
          </div>
        ` : ''}
        
        ${!this.loading && !this.error && this.records.length === 0 ? html`
          <div class="empty-state">
            <span class="emoji">🔍</span>
            <p>No contestants found</p>
            <button 
              class="refresh-button" 
              @click="${this.handleRefresh}"
              ?disabled="${this.loading}"
            >
              Refresh
            </button>
          </div>
        ` : ''}
        
        ${!this.loading && !this.error && this.records.length > 0 ? html`
          <div class="records-grid">
            ${this.records.map(record => html`
              <gbbo-contestants-card
                .contestant="${record}"
              ></gbbo-contestants-card>
            `)}
          </div>
        ` : ''}
      </gbbo-card>
    `;
  }
}

customElements.define('gbbo-contestants-data', GBBOContestantsData); 