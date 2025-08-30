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
├── components/           # LitElement web components
│   ├── gbbo-header.js
│   ├── gbbo-welcome-card.js
│   └── gbbo-footer.js
├── js/
│   └── main.js         # Main application logic
├── src/
│   └── input.css       # Tailwind CSS input
├── dist/               # Built files (auto-generated)
├── index.html          # Main HTML file
├── vite.config.js      # Vite configuration
├── postcss.config.js   # PostCSS configuration
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

1. Fork the repository
2. Create a feature branch
3. Make your changes using LitElement patterns
4. Test your components with `npm run dev`
5. Submit a pull request

---

**Brought to you with love and a pinch of salt** 🧂