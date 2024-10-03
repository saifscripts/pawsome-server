export const USER_ROLE = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export const UserRoles = ['admin', 'user'] as const;

export const USER_STATUS = {
    ACTIVE: 'active',
    BLOCKED: 'blocked',
} as const;

export const UserStatus = ['active', 'blocked'] as const;

export const USER_TYPE = {
    BASIC: 'basic',
    PREMIUM: 'premium',
} as const;

export const UserType = ['basic', 'premium'] as const;

export const CONTACT_FORM_MESSAGE = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style>
            .container {
                max-width: 600px;
                background-color: #eeeeee;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333333;
            }
            .details {
                margin-bottom: 20px;
            }
            .details p {
                margin: 5px 0;
                color: #666666;
            }
            .message {
                margin-bottom: 20px;
            }
            .footer {
                text-align: center;
                color: #888888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Contact Form Submission</h2>

            <div class="details">
                <p><strong>Name:</strong> {{name}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Phone:</strong> {{phone}}</p>
            </div>

            <div class="message">
                <p><strong>Message:</strong></p>
                <p>{{message}}</p>
            </div>

            <div class="footer">
                <p>
                    This message was sent via the contact form your website.
                </p>
            </div>
        </div>
    </body>
</html>
`;
