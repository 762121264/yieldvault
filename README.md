# YieldVault — Savings & Investment Tracker

A mobile-ready static web prototype for tracking savings goals and manually entered investment values. The original weather-dashboard starter has been repurposed into a personal-finance dashboard.

## Current features

- Responsive layout for phones, tablets, and desktops.
- Create and remove savings goals, set targets, and record manual savings entries.
- Add investment/watchlist entries with amount invested and current value.
- Simple progress indicators, manually calculated changes, and activity history.
- Stores demo data in the browser's local storage on the current device.
- Clear UI notices that values are manually entered and no real money moves.

## Run locally

No build tools or package installation are required.

1. Clone the repository.
   `git clone https://github.com/762121264/yieldvault.git`
2. Serve the project folder with a static server, for example:
   `python -m http.server 8000`
3. Open `http://localhost:8000`.

You can also open `index.html` directly in a modern browser, though using a local server is recommended.

## Important limitations

- This is a prototype and personal tracker, **not a bank, wallet, broker, deposit service, or regulated investment platform**.
- Savings and investment records are manual, local to the browser, and not backed up or synced to an account.
- Investment values are not live market data. Displayed gains/losses are arithmetic on values entered by the user and are not predictions or guarantees.
- MTN Mobile Money and Airtel Money are **not integrated**. No deposits, withdrawals, payment requests, or balance checks occur.
- No user authentication, cloud database, server-side validation, payment callbacks, or admin console is included.
- Do not store passwords, payment PINs, secret keys, or sensitive financial details in this static app.

## What is required for real payments

A production integration needs an approved merchant/business account with the relevant provider(s), current API documentation and credentials, a secure server-side backend, transaction creation and status verification, signed/verified callbacks, idempotency and reconciliation, audit logs, fraud controls, and a tested refund/withdrawal policy. Credentials must be stored as server-side secrets and never in browser JavaScript. Confirm applicable financial-service, consumer-protection, privacy, and data-protection requirements before accepting public deposits or offering investment products.

## Deployment

This static app can be hosted on a static hosting provider after review. A public deployment has not been performed by this repository change. To use it with real users, first add account-based storage, authentication, backups, security review, and the appropriate operational and legal controls.
