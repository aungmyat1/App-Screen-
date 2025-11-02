<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AppScreens - App Screenshot Downloader

AppScreens is a service that allows users to download app screenshots from the Apple App Store and Google Play Store. This repository contains both the frontend React application and the backend Node.js API with Stripe payment integration.

## Features

- Download screenshots from App Store and Google Play Store
- User authentication and account management
- Subscription-based payment system with Stripe
- API access for programmatic usage
- Batch processing for multiple apps

## Run Locally

**Prerequisites:** Node.js, MongoDB

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDB (either locally or using a cloud service like MongoDB Atlas)
4. Update the [.env](server/.env) file with your configuration
5. Run the server:
   ```bash
   npm run dev
   ```

## Deployment

### Using Docker (Recommended)

1. Make sure Docker and Docker Compose are installed
2. Update the [.env.production](.env.production) file with your production configuration
3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

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

## Project Structure

- `/` - Frontend React application
- `/server` - Backend Node.js API
- `/src` - Frontend source code
- `/src/services` - Frontend services for API communication
- `/src/components` - Reusable React components
- `/src/pages` - Main page components

## Monetization

The application uses Stripe for payment processing with multiple subscription tiers:
- Free: 10 downloads per month
- Starter: $19/month for 100 downloads
- Professional: $49/month for 500 downloads
- Enterprise: $149/month for unlimited downloads

## API Documentation

For API documentation, visit `/api-docs` when running the application or check the backend controllers in `/server/controllers`.

## Environment Variables

See [.env](server/.env) for development and [.env.production](.env.production) for production environment variables.