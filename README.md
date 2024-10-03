<!-- # RideX || Bike Reservation System

### [Live URL](https://ridex-alpha.vercel.app) | [Base URL (Server)](https://ridex-server.vercel.app)

### [Frontend Repository](https://github.com/saifscripts/ridex-client)

## Introduction

RiderX offers an intuitive booking system for renting bikes, managing rentals, and applying discounts to rentals.

## Project Description

Bike Rental Reservation System Backend using TypeScript, Express and Mongoose. This project offers API endpoints with role base authentication for RideX bike reservation application.

## Technology Used

-   **Programming Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **ODM**: Mongoose
-   **Validation Library**: Zod
-   **Authentication**: JSON Web Tokens (JWT)

## Features

-   User Registration and Authentication
-   Role Based Access Control: Admin and User Roles with Different Permissions
-   Retrieve and Update User's Own Profile
-   Add, Update and Delete Bike by the Admin
-   Bike Availability and Rental Management
-   Rental Transactions and Cost Calculation
-   Error Handling and Input Validation
-   AmarPay payment method integration
-   Email sending functionality using Nodemailer
-   Image Upload functionality using Cloudinary

# Setup Instruction

Follow this step-by-step guide to run the server on your local machine.

### 1. Clone the Repository

First, clone the repository to your machine using the following command:

```
git clone https://github.com/saifscripts/ridex-server.git
```

### 2. Change Directory

Next, navigate to the project directory with this command:

```
cd ridex-server
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
CLIENT_BASE_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=demo_secret
JWT_REFRESH_SECRET=demo_secret
JWT_ACCESS_EXP_IN=7d
JWT_REFRESH_EXP_IN=365d
STORE_ID=aamarpaytest
SIGNATURE_KEY=your_signature_key
PAYMENT_BASE_URL=https://sandbox.aamarpay.com
MAIL_AUTH_USER=email
MAIL_AUTH_PASS=your_mail_auth_pass
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note:** Change the `DATABASE_URL` if you want to use your own database URI.

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

That's it! The application should now be running locally. -->
