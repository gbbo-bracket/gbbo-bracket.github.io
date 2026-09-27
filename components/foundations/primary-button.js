import { LitElement, html, css } from 'lit';

export class PrimaryButton extends LitElement {
  static properties = {
    href: { type: String },
    target: { type: String },
    disabled: { type: Boolean },
    type: { type: String }
  };

  constructor() {
    super();
    this.href = '';
    this.target = '';
    this.disabled = false;
    this.type = 'button';
  }

  static styles = css`
    .primary-button {
      background-color: var(--berry-red);
      color: var(--body-text-on-dark);
      font-weight: 600;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      box-shadow: 0 2px 4px rgba(217, 76, 87, 0.2);
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
    }

    .primary-button:hover {
      background-color: var(--royal-blue);
      color: var(--body-text-on-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(33, 65, 119, 0.3);
      cursor: pointer;
    }
  `;

  render() {
    if (this.href) {
      return html`
        <a 
          class="primary-button" 
          href="${this.href}"
          target="${this.target}"
          ?disabled="${this.disabled}"
        >
          <slot></slot>
        </a>
      `;
    } else {
       return html`
          <button 
            class="primary-button" 
            type="${this.type}"
            ?disabled="${this.disabled}"
          >
            <slot></slot>
          </button>
        `;
    }
  }
}

customElements.define('primary-button', PrimaryButton); 