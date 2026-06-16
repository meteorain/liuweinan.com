# Yuhang Chen’s Personal Blog (yuhang.ch)

This is **Yuhang Chen’s personal blog and digital garden**, built with Astro and deployed on Vercel.
It is a personal-use project where I publish long-form posts, notes, and a few small experiments.

For a more detailed overview of the stack and architecture,
see the internal doc at `src/content/docs/overview/tech-stack.md`.

## Tech stack (short version)

- **Framework**: Astro (server output, deployed on Vercel)
- **Content**: Collections under `src/content` (`posts`, `posts-en`, `docs`, `whois`, etc.)
- **Styling**: UnoCSS, Expressive Code, custom typography / prose styles
- **i18n**: `astro-i18n-aut` (currently `zh` and `en`)
- **Runtime**: Node 22.x + `@astrojs/vercel` adapter

## Development

> This project currently targets Node **22.22.0** (see `.node-version`).
> Use `fnm` / `nvm` to switch to the correct version if needed.

Using `pnpm` (recommended):



## License

- All **code in this repository** (unless otherwise noted) is licensed under the [MIT License](./LICENSE).
- All **written content** (blog posts, essays, notes, etc.) is licensed under  
  **Creative Commons Attribution‑NonCommercial‑NoDerivatives 4.0 International (CC BY‑NC‑ND 4.0)**.  
  See <https://creativecommons.org/licenses/by-nc-nd/4.0/> for details; when quoting, please keep a link to `https://yuhang.ch`.