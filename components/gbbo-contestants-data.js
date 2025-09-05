import { LitElement, html, css } from 'lit';
import './gbbo-loading-container.js';
import { fetchContestants } from '../js/utils/bakers.js';
import './gbbo-contestants-modal.js';

export class GBBOContestantsData extends LitElement {
  static properties = {
    records: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    selectedRecord: { type: Object },
    modalOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.records = [];
    this.loading = false;
    this.error = '';
    this.selectedRecord = null;
    this.modalOpen = false;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .data-container {
      background-color: rgba(255, 253, 245, 0.9);
      padding: 2rem;
      border-radius: 1rem;
      margin-top: 2rem;
      box-shadow: 0 10px 25px -5px rgba(33, 65, 119, 0.1);
      border: 1px solid rgba(247, 198, 217, 0.3);
    }
    
    .header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
        .header h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.875rem;
      color: var(--heading-text);
      margin: 0 0 0.5rem 0;
    }
    
    .header p {
      color: var(--body-text);
      margin: 0;
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
    
    .record-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-height: 400px;
      background-color: rgba(190, 228, 210, 0.1);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(169, 208, 245, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    
    .record-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(247, 198, 217, 0.2);
    }

    .record-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .record-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.75rem;
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

  openModal(record) {
    this.selectedRecord = record;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedRecord = null;
  }

  handleModalClose() {
    this.closeModal();
  }

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

  renderLoading() {
    return html`
      <gbbo-loading-container></gbbo-loading-container>
    `;
  }

  renderError() {
    return html`
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
    `;
  }

  renderEmptyState() {
    return html`
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
    `;
  }

  renderRecords() {
    return html`
      <div class="records-grid">
        ${this.records.map(record => html`
          <div class="record-card" @click="${() => this.openModal(record)}">
            <img class="record-image" src="${record.data.Image?.[0]?.url || ''}" alt="${record.data.Name || 'Contestant'}" />
            <p class="record-name">${record.data.Name || 'Unknown Contestant'}</p>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="data-container">
        <div class="header">
          <h3>Contestants</h3>
        </div>
        
        ${this.loading ? this.renderLoading() : ''}
        ${this.error ? this.renderError() : ''}
        ${!this.loading && !this.error && this.records.length === 0 ? this.renderEmptyState() : ''}
        ${!this.loading && !this.error && this.records.length > 0 ? this.renderRecords() : ''}
      </div>

      <gbbo-contestants-modal 
        .open="${this.modalOpen}"
        .contestant="${this.selectedRecord}"
        @modal-close="${this.handleModalClose}"
      ></gbbo-contestants-modal>
    `;
  }
}

customElements.define('gbbo-contestants-data', GBBOContestantsData); 