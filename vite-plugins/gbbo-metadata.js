/**
 * <gbbo-metadata> - the shared <head> component.
 *
 * Every page drops a single `<gbbo-metadata>` tag in its <head>, and this Vite
 * plugin swaps it for the full block of title, description, robots, Open Graph
 * and Twitter tags. That keeps all eight pages in step: the site name, the
 * share image and the tag list live here, and a page only says what is
 * different about itself.
 *
 * It is a build-time component rather than a LitElement one on purpose.
 * Facebook, Slack, iMessage, X and search crawlers do not run our JavaScript,
 * and `js/main.js` is a deferred module at the bottom of <body>, so anything a
 * web component wrote into <head> would land long after they had given up.
 * Expanding the tag while the HTML is being built means the finished page ships
 * with real, static meta tags in it.
 *
 * Usage - every attribute is optional and falls back to the defaults below:
 *
 *   <gbbo-metadata
 *     title="Vote Now!"
 *     description="A fun line about this page."
 *     image="/images/series-17.jpg"
 *     noindex="false"
 *   ></gbbo-metadata>
 */

/** Where the site lives, used to make share links and images absolute */
const SITE_URL = 'https://gbbo-bracket.github.io';

/**
 * The fallbacks for anything a page does not set.
 *
 * `title` is the page name that goes after the site name, so "Vote Now!"
 * becomes "Great Bake Off Bracket | Vote Now!". The image is the series 17
 * cast photo, sized 1200x672 - close enough to the 1.91:1 that Facebook,
 * LinkedIn and X all crop to, so nobody loses their head in the preview.
 */
const DEFAULTS = {
  siteName: 'Great Bake Off Bracket',
  title: '',
  description:
    'A friendly Great British Bake Off bracket. Pick your bakers each week, score points and see who comes out on top.',
  image: '/images/series-17.jpg',
  imageWidth: '1200',
  imageHeight: '672',
  imageAlt: 'The bakers of this series of the Great British Bake Off',
  icon: '/images/gbbo-avatar.jpg',
  themeColor: '#F7C6D9',
  locale: 'en_GB',
  noindex: true
};

/** Content types for the image extensions we actually use */
const IMAGE_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml'
};

/** Matches the tag in the page, whether it is closed properly or self-closed */
const TAG_PATTERN = /[ \t]*<gbbo-metadata\b([^>]*?)\/?>(?:\s*<\/gbbo-metadata>)?[ \t]*\n?/gi;

/** Matches one attribute, with double quotes, single quotes, bare, or no value */
const ATTRIBUTE_PATTERN = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

/**
 * Pull the attributes off a `<gbbo-metadata>` tag
 * @param {string} attributeString - Everything between the tag name and the `>`
 * @returns {Object} Attribute names mapped to their values, valueless ones as ''
 */
function parseAttributes(attributeString = '') {
  const attributes = {};
  let match;

  ATTRIBUTE_PATTERN.lastIndex = 0;
  while ((match = ATTRIBUTE_PATTERN.exec(attributeString)) !== null) {
    const [, name, doubleQuoted, singleQuoted, bare] = match;
    attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? bare ?? '';
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
 * Read a page attribute as a boolean
 *
 * Present but empty (`noindex`) counts as true, so the tag reads naturally.
 * @param {string|undefined} value - The raw attribute value
 * @param {boolean} fallback - What to use when the attribute is absent
 * @returns {boolean} The resolved value
 */
function parseBoolean(value, fallback) {
  if (value === undefined) return fallback;
  if (value === '') return true;
  return !/^(false|no|0)$/i.test(value.trim());
}

/**
 * Turn an HTML file name into the path visitors actually see
 *
 * GitHub Pages serves `vote.html` at `/vote`, which is what the nav links to,
 * so the canonical and share URLs should say the same thing.
 * @param {string} htmlPath - The page being built, e.g. `/vote.html`
 * @returns {string} The public path, e.g. `/vote`
 */
function toPublicPath(htmlPath = '/index.html') {
  const fileName = htmlPath.replace(/^.*\//, '').replace(/\.html$/i, '');
  return !fileName || fileName === 'index' ? '/' : `/${fileName}`;
}

/**
 * Make a site-relative path absolute, and leave full URLs alone
 * @param {string} path - A path or URL
 * @returns {string} An absolute URL
 */
function toAbsoluteUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Work out the final metadata for a page from its attributes and the defaults
 * @param {Object} attributes - The parsed `<gbbo-metadata>` attributes
 * @param {string} htmlPath - The page being built, e.g. `/vote.html`
 * @returns {Object} Every value the tags need, resolved and absolute
 */
export function resolveMetadata(attributes = {}, htmlPath = '/index.html') {
  const siteName = attributes['site-name'] || DEFAULTS.siteName;
  const pageTitle = attributes.title ?? DEFAULTS.title;
  const image = attributes.image || DEFAULTS.image;
  const extension = (image.split('.').pop() || '').toLowerCase();

  return {
    siteName,
    // "Great Bake Off Bracket | Vote Now!", or just the site name on its own
    title: pageTitle ? `${siteName} | ${pageTitle}` : siteName,
    description: attributes.description || DEFAULTS.description,
    url: toAbsoluteUrl(attributes.path || toPublicPath(htmlPath)),
    image: toAbsoluteUrl(image),
    imageType: IMAGE_TYPES[extension] || '',
    imageWidth: attributes['image-width'] || (attributes.image ? '' : DEFAULTS.imageWidth),
    imageHeight: attributes['image-height'] || (attributes.image ? '' : DEFAULTS.imageHeight),
    imageAlt: attributes['image-alt'] || DEFAULTS.imageAlt,
    icon: attributes.icon || DEFAULTS.icon,
    themeColor: attributes['theme-color'] || DEFAULTS.themeColor,
    locale: attributes.locale || DEFAULTS.locale,
    noindex: parseBoolean(attributes.noindex, DEFAULTS.noindex)
  };
}

/**
 * Build the block of tags that replaces `<gbbo-metadata>` in the page
 * @param {Object} meta - The output of `resolveMetadata`
 * @returns {string} The rendered HTML, indented to sit neatly in <head>
 */
export function renderMetadata(meta) {
  const attr = escapeAttribute;

  const tags = [
    '<!-- Generated from <gbbo-metadata> - see vite-plugins/gbbo-metadata.js -->',
    `<title>${attr(meta.title)}</title>`,
    `<meta name="description" content="${attr(meta.description)}">`,
    `<link rel="canonical" href="${attr(meta.url)}">`,
    // The bracket is for friends playing along at home, not for search results
    `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">`,
    `<meta name="theme-color" content="${attr(meta.themeColor)}">`,
    `<link rel="icon" href="${attr(meta.icon)}">`,
    `<link rel="apple-touch-icon" href="${attr(meta.icon)}">`,

    // Open Graph - what Facebook, Slack, WhatsApp, iMessage and LinkedIn read
    '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${attr(meta.siteName)}">`,
    `<meta property="og:title" content="${attr(meta.title)}">`,
    `<meta property="og:description" content="${attr(meta.description)}">`,
    `<meta property="og:url" content="${attr(meta.url)}">`,
    `<meta property="og:locale" content="${attr(meta.locale)}">`,
    `<meta property="og:image" content="${attr(meta.image)}">`,
    `<meta property="og:image:secure_url" content="${attr(meta.image)}">`,
    meta.imageType ? `<meta property="og:image:type" content="${attr(meta.imageType)}">` : null,
    meta.imageWidth ? `<meta property="og:image:width" content="${attr(meta.imageWidth)}">` : null,
    meta.imageHeight ? `<meta property="og:image:height" content="${attr(meta.imageHeight)}">` : null,
    `<meta property="og:image:alt" content="${attr(meta.imageAlt)}">`,

    // Twitter/X reads its own tags, and wants the big picture card
    '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${attr(meta.title)}">`,
    `<meta name="twitter:description" content="${attr(meta.description)}">`,
    `<meta name="twitter:image" content="${attr(meta.image)}">`,
    `<meta name="twitter:image:alt" content="${attr(meta.imageAlt)}">`,

    // Saved to a phone home screen, the short name is what fits under the icon
    '',
    `<meta name="apple-mobile-web-app-title" content="${attr(meta.siteName)}">`,
    `<meta name="application-name" content="${attr(meta.siteName)}">`
  ];

  return tags
    .filter((tag) => tag !== null)
    .map((tag) => (tag === '' ? '' : `    ${tag}`))
    .join('\n');
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
          const meta = resolveMetadata(attributes, ctx?.path || ctx?.filename || '/index.html');
          return `${renderMetadata(meta)}\n`;
        });
      }
    }
  };
}
