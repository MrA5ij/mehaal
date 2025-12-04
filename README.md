# MEHAAL TECH AI

Simple Express + Jade site that shows the MEHAAL TECH AI hero page and static assets from `public/`.

## Requirements
- Node.js 18 or the version offered by your hosting provider
- npm, pnpm, or yarn for installing dependencies

## Local Development
```bash
npm install
npm start
```
The server listens on `http://localhost:3000` by default. Set the `PORT` environment variable to override it.

## Deploying on cPanel Node.js App
1. Upload this repository to your cPanel account (e.g. via Git, SFTP, or File Manager).
2. Open **Setup Node.js App** in cPanel, choose the document root that contains this project, and select a Node.js version (use 18.x or newer).
3. Set **Application Startup File** to `server.js`. This file now bootstraps the Express server without needing the legacy `bin/www` wrapper.
4. (Optional) Add environment variables such as `PORT` if you need a fixed port—otherwise Passenger assigns one automatically and passes it through `PORT`.
5. Click **Run NPM Install** to install dependencies, then press **Start Application**. Passenger will run `npm start`, which calls `node server.js`.

That is all that is required for cPanel; no additional build step is necessary.
