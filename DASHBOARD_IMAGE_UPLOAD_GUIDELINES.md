# Public Website Image Upload Guidelines

Use this document to add image-upload hints and validation in the dashboard. It is based on the **current public website CSS**, including every API-backed image that appears on the site.

## General upload rules

- Accept `JPG`, `PNG`, and `WebP`. Prefer **WebP** or high-quality JPG for photographic content.
- Keep the main subject, faces, text, and logos inside the **center 60%** of the image whenever the same image is reused in more than one place. The public website uses `object-fit: cover` in most image slots, so edge content can be cropped on mobile or in another layout.
- Upload at least the recommended dimensions below. Larger files with the same ratio are fine; do not upscale small images.
- Do not place important text close to any edge. Use image content rather than embedded text where possible.
- Maximum recommended file size: **2 MB** for photos/covers and **1 MB** for logos. The dashboard should optimize uploads before saving when possible.

## Dashboard fields and hints

| Dashboard/API field | Where it appears on the public site | Upload recommendation | Suggested dashboard hint / validation |
| --- | --- | --- | --- |
| `news.featured_image_url` | Home hero, News list cards, News details | **1920 × 1080 px** (16:9), minimum 1600 × 900 | `Recommended: 1920×1080 (16:9). This image is cropped for hero, cards, and mobile layouts; keep the important content in the center 60%.` |
| `blogs.featured_image_url` | Home blog cards, Blog list cards, Blog details | **1600 × 900 px** (16:9), minimum 1280 × 720 | `Recommended: 1600×900 (16:9). The website may crop this image in card and detail views; keep text and key subjects centered.` |
| `events.cover_image_url` | Home events cards and Event details | **1600 × 1200 px** (4:3), minimum 1200 × 900 | `Recommended: 1600×1200 (4:3). The event card uses a 1.34:1 crop; keep the event subject in the center.` |
| `portfolio.cover_image_url` | Portfolio list and Home portfolio section | **1600 × 1000 px** (8:5), minimum 1280 × 800 | `Recommended: 1600×1000 (8:5). Used in 1.72:1 and 1.52:1 cards; keep the main work centered to allow light cropping.` |
| `portfolio.media[].image_url` | Portfolio detail gallery (images and images-with-link) | **1520 × 1000 px** (1.52:1), minimum 1216 × 800 | `Recommended: 1520×1000 (1.52:1). This is the exact portfolio-gallery ratio; use one image per gallery item.` |
| `team_members.photo_url` | Home team carousel and About page team carousel | **800 × 800 px** (1:1), minimum 512 × 512 | `Square portrait. Recommended: 800×800. The image is displayed as a circle, so keep the face centered with safe space around it.` |
| `clients.logo_url` | Trusted Brands carousel and Portfolio client logo | **1000 × 1000 px** (1:1), minimum 512 × 512 | `Square PNG/WebP. Keep the logo centered with generous transparent or white padding; this single image is reused in both the circular portfolio logo and horizontal brand card.` |
| Rich-text content images inside `news.content` / `blogs.content` | News and Blog article body | **1600 px max width**; any aspect ratio is allowed | `Inline article image. Max recommended width: 1600px. It keeps its natural aspect ratio and must be optimized for web.` |

## One client-logo field (important)

The current API deliberately exposes one field: `clients.logo_url`. The public website reuses that one URL in two different layouts:

| Placement | Current rendered shape | Ideal source image |
| --- | --- | --- |
| Portfolio client logo | Circular / square (`1:1`) | Square source, centered logo |
| Trusted Brands carousel | Horizontal card (`201 × 96`, ratio `2.09:1`) | The central area of the same square source is visible |

### Required dashboard rule

Keep **one** upload input mapped to `clients.logo_url` and require a square logo source:

```text
Hint: “Upload a square logo: 1000×1000 px recommended (minimum 512×512).
Keep the logo centered with at least 15–20% transparent or white padding on every side.”
```

Do not ask the dashboard user for a wide banner. A square source preserves the portfolio logo correctly and its centered logo remains visible in the horizontal Trusted Brands card.

## Existing rendered aspect ratios (reference)

These are website display ratios, not necessarily the same ratio as the recommended source file. The difference is why the safe-center rule matters.

| Image type | Rendered ratio(s) |
| --- | --- |
| News image | Hero: responsive, approximately `2.38:1` on desktop; list card: `1.73:1`; detail: `1.98:1` desktop and `1.45:1` mobile |
| Blog image | Home card: `1.55:1`; list card: `1.72:1`; detail: `1.98:1` desktop and `1.45:1` mobile |
| Event cover | Home card: `1.34:1`; detail: full-width image with a `470 px` maximum visible height |
| Portfolio cover | Home card: `1.52:1`; portfolio list card: `1.72:1` |
| Portfolio gallery image/video frame | `1.52:1` |
| Team member photo | `1:1` circle |
| Portfolio client logo | `1:1` circle |
| Trusted Brand logo card | `201 × 96 px` (`2.09:1`) |

## Fields that are not dashboard image uploads

- Service icons, social icons, footer app-store icons, arrows, and the About image are currently static assets in the frontend.
- The contact map uses a URL/embed, not an uploaded image.
- Portfolio video entries use a video or external URL; they are not image-upload fields.

