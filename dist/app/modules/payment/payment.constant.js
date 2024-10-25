"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failPage = exports.successPage = exports.PaymentStatus = exports.PAYMENT_STATUS = exports.SUBSCRIPTION_FEE = exports.SubscriptionTypes = exports.SUBSCRIPTION_TYPE = void 0;
exports.SUBSCRIPTION_TYPE = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
};
exports.SubscriptionTypes = ['monthly', 'yearly'];
exports.SUBSCRIPTION_FEE = {
    monthly: 99,
    yearly: 949,
};
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
};
exports.PaymentStatus = ['pending', 'success', 'failed'];
exports.successPage = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
        />
        <title>Payment Success</title>
        <style>
            :root {
                --background: 346 100% 100%;
                --foreground: 346 5% 10%;
                --card: 346 50% 100%;
                --card-foreground: 346 5% 15%;
                --popover: 346 100% 100%;
                --popover-foreground: 346 100% 10%;
                --primary: 212.02 100% 46.67%;
                --primary-foreground: 0 0% 100%;
                --secondary: 346 30% 90%;
                --secondary-foreground: 0 0% 0%;
                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;
                --accent: 308 30% 90%;
                --accent-foreground: 346 5% 15%;
                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 0 0% 98%;
                --border: 20 5.9% 90%;
                --input: 20 5.9% 90%;
                --ring: 346 79.4% 38%;
                --radius: 0.5rem;
                --success: 150 81.5% 36.1%;
                --success-foreground: 0 0% 100%;
            }
            .dark {
                --background: 346 50% 10%;
                --foreground: 346 5% 100%;
                --card: 346 50% 10%;
                --card-foreground: 346 5% 100%;
                --popover: 346 50% 5%;
                --popover-foreground: 346 5% 100%;
                --primary: 212.02 100% 46.67%;
                --primary-foreground: 0 0% 100%;
                --secondary: 346 30% 20%;
                --secondary-foreground: 0 0% 100%;
                --muted: 308 30% 25%;
                --muted-foreground: 346 5% 65%;
                --accent: 308 30% 25%;
                --accent-foreground: 346 5% 95%;
                --destructive: 0 100% 50%;
                --destructive-foreground: 346 5% 100%;
                --border: 346 30% 50%;
                --input: 346 30% 50%;
                --ring: 346 79.4% 38%;
                --radius: 0.5rem;
                --success: 150 81.5% 36.1%;
                --success-foreground: 0 0% 100%;
            }
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Open Sans', sans-serif;
                background-color: #eeeeee;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 24px;
                padding: 24px;
                text-align: center;
                max-width: 500px;
                width: 100%;
            }

            .title {
                color: hsl(var(--success));
                font-size: 24px;
                margin: 0 0 20px 0;
            }

            .description {
                color: hsl(var(--foreground));
                font-size: 16px;
                margin: 0 0 20px 0;
            }

            .primary-button {
                background-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .primary-button:hover {
                filter: brightness(110%);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Payment Successful!</h1>
            <p class="description">
                Your payment has been processed successfully. Thank you for
                subscribing.
            </p>
            <a href="{{primary-link}}" class="primary-button"
                >{{primary-text}}</a
            >
        </div>
    </body>
</html>
`;
exports.failPage = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
        />
        <title>Payment Success</title>
        <style>
            :root {
                --background: 346 100% 100%;
                --foreground: 346 5% 10%;
                --card: 346 50% 100%;
                --card-foreground: 346 5% 15%;
                --popover: 346 100% 100%;
                --popover-foreground: 346 100% 10%;
                --primary: 212.02 100% 46.67%;
                --primary-foreground: 0 0% 100%;
                --secondary: 346 30% 90%;
                --secondary-foreground: 0 0% 0%;
                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;
                --accent: 308 30% 90%;
                --accent-foreground: 346 5% 15%;
                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 0 0% 98%;
                --border: 20 5.9% 90%;
                --input: 20 5.9% 90%;
                --ring: 346 79.4% 38%;
                --radius: 0.5rem;
                --success: 150 81.5% 36.1%;
                --success-foreground: 0 0% 100%;
            }
            .dark {
                --background: 346 50% 10%;
                --foreground: 346 5% 100%;
                --card: 346 50% 10%;
                --card-foreground: 346 5% 100%;
                --popover: 346 50% 5%;
                --popover-foreground: 346 5% 100%;
                --primary: 212.02 100% 46.67%;
                --primary-foreground: 0 0% 100%;
                --secondary: 346 30% 20%;
                --secondary-foreground: 0 0% 100%;
                --muted: 308 30% 25%;
                --muted-foreground: 346 5% 65%;
                --accent: 308 30% 25%;
                --accent-foreground: 346 5% 95%;
                --destructive: 0 100% 50%;
                --destructive-foreground: 346 5% 100%;
                --border: 346 30% 50%;
                --input: 346 30% 50%;
                --ring: 346 79.4% 38%;
                --radius: 0.5rem;
                --success: 150 81.5% 36.1%;
                --success-foreground: 0 0% 100%;
            }
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Open Sans', sans-serif;
                background-color: #eeeeee;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 24px;
                padding: 24px;
                text-align: center;
                max-width: 500px;
                width: 100%;
            }

            .title {
                color: hsl(var(--destructive));
                font-size: 24px;
                margin: 0 0 20px 0;
            }

            .description {
                color: hsl(var(--foreground));
                font-size: 16px;
                margin: 0 0 20px 0;
            }

            .cta {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 16px;
            }

            .primary-button {
                background-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .primary-button:hover {
                filter: brightness(110%);
            }

            .secondary-button {
                background-color: #ffffff;
                color: hsl(var(--foreground));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: 1px solid hsl(var(--border));
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .secondary-button:hover {
                filter: brightness(110%);
            }

            @media screen and (max-width: 400px) {
                .cta {
                    flex-direction: column-reverse;
                }
                .primary-button,
                .secondary-button {
                    width: 80%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Payment Failed!</h1>
            <p class="description">
                Oops! Something went wrong with your payment. Please try again
                or contact support if you need assistance.
            </p>
            <div class="cta">
                <a href="{{secondary-link}}" class="secondary-button"
                    >{{secondary-text}}</a
                >
                <a href="{{primary-link}}" class="primary-button"
                    >{{primary-text}}</a
                >
            </div>
        </div>
    </body>
</html>
`;
