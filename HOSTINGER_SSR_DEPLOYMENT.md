# Hostinger SSR deployment

This project must run as a Node.js application. It must **not** be uploaded to
`public_html` as a static website, because each news URL needs the Node server
to generate its article-specific Open Graph image.

1. In hPanel, choose **Websites → Create site → Web App**.
2. Upload the project source ZIP, select the **Other** framework preset, and
   choose Node.js 22 or later.
3. Set **Build command** to `npm run build`, **Output directory** to
   `dist/media-news-company`, and leave **Entry file** as `server.js`, then
   deploy. Hostinger supplies the `PORT` environment variable automatically.
4. After testing on the temporary domain, point `waaimedia.com` to this Web
   App instead of its static `public_html` site.

After deployment, open a news URL in a private browser window and view its
page source. It must contain an `og:image` tag whose value is that article's
public `featured_image_url`. Then use Facebook Sharing Debugger's **Scrape
Again** action before testing WhatsApp, which may cache a previous preview.
