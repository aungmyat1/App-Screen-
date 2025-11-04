# Deploying AppScreens on Railway (Free Tier)

This guide explains how to deploy the AppScreens application on Railway using their free tier.

## Prerequisites

1. A GitHub account
2. A Railway account (free)
3. A MongoDB Atlas account (free tier available)

## Step 1: Prepare Your Repository

1. Push your AppScreens code to a GitHub repository
2. Make sure your repository has the proper structure:
   ```
   .
   ├── server/
   │   ├── index.js
   │   └── ... (other server files)
   ├── src/
   ├── package.json
   └── ... (other frontend files)
   ```

## Step 2: Set Up MongoDB Atlas

1. Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for testing
5. Get your connection string from the "Connect" button
6. Replace placeholders with your actual username and password

## Step 3: Create Railway Account

1. Go to https://railway.app and sign up using your GitHub account
2. Connect your GitHub repository to Railway

## Step 4: Deploy the Web Service

1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your AppScreens repository
4. Railway will automatically detect it's a Node.js project

## Step 5: Configure Environment Variables

In the Railway dashboard:

1. Go to your project
2. Click on your service
3. Go to the "Variables" tab
4. Add the following environment variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
BRAINTREE_ENVIRONMENT=Production
FRONTEND_URL=https://your-project.up.railway.app
```

Note: Railway automatically assigns a URL like `https://your-project.up.railway.app`

## Step 6: Configure Build and Start Commands

Railway might not automatically detect the correct build process. If needed:

1. Go to your service in Railway dashboard
2. Click "Settings" tab
3. Under "General", find "Build & Start Command"
4. Set:
   - Build Command: `npm install && npm run build && cd server && npm install`
   - Start Command: `cd server && node index.js`

## Step 7: Deploy

1. Railway will automatically deploy after you set up the environment variables
2. Wait for the build and deployment to complete
3. Your app will be available at the assigned Railway URL

## Step 8: Configure Custom Domain (Optional)

1. In your Railway dashboard, go to your service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Add your custom domain
5. Follow the DNS instructions to verify ownership

## Limitations of Free Tier

1. $5 credit per month (renews monthly)
2. Sleeps after 12 hours of inactivity
3. Takes a few seconds to spin up when accessed after sleep
4. Limited to 1GB RAM and 1CPU

## MongoDB Atlas Free Tier

1. 512 MB storage limit
2. Shared cluster (M0 tier)
3. Limited to 100 connections
4. Good for development and small production apps

## Braintree Production Setup

1. Make sure you have a production Braintree account
2. Update your Braintree environment variables to use Production keys
3. Configure webhooks in your Braintree dashboard to point to your Railway URL:
   `https://your-project.up.railway.app/api/payments/webhook`

## Troubleshooting

1. **Build Failures**: Check build logs in Railway dashboard
2. **Application Crashes**: Check application logs in Railway dashboard
3. **Database Connection Issues**: Verify MongoDB URI and IP whitelist
4. **Environment Variables**: Make sure all required variables are set

## Scaling Up

When you outgrow the free tier:
1. Upgrade to Railway's paid plans
2. Move to a dedicated MongoDB instance
3. Consider using a CDN for static assets
4. Implement caching for better performance