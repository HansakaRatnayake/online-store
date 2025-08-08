export function generatePasswordResetEmail(name: string, tempPassword: string): string {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Password Reset - Smart Cart</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #007bff;
        color: #ffffff;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 15px;
      }
      .password-box {
        background-color: #e9ecef;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 10px 0;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>We have received a request to reset your password for your Smart Cart account. Below is your temporary password:</p>
        <div class="password-box">${tempPassword}</div>
        <p>Please use this temporary password to log in and update your password as soon as possible.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Log In to Smart Cart</a>
        </p>
        <p>If you did not request a password reset, please contact our support team immediately at support@smartcart.com.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Smart Cart. All rights reserved.</p>
        <p>123 Commerce Street, E-City, EC 12345</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
