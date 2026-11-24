import { css, html } from 'lit';
import { GBBOWeeklyStandings } from './gbbo-weekly-standings.js';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The weekly standings card with a rank column, plus an animation: whenever
 * the standings change (the "what if" scenarios on the Finals page), each
 * row slides from its old slot to its new one and flashes green (moved up)
 * or pink (moved down). Rows are keyed by participant, so the same row
 * element travels instead of its contents being swapped in place.
 *
 * `baselineOrder` is the list of names in the real standings; a participant
 * who sits somewhere else than that gets a ▲/▼ chip showing how far they moved.
 */
export class GBBOFinalsStandings extends GBBOWeeklyStandings {
  static properties = {
    ...GBBOWeeklyStandings.properties,
    baselineOrder: { type: Array }
  };

  static styles = [
    GBBOWeeklyStandings.styles,
    css`
      tbody tr {
        position: relative;
      }

      .move {
        display: inline-block;
        margin-left: 0.5rem;
        padding: 0.05rem 0.45rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        vertical-align: middle;
      }

      .move.up {
        background: rgba(190, 228, 210, 0.6);
        color: #1f6b4a;
      }

      .move.down {
        background: rgba(247, 198, 217, 0.6);
        color: var(--berry-red);
      }
    `
  ];

  constructor() {
    super();
    this.baselineOrder = [];
    this.previousTops = null;
  }

  // Remember where every row is right now, before Lit moves them
  willUpdate(changed) {
    super.willUpdate(changed);
    if (changed.has('standings') && this.renderRoot?.querySelector) {
      this.previousTops = new Map(
        [...this.renderRoot.querySelectorAll('tbody tr[data-key]')]
          .map(row => [row.dataset.key, row.getBoundingClientRect().top])
      );
    }
  }

  updated(changed) {
    if (!this.previousTops || prefersReducedMotion()) {
      this.previousTops = null;
      return;
    }

    this.renderRoot.querySelectorAll('tbody tr[data-key]').forEach(row => {
      const before = this.previousTops.get(row.dataset.key);
      if (before === undefined) return;
      const shift = before - row.getBoundingClientRect().top;
      if (Math.abs(shift) < 1) return;

      // shift > 0: the row used to sit lower, so it moved up the table
      const flash = shift > 0 ? 'rgba(190, 228, 210, 0.7)' : 'rgba(247, 198, 217, 0.7)';
      row.animate([
        { transform: `translateY(${shift}px)`, backgroundColor: flash, zIndex: 1 },
        { transform: 'translateY(0)', backgroundColor: flash, zIndex: 1, offset: 0.7 },
        { transform: 'translateY(0)', backgroundColor: 'rgba(0,0,0,0)', zIndex: 1 }
      ], { duration: 1800, easing: 'cubic-bezier(0.22, 0.8, 0.25, 1)' });
    });
    this.previousTops = null;
  }

  // 1, 2, 2, 4 ... - participants on the same total share a rank
  get ranks() {
    const totals = this.standings.map(p => p.total ?? 0);
    return totals.map(total => totals.filter(other => other > total).length + 1);
  }

  renderMove(participant) {
    const before = this.baselineOrder.indexOf(participant.name);
    const now = this.standings.findIndex(p => p.name === participant.name);
    const delta = before - now;
    if (before < 0 || delta === 0) return '';
    return html`<span class="move ${delta > 0 ? 'up' : 'down'}" title="Compared with the standings right now">${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}</span>`;
  }

  get columns() {
    const ranks = this.ranks;
    const [name, ...rest] = super.columns;
    return [
      { label: '#', className: 'rank', render: (participant, index) => ranks[index] },
      { ...name, render: participant => html`${participant.name}${this.renderMove(participant)}` },
      ...rest
    ];
  }
}

customElements.define('gbbo-finals-standings', GBBOFinalsStandings);
