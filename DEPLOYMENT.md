# Deployment Guide

This guide explains how to deploy the AppScreens application to a production environment.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (v4.4 or higher)
3. Docker and Docker Compose (optional but recommended)
4. A domain name (for production deployment)
5. SSL certificate (for HTTPS, recommended)

## Environment Variables

Before deploying, make sure to configure all environment variables in the `.env.production` file:

- `MONGODB_URI`: Your production MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT token generation
- `STRIPE_SECRET_KEY`: Your Stripe live secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
- `FRONTEND_URL`: Your frontend application URL

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. Clone the repository to your server:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Update the `.env.production` file with your production configuration.

3. Build and start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. The application will be available on port 5000.

### Option 2: Manual Deployment

#### Backend Deployment

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install production dependencies:
   ```bash
   npm ci --production
   ```

3. Set up your environment variables:
   ```bash
   export MONGODB_URI=your_production_mongodb_uri
   export JWT_SECRET=your_jwt_secret
   export STRIPE_SECRET_KEY=your_stripe_secret_key
   # ... other environment variables
   ```

4. Start the server:
   ```bash
   npm start
   ```

#### Frontend Deployment

1. From the root directory, install dependencies:
   ```bash
   npm ci
   ```

2. Build the production version:
   ```bash
   npm run build
   ```

3. Serve the built files using a web server like Nginx or Apache.

## Setting up Stripe Webhooks

For the payment system to work correctly, you need to set up Stripe webhooks:

1. In your Stripe Dashboard, go to Developers > Webhooks.
2. Add a new endpoint with the URL: `https://yourdomain.com/api/payments/webhook`
3. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret and add it to your `STRIPE_WEBHOOK_SECRET` environment variable.

## Domain and SSL Configuration

For production use, configure your domain and SSL certificate:

1. Point your domain's DNS to your server's IP address.
2. Use Let's Encrypt or another certificate authority to obtain an SSL certificate.
3. Configure your web server (Nginx/Apache) to use HTTPS.

## Monitoring and Maintenance

1. Set up logging for both frontend and backend applications.
2. Monitor MongoDB performance and set up backups.
3. Monitor Stripe transactions and handle failed payments.
4. Regularly update dependencies to ensure security.

## Scaling Considerations

For high-traffic applications, consider:

1. Using a load balancer for multiple backend instances.
2. Implementing a CDN for static assets.
3. Using a managed MongoDB service like MongoDB Atlas.
4. Implementing caching with Redis.