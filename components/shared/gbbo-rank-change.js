import { LitElement, html, css } from 'lit';

/**
 * A small "moved up / moved down" chip: ▲ 2 in green, ▼ 1 in pink.
 * `change` is how many places someone moved (positive = up, negative = down);
 * when it is 0 or missing nothing is shown at all.
 */
export class GBBORankChange extends LitElement {
  static properties = {
    change: { type: Number },
    label: { type: String }
  };

  static styles = css`
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    :host([hidden]) {
      display: none;
    }

    .move {
      display: inline-block;
      margin-left: 0.5rem;
      padding: 0.05rem 0.45rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .move.up {
      background: rgba(190, 228, 210, 0.6);
      color: #1f6b4a;
    }

    .move.down {
      background: rgba(247, 198, 217, 0.6);
      color: var(--berry-red);
    }
  `;

  constructor() {
    super();
    this.change = 0;
    this.label = 'Compared with the standings before this week';
  }

  render() {
    if (!this.change) return '';
    const up = this.change > 0;
    return html`<span class="move ${up ? 'up' : 'down'}" title="${this.label}">${up ? '▲' : '▼'} ${Math.abs(this.change)}</span>`;
  }
}

customElements.define('gbbo-rank-change', GBBORankChange);
