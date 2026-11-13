# Portfolio template

A one-page CV and portfolio site for a young person: name, a few lines about them, a swipeable photo gallery, YouTube videos, experience, other achievements and references. It is published free on GitHub Pages.

It started as [georgechef.miggle.net](https://georgechef.miggle.net/). Everything personal has been moved into one file, so a new site only needs a new [content.js](content.js) and some photos.

## What lives where

| File | What it is | Changes per person? |
| --- | --- | --- |
| `content.js` | Words, links, colours, domain, gallery, videos | Yes, this is the only one |
| `images/` | Photos for the gallery and the link preview | Yes |
| `index.html` | Draws the page from `content.js` | No |
| `styles.css` | Layout and type. Colours come from `content.js` | No |
| `tools/build.mjs` | Fills in the title, search and preview tags, favicon, `CNAME` and `robots.txt` from `content.js` | No |
| `.github/workflows/pages.yml` | Runs the build and publishes on every push to `main` | No |

Any section with nothing in it stays off the page. Leave `contact.email` or `contact.phone` empty to hide it.

## Make a new site

1. On GitHub, use this repo as a template to create a new repo.
2. In the new repo, open Settings → Pages and set Source to **GitHub Actions**.
3. Edit `content.js`: name, role, lines, gallery, and so on. Add photos to `images/`.
4. Set `domain` in `content.js`, for example `sam.miggle.net`. Add a DNS CNAME record from `sam` to `<github-owner>.github.io`. Then enter the same domain under Settings → Pages → Custom domain and turn on Enforce HTTPS once the certificate is ready. For a site published by Actions, GitHub takes the domain from that setting, not from the `CNAME` file.
5. Commit and push. The site appears a minute or two later.

## Add a photo

Put the photo in `images/` with a simple name, then add a block to `gallery.items` in `content.js`:

```js
{
  image: "images/first-goal.jpg",
  title: "First goal of the season",
  caption: "Away at the Saturday league.",
},
```

If you replace a photo but keep its file name, change `rev` to any new word so phones fetch the new one.

## Add a YouTube video

Paste a normal YouTube link into `videos.items`. The page turns it into a player.

```js
{
  title: "Training session",
  url: "https://www.youtube.com/watch?v=VIDEO_ID",
},
```

## Preview on your computer

Open `index.html` in a browser to see the page. To see exactly what will be published, including the generated tags:

```bash
node tools/build.mjs
```

The result is in `dist/`, which git ignores.

## Keeping kids safe

- `hideFromSearch` is `true` by default. That adds `noindex` and a `robots.txt` that keeps the site out of search engines. Only set it to `false` when the young person and their parent want it found, for example when job hunting.
- Remove the location from photos before adding them. Phones often record where a picture was taken.
- Don't publish home addresses, school names or personal phone numbers for under-16s. Use a parent's email or leave contact empty.
- Use unlisted YouTube videos if the young person doesn't want them found on YouTube.

## For automations (Activepieces)

An automation only ever needs to write `content.js` and files in `images/`, then commit to `main`. The workflow does the rest. To create a site:

1. Generate a repo from this template (`POST /repos/{template_owner}/{template_repo}/generate`).
2. Turn on Pages with Actions as the source (`POST /repos/{owner}/{repo}/pages` with `build_type: "workflow"`).
3. Set the custom domain (`PUT /repos/{owner}/{repo}/pages` with `cname`) and add the DNS record.
4. Commit the new `content.js` and photos. That push publishes the site.

The publish run started by step 1 fails because Pages is not on yet. That is expected and harmless.

`content.js` must keep the `const site = { ... };` shape. The build reads it by running that file and taking `site`.
