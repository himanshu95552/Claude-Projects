# LinkedIn ad pack: Alpha Nodus / Gravity

Built from the live site at alphanodus.com. Nothing here was invented: every claim and number in the copy comes from the site's own pages.

## What is in this folder

| Path | What it is |
|---|---|
| `ad-copy.md` / `ad-copy.csv` | 18 ads across 7 campaigns (intro text, headline, description, CTA, landing URL, suggested creative). Every field is inside LinkedIn's recommended limits. |
| `ad-variants.md` / `ad-variants.csv` | 17 A/B test variants: hook styles (question, stat, pain, benefit), 8 job-title-specific ads, and proof formats. Includes how to run each test. |
| `creatives/landscape-1200x627/` and `creatives/square-1080x1080/` | 35 finished ad images (18 core ads + 17 variants) with the headline, sub-line and CTA overlaid in the site's purple branding (Inter font). File names match the ad IDs in the copy files. |
| `images/original-png/` | 68 unique full-resolution images from the site, converted from WebP (LinkedIn does not accept WebP). |
| `images/landscape-1200x627/` | The same images cropped to LinkedIn's 1.91:1 single-image size. |
| `images/square-1080x1080/` | The same images fitted into a 1:1 square on a matching background colour. |
| `videos/full-length/` | The site's 8 own videos (1080p, with audio, 80-100 s each). |
| `videos/30s-landscape-16x9/` | 30-second cutdowns, 16:9, with audio. |
| `videos/30s-square-1x1/` | 30-second cutdowns, 1:1, with audio. |
| `../alphanodus-videos/pages/` | One scroll-through recording per page (1280x720 MP4), capturing the page's scroll animations. |
| `../alphanodus-full/` | The full offline site mirror (pages, scripts, fonts, images, videos). |

## Check before you launch

1. **Customer results.** Five ads name customers (Downtown Radiology, Iowa Radiology, MRI Associates, a Florida practice, an unnamed imaging center). Confirm each customer has agreed to be named in paid advertising, not just on your site.
2. **Healthcare ad policy.** LinkedIn reviews healthcare claims. Keep outcome numbers tied to the case study they come from, as the copy does.
3. **Event ad.** The RSNA 2026 booth number is from the site banner. Update it if it changes.
4. **Brand and logo.** Images keep the site's own branding. Check that any third-party logos inside the images are cleared for ads.
5. **Videos.** The 30-second cutdowns are the first 30 seconds of each video. Check each one starts on a strong frame, or choose a different start with `ffmpeg -ss`.

## LinkedIn specs used

- Single image: 1200x627 (1.91:1) or 1080x1080 (1:1), JPG or PNG.
- Intro text 150 characters recommended (600 max). Headline 70 recommended. Description 100 recommended.
- Video: MP4, 3 seconds to 30 minutes, 16:9 or 1:1 recommended, 30 seconds or less performs best.

## Suggested targeting (starting point)

- Job titles: Practice Administrator, Director of Operations, Revenue Cycle Manager, Director of Prior Authorization, Radiology Administrator, Imaging Center Manager.
- Industry: Hospitals and Health Care. Company size: 11-500.
- One campaign per leak (referral, order, revenue) so results show which message lands.
