/**
 * Keeps the text colour authored in the CMS while still letting Angular
 * sanitize the article HTML. Angular deliberately removes `style` attributes
 * from `[innerHTML]`; the legacy `font[color]` attribute is retained by its
 * HTML sanitizer and is safe for this limited presentation use.
 */
export function preserveRichTextColors(html: string | null): string {
  if (!html) return '';

  const contentWithPreservedColors = html.replace(
    /<(strong|span)\b([^>]*?)\sstyle\s*=\s*(["'])(.*?)\3([^>]*)>([\s\S]*?)<\/\1\s*>/gi,
    (element, tag: string, before: string, _quote: string, style: string, after: string, content: string) => {
      const color = colorFromStyle(style);
      if (!color) return element;

      // The original attributes remain subject to Angular's normal HTML
      // sanitizer. Only the allow-listed colour is moved into the safe markup.
      return `<font color="${color}"><${tag}${before}${after}>${content}</${tag}></font>`;
    },
  );

  return normalizeRichTextSpacing(markPhoneNumbers(contentWithPreservedColors));
}

/**
 * The CMS frequently saves every space as a non-breaking space. That makes a
 * paragraph one long unbreakable run: `overflow-wrap` then splits words, while
 * disabling it makes the page scroll horizontally. Keep indentation at the
 * start of a text node, but turn the other spaces back into normal spaces so
 * the browser can wrap naturally between words.
 */
function normalizeRichTextSpacing(html: string): string {
  return html.replace(/(<[^>]*>)|([^<]+)/g, (segment, tag: string | undefined, text: string | undefined) => {
    if (tag) return tag;

    const leadingSpaces = text?.match(/^(?:(?:&nbsp;)|\u00a0)+/i)?.[0] ?? '';
    const remainingText = text?.slice(leadingSpaces.length) ?? '';
    return `${leadingSpaces}${remainingText.replace(/&nbsp;|\u00a0/gi, ' ')}`;
  });
}

/** Marks numeric <strong> content so its phone number remains together. */
function markPhoneNumbers(html: string): string {
  return html.replace(/<strong\b([^>]*)>([\s\S]*?)<\/strong\s*>/gi, (element, attributes: string, content: string) => {
    const text = content.replace(/<[^>]+>/g, '').replace(/&nbsp;|\u00a0/gi, ' ').trim();
    if (!/^[+\d\s().-]{7,}$/.test(text)) return element;

    return `<strong${attributes}><span class="rich-content__phone-number">${content}</span></strong>`;
  });
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
