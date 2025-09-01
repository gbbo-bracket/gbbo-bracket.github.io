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
      font-style: italic;
      font-weight: 300;
    }
    
    .bunting {
      width: 100%;
      height: 120px;
      margin: 0 auto 1rem auto;
      display: block;
      background-image: url('./images/bunting.png');
      background-repeat: repeat-x;
      background-position: center;
      background-size: auto 100%;
    }
    
    p {
      font-size: 1.125rem;
    }
    
    @media (max-width: 640px) {
      .bunting {
        height: 40px;
      }
      
      p {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <footer>
        <div class="bunting"></div>
      </footer>
    `;
  }
}

customElements.define('gbbo-footer', GBBOFooter); 