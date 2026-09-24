import { LitElement, html, css } from 'lit';

export class GBBOBanner extends LitElement {
  static properties = {
    message: { type: String },
    ctaText: { type: String },
    ctaHref: { type: String },
    // 'reminder' (default) or 'confirmed' - confirmed swaps in a checkmark and a calmer color
    variant: { type: String }
  };

  constructor() {
    super();
    this.message = 'Cast your vote for finalists before Week 2!';
    this.ctaText = 'Pick your finalists';
    this.ctaHref = '/finals';
    this.variant = 'reminder';
  }

  // Styled like gbbo-callout - a neutral box for a confirmed vote, with a
  // very light pink "warning" tint when the profile still needs to vote
  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .banner {
      padding: 1rem 1.5rem;
      background-color: rgba(255, 253, 245, 0.75);
      border: 1px solid rgba(247, 198, 217, 0.5);
      border-radius: 1rem;
      text-align: center;
      font-size: 1rem;
      color: var(--body-text);
    }

    .banner.reminder {
      background-color: rgba(247, 198, 217, 0.85);
    }

    .banner-checkmark {
      margin-right: 0.35rem;
    }

    a.banner-cta {
      color: var(--link-text);
      font-weight: 600;
      text-decoration: underline;
    }

    a.banner-cta:hover {
      color: var(--link-text-on-hover);
    }

    @media (max-width: 640px) {
      .banner {
        font-size: 0.9375rem;
        padding: 1rem;
      }
    }
  `;

  render() {
    return html`
      <div class="banner ${this.variant === 'confirmed' ? 'confirmed' : 'reminder'}">
        ${this.variant === 'confirmed' ? html`<span class="banner-checkmark" aria-hidden="true">✓</span>` : ''}
        ${this.message}
        ${this.ctaText && this.ctaHref ? html`
          <a class="banner-cta" href="${this.ctaHref}">${this.ctaText}</a>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('gbbo-banner', GBBOBanner);
