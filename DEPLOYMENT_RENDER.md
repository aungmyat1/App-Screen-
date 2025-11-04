# Deploying AppScreens on Render (Free Tier)

This guide explains how to deploy the AppScreens application on Render using their free tier.

## Prerequisites

1. A GitHub account
2. A Render account (free)
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

## Step 3: Create Render Account

1. Go to https://render.com and sign up using your GitHub account
2. Connect your GitHub repository to Render

## Step 4: Deploy the Web Service

1. Click "New+" and select "Web Service"
2. Connect your AppScreens repository
3. Configure the service:
   - Name: appscreens
   - Region: Choose the closest to your users
   - Branch: main (or master)
   - Root Directory: Leave empty
   - Environment: Node
   - Build Command: `npm install && cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Plan: Free

## Step 5: Configure Environment Variables

In the "Environment Variables" section, add the following:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
BRAINTREE_ENVIRONMENT=Production
FRONTEND_URL=https://appscreens.onrender.com
```

Note: Render automatically assigns a URL like `https://appscreens.onrender.com`

## Step 6: Deploy

1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Your app will be available at the assigned Render URL

## Step 7: Configure Custom Domain (Optional)

1. In your Render dashboard, go to your web service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Add your custom domain
5. Follow the DNS instructions to verify ownership

## Limitations of Free Tier

1. Service goes to sleep after 15 minutes of inactivity
2. Takes a few seconds to spin up when accessed after sleep
3. Limited monthly usage hours (750 hours/month for free plan)

## MongoDB Atlas Free Tier

1. 512 MB storage limit
2. Shared cluster (M0 tier)
3. Limited to 100 connections
4. Good for development and small production apps

## Braintree Production Setup

1. Make sure you have a production Braintree account
2. Update your Braintree environment variables to use Production keys
3. Configure webhooks in your Braintree dashboard to point to your Render URL:
   `https://your-app-name.onrender.com/api/payments/webhook`

## Troubleshooting

1. **Build Failures**: Check build logs in Render dashboard
2. **Application Crashes**: Check application logs in Render dashboard
3. **Database Connection Issues**: Verify MongoDB URI and IP whitelist
4. **Environment Variables**: Make sure all required variables are set

## Scaling Up

When you outgrow the free tier:
1. Upgrade to Render's paid plans
2. Move to a dedicated MongoDB instance
3. Consider using a CDN for static assets
4. Implement caching for better performance