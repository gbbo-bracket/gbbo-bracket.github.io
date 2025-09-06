import { LitElement, html, css } from 'lit';

export class GBBOCard extends LitElement {
  static properties = {
    title: { type: String },
    body: { type: String },
    withBorder: { type: Boolean },
  };

  constructor() {
    super();
    this.title = '';
    this.body = '';
    this.withBorder = true;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .gbbo-card {
      background-color: rgba(255, 253, 245, 0.9);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.1);
      border: 1px solid rgba(247, 198, 217, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .gbbo-card--with-border::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--berry-red), var(--icing-pink), var(--powder-blue));
    }
    
    @media (max-width: 768px) {
      .gbbo-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .gbbo-card {
        padding: 1.5rem;
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: var(--heading-text);
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
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--heading-text);
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .title {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .title {
        font-size: 1.25rem;
      }
    }
    
    .body {
      font-size: 1.125rem;
      color: var(--body-text);
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      .body {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <div class="gbbo-card ${this.withBorder ? 'gbbo-card--with-border' : ''}">
        ${this.title ? html`<h2>${this.title}</h2>` : ''}
        ${this.body ? html`<p>${this.body}</p>` : ''}
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('gbbo-card', GBBOCard); 