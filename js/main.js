// Import Tailwind CSS
import '../src/input.css';
import '../src/styles.css';

// Import all LitElement web components
// Foundations
import '../components/foundations/card.js';
import '../components/foundations/primary-button.js';
// GBBO Components
import '../components/shared/gbbo-header.js';
import '../components/home/gbbo-welcome-card.js';
import '../components/home/gbbo-next-week-card.js';
import '../components/contestants/gbbo-contestants-data.js';
import '../components/rules/gbbo-rules-card.js';
import '../components/home/gbbo-standings.js';
import '../components/shared/gbbo-footer.js';
import '../components/vote/gbbo-vote.js';
import '../components/finals/gbbo-finals.js';
import '../components/join/gbbo-join.js';
import '../components/shared/gbbo-banner.js';

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