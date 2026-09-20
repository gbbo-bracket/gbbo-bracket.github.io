# GBBO Bracket 2025 🧁

Great British Bake Off Bracket 2025 - Built with **LitElement**.

## 🚀 Features

- **LitElement Components**: Modern, reactive web components using LitElement
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Web Components**: Native browser support with Shadow DOM
- **ES6 Modules**: Modern JavaScript with proper module system
- **Vite Build System**: Fast development server and optimized builds

## 🛠️ Tech Stack

- **LitElement 3.x**: For building reactive web components
- **Tailwind CSS 3.x**: For utility-first styling
- **Vite 5.x**: Fast build tool and development server
- **Vanilla JavaScript**: No heavy frameworks, just modern web standards
- **ES6 Modules**: Native browser module support

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm start
```

## 🏗️ Building

### GitHub Pages (Recommended)
This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://gbbo-bracket.github.io/`

### Manual Deployment
If you prefer to deploy manually:

1. Build the project: `npm run build:gh-pages`
2. The built files will be in the `dist/` directory
3. Push the contents of `dist/` to the `gh-pages` branch

### Local Testing
You can test the production build locally:

```bash
npm run build:gh-pages
npm run preview
```

## 📁 Project Structure

```
gbbo-bracket.github.io/
├── components/         # LitElement web components
│   ├── foundations/    # Shared building blocks (card, primary-button)
│   ├── shared/         # Header, footer, banners, loading states
│   └── home/ contestants/ finals/ join/ rules/ vote/   # Per-page components
├── js/
│   ├── main.js              # Main application logic
│   ├── airtable-service.js  # Reads and writes to Airtable
│   └── utils/               # Bakers, results, nominations, participants
├── src/
│   ├── input.css       # Tailwind CSS input
│   └── styles.css      # Colour palette and global styles
├── assets/images/      # Images served with the site
├── dist/               # Built files (auto-generated)
├── index.html          # Home page (one HTML file per page)
├── vite.config.js      # Vite configuration
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind theme and file scanning
└── package.json        # Dependencies and scripts
```

## 🌟 Why LitElement + Vite?

- Because I'm trying to learn them better

## 🚀 Getting Started with New Components

To create a new LitElement component:

```javascript
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  static properties = {
    myProperty: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div>Hello ${this.myProperty}!</div>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

## 🎨 Customization

- Modify component styles in the `static styles` property
- Add new reactive properties in `static properties`
- Use Tailwind CSS classes in your HTML templates
- Extend components with new methods and lifecycle hooks

## 🤝 Contributing

Our conventions - branch naming, PR expectations, project layout, the colour palette, and the
Airtable setup - live in [`.claude/skills/contributing/SKILL.md`](.claude/skills/contributing/SKILL.md),
which Claude Code also reads.

---

**Brought to you with love and a pinch of salt** 🧂