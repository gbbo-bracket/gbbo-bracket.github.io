import { LitElement, html, css } from 'lit';
import '../shared/gbbo-loading-container.js';

/**
 * The shared standings table: the title and subtitle, the loading and error
 * states, and a rank / participant / ... table that turns into stacked cards
 * on phones. It is a base class instead of a standalone element so each kind
 * of standings (see gbbo-final-standings and gbbo-weekly-standings) can add
 * its own cell styles - those cells are rendered inside this shadow root, so
 * styles from outside it would not reach them.
 *
 * Subclasses provide `columns` and add their own `static styles`, e.g.
 *   static styles = [GBBOStandingsTable.styles, css`...`];
 * Each column is { label, className, cellClass?(participant, index),
 * render(participant, index) }. The className is the cell's class, which is what the phone layout uses
 * to order the cells (see the .rank / .participant-name / .points rules).
 */
export class GBBOStandingsTable extends LitElement {
  static properties = {
    standings: { type: Array },
    title: { type: String },
    description: { type: String },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.standings = null;
    this.title = '';
    this.description = '';
    this.loading = true;
    this.error = null;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 4xl;
    }

    .standings-container {
      width: 100%;
    }

    .standings-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .standings-title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      font-weight: 700;
      color: var(--heading-text);
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .standings-subtitle {
      font-size: 1.25rem;
      color: var(--body-text);
      margin-bottom: 2rem;
    }

    .standings-table {
      background-color: rgba(255, 253, 245, 0.9);
      backdrop-filter: blur(8px);
      border-radius: 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(33, 65, 119, 0.1), 0 10px 10px -5px rgba(33, 65, 119, 0.04);
      overflow: hidden;
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--heading-text);
      font-weight: 600;
      padding: 1.5rem 2rem;
      text-align: left;
      font-size: 1.1rem;
      border-bottom: 2px solid rgba(247, 198, 217, 0.3);
    }

    th.rank {
      text-align: center;
      width: 80px;
    }

    th.points {
      text-align: center;
      width: 120px;
    }

    td {
      padding: 1.25rem 2rem;
      border-bottom: 1px solid rgba(190, 228, 210, 0.3);
      transition: background-color 0.2s ease;
    }

    tr:hover td {
      background-color: rgba(190, 228, 210, 0.1);
    }

    tr:last-child td {
      border-bottom: none;
    }

    .rank {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--heading-text);
      text-align: center;
    }

    .participant-name {
      font-weight: 600;
      color: var(--body-text);
      font-size: 1.1rem;
    }

    .points {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--heading-text);
      text-align: center;
    }

    .error {
      text-align: center;
      padding: 3rem;
      color: var(--berry-red);
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .standings-title {
        font-size: 2.25rem;
      }

      .standings-subtitle {
        font-size: 1.1rem;
      }

      th, td {
        padding: 1rem;
        font-size: 0.95rem;
      }

      .standings-title {
        font-size: 2rem;
      }
    }

    /* Below the breakpoint there isn't room for a row of columns, so each
       participant becomes its own stacked card: rank, name and points on one
       line, anything else (like picks) wrapping onto its own line below. */
    @media (max-width: 640px) {
      .standings-title {
        font-size: 1.75rem;
      }

      thead {
        display: none;
      }

      table, tbody {
        display: block;
        width: 100%;
      }

      tr {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        column-gap: 0.75rem;
        row-gap: 0.5rem;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid rgba(190, 228, 210, 0.3);
      }

      tr:last-child {
        border-bottom: none;
      }

      td {
        display: block;
        padding: 0;
        border-bottom: none;
        font-size: 0.9rem;
      }

      .rank {
        order: 1;
        width: auto;
      }

      .participant-name {
        order: 2;
        font-size: 1rem;
      }

      .points {
        order: 3;
        margin-left: auto;
      }
    }
  `;

  // Overridden by each kind of standings
  get columns() {
    return [];
  }

  // Anything rendered outside the table, e.g. a modal
  renderExtras() {
    return '';
  }

  renderHeader() {
    return html`
      <div class="standings-header">
        <h1 class="standings-title">${this.title}</h1>
        <p class="standings-subtitle">${this.description}</p>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="standings-container">
          ${this.renderHeader()}
          <div class="glass-card">
            <gbbo-loading-container></gbbo-loading-container>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="standings-container">
          ${this.renderHeader()}
          <div class="glass-card">
            <div class="error">${this.error}</div>
          </div>
        </div>
      `;
    }

    const columns = this.columns;

    return html`
      <div class="standings-container">
        ${this.renderHeader()}

        <div class="glass-card standings-table">
          <table>
            <thead>
              <tr>${columns.map(column => html`<th class="${column.className}">${column.label}</th>`)}</tr>
            </thead>
            <tbody>
              ${this.standings.map((participant, index) => html`
                <tr>
                  ${columns.map(column => html`
                    <td class="${column.className} ${column.cellClass?.(participant, index) ?? ''}">${column.render(participant, index)}</td>
                  `)}
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
      ${this.renderExtras()}
    `;
  }
}
