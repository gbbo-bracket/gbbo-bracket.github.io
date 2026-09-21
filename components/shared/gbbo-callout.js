import { LitElement, html, css } from 'lit';

/**
 * A slim pill of text that sits under a card and points visitors somewhere
 * else on the site. The message comes first and the link closes it out:
 *
 *   <gbbo-callout
 *     message="Missed a week? Don't get spoiled!"
 *     link-text="Vote now"
 *     link-href="/vote"
 *   ></gbbo-callout>
 *
 * The link is rendered inside the component rather than slotted in, so it
 * looks the same whether the callout is used from an HTML page or from
 * inside another component.
 */
export class GBBOCallout extends LitElement {
  static properties = {
    message: { type: String },
    linkText: { type: String, attribute: 'link-text' },
    linkHref: { type: String, attribute: 'link-href' }
  };

  constructor() {
    super();
    this.message = '';
    this.linkText = '';
    this.linkHref = '';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      padding: 1rem 1.5rem;
      background-color: rgba(255, 253, 245, 0.75);
      border: 1px solid rgba(247, 198, 217, 0.5);
      border-radius: 1rem;
      text-align: center;
      font-size: 1rem;
      color: var(--body-text);
    }

    a {
      color: var(--link-text);
      font-weight: 600;
      text-decoration: underline;
    }

    a:hover {
      color: var(--link-text-on-hover);
    }

    @media (max-width: 640px) {
      :host {
        font-size: 0.9375rem;
        padding: 1rem;
      }
    }
  `;

  render() {
    return html`
      ${this.message}
      ${this.linkText && this.linkHref ? html`
        <a href="${this.linkHref}">${this.linkText}</a>
      ` : ''}
    `;
  }
}

customElements.define('gbbo-callout', GBBOCallout);
