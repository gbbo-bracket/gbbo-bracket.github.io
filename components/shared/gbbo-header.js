import { LitElement, html, css } from 'lit';
import '../foundations/primary-button';

export class GBBOHeader extends LitElement {
  static properties = {
    mobileMenuOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.mobileMenuOpen = false;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background-color: rgba(255, 253, 245, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(247, 198, 217, 0.3);
      box-shadow: 0 4px 6px -1px rgba(33, 65, 119, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    
    .logo:hover {
      opacity: 0.8;
    }
    
    .emoji {
      font-size: 2rem;
    }
    
    .logo h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--heading-text);
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    
    .nav-links li {
      margin: 0;
    }
    
    .nav-links a {
      text-decoration: none;
      color: var(--link-text);
      font-weight: 500;
      font-size: 1.1rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    
    .nav-links a:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--link-text-on-hover);
    }
    
    .mobile-menu-button {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--heading-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
    
    .mobile-menu-button:hover {
      background-color: rgba(247, 198, 217, 0.2);
    }
    
    .mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: rgba(255, 253, 245, 0.98);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(247, 198, 217, 0.3);
      box-shadow: 0 4px 6px -1px rgba(33, 65, 119, 0.1);
      z-index: 999;
    }
    
    .mobile-menu.open {
      display: block;
    }
    
    .mobile-nav-links {
      list-style: none;
      margin: 0;
      padding: 1rem 0;
    }
    
    .mobile-nav-links li:not(.primary-button-container) {
      margin: 0;
    }

    .mobile-nav-links li.primary-button-container {
      margin: 1rem 2rem;
    }
    
    .mobile-nav-links a {
      display: block;
      text-decoration: none;
      color: var(--link-text);
      font-weight: 500;
      font-size: 1.1rem;
      padding: 1rem 2rem;
      transition: all 0.2s ease;
    }
    
    .mobile-nav-links a:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--link-text-on-hover);
    }
    
    /* Mobile styles */
    @media (max-width: 768px) {
      nav {
        height: 3.5rem;
        padding: 1rem;
      }
      
      .logo .emoji {
        font-size: 1.5rem;
      }
      
      .logo h1 {
        font-size: 1rem;
      }
      
      .nav-links {
        display: none;
      }
      
      .mobile-menu-button {
        display: block;
      }
    }
    
    @media (max-width: 640px) {
      .logo .emoji {
        font-size: 1.75rem;
      }
      
      .logo h1 {
        font-size: 1.25rem;
      }
    }
  `;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  render() {
    return html`
      <nav>
        <a href="/" class="logo">
          <div class="emoji">🧁</div>
          <h1>The Great Bake Off Bracket</h1>
        </a>
        
        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/rules">Rules</a></li>
          <li><a href="/contestants">Contestants</a></li>
          <li><primary-button href="/vote">Vote now</primary-button></li>
        </ul>
        
        <button 
          class="mobile-menu-button" 
          @click="${this.toggleMobileMenu}"
          aria-label="Toggle mobile menu"
        >
          ${this.mobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <div class="mobile-menu ${this.mobileMenuOpen ? 'open' : ''}">
          <ul class="mobile-nav-links">
            <li><a href="/" @click="${this.toggleMobileMenu}">Home</a></li>
            <li><a href="/rules" @click="${this.toggleMobileMenu}">Rules</a></li>
            <li><a href="/contestants" @click="${this.toggleMobileMenu}">Contestants</a></li>
            <li class="primary-button-container"><primary-button href="/vote" @click="${this.toggleMobileMenu}">Vote now</primary-button></li>
          </ul>
        </div>
      </nav>
    `;
  }
}

customElements.define('gbbo-header', GBBOHeader);