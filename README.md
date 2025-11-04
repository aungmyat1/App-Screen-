<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AppScreens - App Screenshot Downloader

AppScreens is a service that allows users to download app screenshots from the Apple App Store and Google Play Store. This repository contains both the frontend React application and the backend Node.js API with Braintree payment integration.

## Features

- Download screenshots from App Store and Google Play Store
- User authentication and account management
- Subscription-based payment system with Braintree
- API access for programmatic usage
- Batch processing for multiple apps

## Run Locally

**Prerequisites:** Node.js (18+), Docker (optional for compose), MongoDB (local or Atlas)

### Frontend (development)

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Run the dev server:
   ```powershell
   npm run dev
   ```

### Backend (development)

1. Navigate to the server directory:
   ```powershell
   cd server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a local `.env` (use `server/.env.example` as a template) and set your secrets.
4. Run the server:
   ```powershell
   npm run dev
   ```

### Run with Docker Compose (recommended for local integration)

1. Copy `server/.env.example` to `server/.env` and fill in secrets locally (do NOT commit this file).
2. Start services:
   ```powershell
   docker-compose up --build
   ```


## Deployment

### Using Docker (Recommended)

1. Make sure Docker and Docker Compose are installed
2. Update the [.env.production](.env.production) file with your production configuration
3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Free Deployment Options

#### Render (Recommended)
1. Fork this repository
2. Sign up at [Render](https://render.com)
3. Create a new Web Service
4. Connect your repository
5. Configure environment variables
6. Deploy!

#### Railway
1. Fork this repository
2. Sign up at [Railway](https://railway.app)
3. Create a new project
4. Deploy from your repository
5. Configure environment variables

### Manual Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Set up a MongoDB database (local or cloud)
3. Configure environment variables in production
4. Deploy the backend:
   ```bash
   cd server
   npm start
   ```

## Free Domain Providers

- [Freenom](https://www.freenom.com) - Free domains with .tk, .ml, .ga, .cf extensions
- [EU.org](https://nic.eu.org) - Free subdomains
- [No-IP](https://www.noip.com) - Free subdomains with dynamic DNS
- [DuckDNS](https://www.duckdns.org) - Free subdomains with automated updates

## Project Structure

- `/` - Frontend React application
- `/server` - Backend Node.js API
- `/src` - Frontend source code
- `/src/services` - Frontend services for API communication
- `/src/components` - Reusable React components
- `/src/pages` - Main page components

## Monetization

The application uses Braintree for payment processing with multiple subscription tiers:
- Free: 10 downloads per month
- Starter: $19/month for 100 downloads
- Professional: $49/month for 500 downloads
- Enterprise: $149/month for unlimited downloads

## API Documentation

For API documentation, visit `/api-docs` when running the application or check the backend controllers in `/server/controllers`.

## Environment Variables

See [.env](server/.env) for development and [.env.production](.env.production) for production environment variables.