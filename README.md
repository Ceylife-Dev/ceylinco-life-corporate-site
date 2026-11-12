# Ceylinco Life website

Next.js 16 (App Router, TypeScript) with Tailwind CSS v4, Lucide icons and
`next/font` (Plus Jakarta Sans). Built phase by phase:

1. Design system (tokens, components, docs, checks)
2. Header with mega menus

## Run it on your computer

You need Node.js 20.9 or newer (this project was set up with Node 24).

```bash
npm install
```

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser. Stop the server with
`Ctrl+C`. To test on a phone on the same Wi-Fi, open the "Network" address the
terminal prints.

Other commands:

```bash
npm run build          # production build
npm run start          # run the production build
npm run check          # contrast + token + type + lint checks
npm run check:contrast # text/background contrast report (WCAG AA)
npm run check:tokens   # finds raw colours/sizes outside the tokens file
```

## Where things are

| Path | What |
|---|---|
| `CLAUDE.md` | Rules every AI session follows |
| `docs/design-system.md` | Tokens, components, do's and don'ts |
| `src/styles/tokens.css` | All design tokens |
| `src/app/globals.css` | Tailwind import, base styles, focus ring |
| `src/components/ui/` | Button, Input, Select, Card, NavLink, IconButton, Tooltip, Tag |
| `src/components/header/` | Header with mega menus |
| `src/components/home/`, `src/components/site/` | Home page sections, footer and chat button |
| `src/content/home.ts`, `src/content/footer.ts` | All home page and footer wording. A `// SAMPLE` comment marks stand-in content to confirm; a link of `#` means the URL is not given yet |
| `src/content/navigation.ts` | All header and menu copy, icons and links (edit here) |
| `src/content/site.ts` | Company name and description |
| `src/app/[...slug]/page.tsx` | Placeholder pages for menu links that have no real page yet |
| `public/images/ceylife-logo.svg` | Logo (copy of `assets/ceylife-logo.svg`) |
| `scripts/` | Contrast and token checkers |

## Troubleshooting

**`SELF_SIGNED_CERT_IN_CHAIN` or "Failed to download ... from Google Fonts"**
Your network is re-signing secure traffic with a company certificate that Node
and npm don't trust. Ask IT for the company root certificate (a `.pem` or `.crt`
file) and either set `NODE_EXTRA_CA_CERTS` to its path, or run
`npm config set cafile <path>`. Or run `npm install` once on a different network.

**"Turbopack is not supported on this platform" / missing `@next/swc-*`**
The native compiler package did not install (same cause as above). After
fixing the certificate run `npm install` again.
