# JAVERISA

A responsive fashion storefront demo built with React and Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Open the site directly or use VS Code Live Server

The build generates a standalone-compatible project-root `index.html` and its bundled assets in `dist`:

1. Run `npm run build` after code changes.
2. Double-click the project-root `index.html` to open it directly, or open it in VS Code and click **Go Live**.
3. Live Server normally opens `http://127.0.0.1:5500`.

The app uses hash-based routes so product and shop navigation work from a local file and on static hosting. Live Server does not rebuild the app when source files change; run `npm run build` again to update the root page and `dist` assets.

Create a production build with `npm run build`, or preview it with `npm run preview`.

## Demo behavior

- Product catalog content and prices live in `src/data/products.js`.
- The shopping bag and demo orders are saved in this browser's local storage.
- Checkout creates a local demo order only. No real payment, shipping, or backend order processing occurs.
- Login, registration, and password recovery validate form input but are intentionally unavailable until a secure authentication service is connected. Passwords are not saved.
- Product photography and Google Fonts are loaded from external services and require an internet connection.
- The contact address is a placeholder and does not receive mail.

Before production use, connect a secure backend for account management, inventory, order storage, customer communications, and a payment provider's hosted checkout. Review the sample product details, prices, imagery, privacy terms, and shipping policy before publishing.
