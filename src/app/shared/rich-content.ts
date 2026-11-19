/**
 * Keeps the text colour authored in the CMS while still letting Angular
 * sanitize the article HTML. Angular deliberately removes `style` attributes
 * from `[innerHTML]`; the legacy `font[color]` attribute is retained by its
 * HTML sanitizer and is safe for this limited presentation use.
 */
export function preserveRichTextColors(html: string | null): string {
  if (!html) return '';

  return html.replace(
    /<(strong|span)\b([^>]*?)\sstyle\s*=\s*(["'])(.*?)\3([^>]*)>([\s\S]*?)<\/\1\s*>/gi,
    (element, tag: string, before: string, _quote: string, style: string, after: string, content: string) => {
      const color = colorFromStyle(style);
      if (!color) return element;

      // The original attributes remain subject to Angular's normal HTML
      // sanitizer. Only the allow-listed colour is moved into the safe markup.
      return `<font color="${color}"><${tag}${before}${after}>${content}</${tag}></font>`;
    },
  );
}

function colorFromStyle(style: string): string | null {
  const match = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)\s*(?:;|$)/i);
  if (!match) return null;

  const color = match[1].trim();
  if (/^#[\da-f]{3,8}$/i.test(color) || /^[a-z]{3,20}$/i.test(color)) return color;

  // `font[color]` uses the HTML legacy-colour parser, not the CSS parser. A
  // value such as `rgb(230, 0, 0)` can therefore be interpreted as green.
  // Convert RGB CSS values to hex before adding the presentation attribute.
  const rgb = color.match(/^rgba?\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?(?:\s*,\s*[\d.]+%?)?\s*\)$/i);
  if (!rgb) return null;

  const isPercent = color.includes('%');
  const components = rgb.slice(1, 4).map((value) => {
    const channel = Number(value);
    return Math.round(Math.min(255, Math.max(0, isPercent ? channel * 2.55 : channel)));
  });

  return `#${components.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
