import { LitElement, html, css } from 'lit';

export class GBBOFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1.5rem;
      color: #214177;
      font-style: italic;
      font-weight: 300;
    }
    
    p {
      font-size: 1.125rem;
    }
    
    @media (max-width: 640px) {
      p {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <footer>
        <p>Brought to you with love and a pinch of salt 🧂</p>
      </footer>
    `;
  }
}

customElements.define('gbbo-footer', GBBOFooter); 