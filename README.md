# Pawsome | Pet Care Tips & Heartwarming Stories

### [Live URL](https://pawsome-client.vercel.app) | [Base URL (Server)](https://pawsome-server.vercel.app)

### [Frontend Repository](https://github.com/saifscripts/pawsome-client)

## Introduction

Pawsome is a comprehensive platform designed to provide pet owners with valuable resources, expert advice, and a community-driven space to better care for their pets. This project aims to bridge the gap between pet owners and essential pet care information, fostering a community where users can access premium content, share experiences, and find guidance on a range of topics, from health and nutrition to training and daily care.

## Project Description

The Pawsome platform offers users access to a mix of free and premium content, including detailed guides, tips, and personalized advice tailored to various types of pets. Users can choose between different subscription plans to unlock premium content and gain exclusive insights from pet care experts.

## Technology Used

-   **Programming Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **ODM**: Mongoose
-   **Validation Library**: Zod
-   **Authentication**: JSON Web Tokens (JWT)

## Features

-   User Authentication & Authorization

    -   Secure Registration and Login System
    -   Role-Based Access Control (Admin and User roles)
    -   Profile Management and Updates

-   Content Management

    -   Create, Read, Update, and Delete Posts
    -   Premium Content Access Control
    -   Comment System for Community Engagement
    -   Rich Media Support with Image Upload

-   Payment Integration

    -   Subscription Plan Management
    -   Secure Payment Processing via AmarPay
    -   Premium Content Access Control

-   User Experience
    -   Email Notifications via Nodemailer
    -   Input Validation and Error Handling
    -   Responsive API Design
    -   User Profile Customization

# Setup Instruction

Follow this step-by-step guide to run the server on your local machine.

### 1. Clone the Repository

First, clone the repository to your machine using the following command:

```
git clone https://github.com/saifscripts/pawsome-server.git
```

### 2. Change Directory

Next, navigate to the project directory with this command:

```
cd pawsome-server
```

### 3. Install Dependencies

Before running the app, you need to install all dependencies. You can do this using either Yarn or npm.

#### Using Yarn

```
yarn install
```

#### Using npm

```
npm install --legacy-peer-deps
```

### 4. Add a .env File

To run the app, create a `.env` file in the root folder with the following properties (I have included a few demo values here for testing):

```
NODE_ENV=development
PORT=5000
DB_URI=mongodb://localhost:27017/bike-rental
BASE_URL=http://localhost:5000
CLIENT_BASE_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=demo_secret
JWT_REFRESH_SECRET=demo_secret
JWT_RESET_SECRET=demo_secret
JWT_ACCESS_EXP_IN=7d
JWT_REFRESH_EXP_IN=365d
JWT_RESET_EXP_IN=10M
STORE_ID=aamarpaytest
SIGNATURE_KEY=your_signature_key
PAYMENT_BASE_URL=https://sandbox.aamarpay.com
MAIL_AUTH_USER=email
MAIL_AUTH_PASS=your_mail_auth_pass
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Run the App

Now, you're ready to run the app. Use one of the following commands to start the server.

#### Using Yarn

```
yarn dev
```

#### Using npm

```
npm run dev
```

That's it! The application should now be running locally.
