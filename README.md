# Eyal Izenman Portfolio

This repository contains a fully open‑source portfolio for Eyal Izenman.  It
shows selected work using a zoomable, infinite canvas built with React,
TypeScript, Tailwind CSS and shadcn‑ui.  The site loads its content from a
JSON file in the `public/content` directory so that you can update media and
descriptions without touching the code.  A simple CMS under `/admin` allows you
to edit that JSON and upload new media directly from your browser.

## Features

- **Zoom & pan canvas** – explore work freely in all directions.
- **Media types** – supports Google Drive videos, YouTube embeds and arbitrary
  image/video URLs.
- **Inline metadata** – titles and descriptions appear on hover.
- **Edit mode** – drag and resize items when running locally or by enabling
  `?edit=true` in the URL.
- **Git‑based CMS** – Decap (formerly Netlify) CMS at `/admin` lets you edit
  `public/content/portfolio.json` and upload images to `public/media/uploads/`.
- **GitHub Pages deployment** – a GitHub Actions workflow builds and
  deploys the static site on push to `main`.

## Local development

Clone the repository and install dependencies:

```bash
git clone <YOUR_GIT_URL>
cd zoom-and-edit-folio-main
npm install
```

To start the development server on <http://localhost:8080>:

```bash
# Enable edit mode by setting VITE_EDIT_MODE=true in your environment
VITE_EDIT_MODE=true npm run dev
```

When `VITE_EDIT_MODE` is `true` the site will show handles for dragging and
resizing items.  You can also toggle edit mode at runtime by appending
`?edit=true` to the URL.

## Editing content with the CMS

Visit `/admin` in your deployed site or local dev environment to open the
Decap CMS.  You will be prompted to authenticate with GitHub.  Once logged in
you can edit the list of media items and categories defined in
`public/content/portfolio.json`.  Uploaded media files will be stored under
`public/media/uploads/` and referenced automatically.  When you save changes
the CMS will create a commit on the `main` branch of your repository.

### Media item fields

Each item has the following properties:

| Field       | Description                                                                           |
|------------|---------------------------------------------------------------------------------------|
| `id`        | A unique identifier for the item.                                                     |
| `type`      | One of `gdrive`, `youtube`, or `local`.  Determines how the media is loaded.         |
| `driveId`   | The Google Drive file ID (only used when `type` is `gdrive`).                         |
| `src`       | URL for YouTube or local uploads (used when `type` is `youtube` or `local`).          |
| `x`, `y`    | Canvas coordinates in pixels.                                                         |
| `width`     | Display width in pixels.  Height is derived from a 4:3 aspect ratio.                  |
| `title`     | Title shown in the overlay.                                                           |
| `description` | Short description shown in the overlay.                                            |

Category labels have `id`, `text`, `x` and `y` fields for positioning.

## Building for production

To generate the static site in the `dist` folder:

```bash
npm run build
```

The build uses Vite and automatically injects a `__EDIT_MODE__` constant based
on the `VITE_EDIT_MODE` environment variable.  When omitted or set to
anything other than `true`, edit mode will be disabled in the production build.

## Deployment

This repository includes a GitHub Actions workflow under
`.github/workflows/deploy.yml` that builds and deploys the site to GitHub
Pages on every push to the `main` branch.  To enable Pages deployment you
must configure the **Pages** settings in your repository:

1. Navigate to **Settings → Pages**.
2. Select **GitHub Actions** as the source.
3. Set the branch to `main` and the folder to `/` (GitHub Actions manages it).

After the first deployment the site will be available at
`https://<your-username>.github.io/<repository-name>/`.

## Custom domain

If you want to use a custom domain, add a CNAME record in your DNS that
points your domain at the GitHub Pages URL.  Then create a `CNAME` file in
the repository root containing your domain name and push the change.  GitHub
Pages will automatically pick up the custom domain.

## Migrating content from the original portfolio

The initial version of `public/content/portfolio.json` contains a subset of
Eyal’s work migrated from the earlier HTML‑based site.  You can continue to
add items via the CMS or directly edit the JSON file.  Each item in
`portfolio.json` corresponds to a video or image from the original
portfolio.  If you want to add more items, copy the Google Drive file ID
or YouTube ID and fill in the fields in the CMS.

## License

This project is released under the MIT license.  See `LICENSE` for details.