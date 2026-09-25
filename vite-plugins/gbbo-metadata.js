/**
 * <gbbo-metadata> - the shared <head> component.
 *
 * Every page drops a single tag in its <head>, and this Vite plugin swaps it
 * for the full block of title, description, robots, Open Graph and Twitter
 * tags:
 *
 *   <gbbo-metadata
 *     title="Vote Now!"
 *     description="A fun line about this page."
 *   ></gbbo-metadata>
 *
 * A page says only what is different about itself - its name and its blurb.
 * Everything else lives in the constants below, so all eight pages share one
 * share image, one site name and one set of tags. Leave either attribute off
 * and the fallback is used.
 *
 * It is a build-time component rather than a LitElement one on purpose.
 * Facebook, Slack, iMessage, X and search crawlers do not run our JavaScript,
 * and `js/main.js` is a deferred module at the bottom of <body>, so anything a
 * web component wrote into <head> would land long after they had given up.
 * Expanding the tag while the HTML is built means the finished page ships with
 * real, static meta tags in it.
 */

/** Where the site lives, so share links and images can be absolute */
const SITE_URL = 'https://gbbo-bracket.github.io';

/** The name every page title starts with */
const SITE_NAME = 'Great Bake Off Bracket';

/** Said about the site when a page does not describe itself */
const DEFAULT_DESCRIPTION =
  'On your marks, get set... vote! Pick your bakers, collect your points, and watch the leaderboard rise and fall each week.';

/**
 * The picture that shows up when anyone shares a link.
 *
 * The series 17 cast photo is 1200x672 - close enough to the 1.91:1 that
 * Facebook, LinkedIn and X all crop to, so nobody loses their head in the
 * preview.
 */
const SHARE_IMAGE = {
  url: `${SITE_URL}/images/series-17.jpg`,
  type: 'image/jpeg',
  width: '1200',
  height: '672',
  alt: 'The bakers of this series of the Great British Bake Off'
};

/** The cupcake avatar, for browser tabs and phone home screens */
const ICON = '/images/gbbo-avatar.jpg';

/** Icing pink, for the browser chrome on mobile */
const THEME_COLOR = '#F7C6D9';

/** Matches the tag in the page, whether it is closed properly or self-closed */
const TAG_PATTERN = /[ \t]*<gbbo-metadata\b([^>]*?)\/?>(?:\s*<\/gbbo-metadata>)?[ \t]*\n?/gi;

/** The two things a page gets to set, single or double quoted */
const ATTRIBUTE_PATTERN = /(title|description)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

/**
 * Pull the title and description off a `<gbbo-metadata>` tag
 * @param {string} attributeString - Everything between the tag name and the `>`
 * @returns {{title?: string, description?: string}} Whatever the page set
 */
function parseAttributes(attributeString = '') {
  const attributes = {};
  let match;

  ATTRIBUTE_PATTERN.lastIndex = 0;
  while ((match = ATTRIBUTE_PATTERN.exec(attributeString)) !== null) {
    const [, name, doubleQuoted, singleQuoted] = match;
    attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted;
  }

  return attributes;
}

/**
 * Make a value safe to sit inside a double-quoted HTML attribute
 * @param {string} value - The raw value
 * @returns {string} The escaped value
 */
function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Turn an HTML file name into the URL visitors actually see
 *
 * GitHub Pages serves `vote.html` at `/vote`, which is what the nav links to,
 * so the canonical and share URLs should say the same thing.
 * @param {string} htmlPath - The page being built, e.g. `/vote.html`
 * @returns {string} The absolute URL, e.g. `https://gbbo-bracket.github.io/vote`
 */
function toPageUrl(htmlPath = '/index.html') {
  const fileName = htmlPath.replace(/^.*\//, '').replace(/\.html$/i, '');
  return !fileName || fileName === 'index' ? `${SITE_URL}/` : `${SITE_URL}/${fileName}`;
}

/**
 * Build the block of tags that replaces `<gbbo-metadata>` in the page
 * @param {{title?: string, description?: string}} attributes - What the page set
 * @param {string} htmlPath - The page being built, e.g. `/vote.html`
 * @returns {string} The rendered HTML, indented to sit neatly in <head>
 */
function renderMetadata(attributes, htmlPath) {
  const attr = escapeAttribute;

  // "Great Bake Off Bracket | Vote Now!", or just the site name on its own
  const title = attr(attributes.title ? `${SITE_NAME} | ${attributes.title}` : SITE_NAME);
  const description = attr(attributes.description || DEFAULT_DESCRIPTION);
  const url = attr(toPageUrl(htmlPath));
  const image = attr(SHARE_IMAGE.url);
  const imageAlt = attr(SHARE_IMAGE.alt);

  const tags = [
    '<!-- Generated from <gbbo-metadata> - see vite-plugins/gbbo-metadata.js -->',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${url}">`,
    // The bracket is for friends playing along at home, not for search results
    `<meta name="robots" content="noindex, nofollow">`,
    `<meta name="theme-color" content="${THEME_COLOR}">`,
    `<link rel="icon" href="${ICON}">`,
    `<link rel="apple-touch-icon" href="${ICON}">`,

    // Open Graph - what Facebook, Slack, WhatsApp, iMessage and LinkedIn read
    '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${attr(SITE_NAME)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="en_GB">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:secure_url" content="${image}">`,
    `<meta property="og:image:type" content="${SHARE_IMAGE.type}">`,
    `<meta property="og:image:width" content="${SHARE_IMAGE.width}">`,
    `<meta property="og:image:height" content="${SHARE_IMAGE.height}">`,
    `<meta property="og:image:alt" content="${imageAlt}">`,

    // Twitter/X reads its own tags, and wants the big picture card
    '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image:alt" content="${imageAlt}">`,

    // Saved to a phone home screen, the short name is what fits under the icon
    '',
    `<meta name="apple-mobile-web-app-title" content="${attr(SITE_NAME)}">`,
    `<meta name="application-name" content="${attr(SITE_NAME)}">`
  ];

  return tags.map((tag) => (tag === '' ? '' : `    ${tag}`)).join('\n');
}

/**
 * The Vite plugin that expands `<gbbo-metadata>` in every HTML page.
 *
 * It runs for the dev server and the production build alike, so what you see
 * on localhost is what ships.
 * @returns {Object} A Vite plugin
 */
export default function gbboMetadata() {
  return {
    name: 'gbbo-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        return html.replace(TAG_PATTERN, (_match, attributeString) => {
          const attributes = parseAttributes(attributeString);
          const path = ctx?.path || ctx?.filename || '/index.html';
          return `${renderMetadata(attributes, path)}\n`;
        });
      }
    }
  };
}
