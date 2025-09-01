// Import Tailwind CSS
import '../src/input.css';
import '../src/styles.css';

// Import all LitElement web components
import '../components/foundations/primary-button.js';
import '../components/gbbo-header.js';
import '../components/gbbo-welcome-card.js';
import '../components/gbbo-next-week-card.js';
import '../components/gbbo-contestants-data.js';
import '../components/gbbo-rules-card.js';
import '../components/gbbo-standings.js';
import '../components/gbbo-footer.js';

// Main application class
class GBBOApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('🧁 GBBO Bracket 2025 - Ready to bake with LitElement!');
    
    // Add any additional initialization logic here
    this.addEventListeners();
  }

  addEventListeners() {
    // Add any global event listeners here
    document.addEventListener('click', (e) => {
      // Handle any global clicks if needed
    });
  }
}

// Initialize the app
new GBBOApp(); 