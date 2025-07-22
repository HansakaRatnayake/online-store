export const newsletterThankYouTemplate = (userName: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Thank You for Subscribing</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div style="max-width: 600px; background-color: #ffffff; margin: 40px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <div style="background-color: #0d9488; color: white; padding: 30px 20px 20px 20px; text-align: center;">
          <img src="https://logopond.com/logos/2e8835b000ff8224e0a278a0b1ce098f.png" alt="Smart Cart Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
          <h1 style="margin: 0;">Smart Cart</h1>
        </div>
        
        <div style="padding: 30px; color: #333333;">
          <h2 style="margin-top: 0;">Hello ${userName || "there"} 👋</h2>
          <p>Thank you for subscribing to our <strong>Smart Cart</strong> newsletter! 🎉</p>
          <p>You’ll now be the first to know about new arrivals, exclusive deals, and exciting offers.</p>
          <p>We’re thrilled to have you with us.</p>
          
          <a href="https://your-smart-cart.com" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 5px;">Visit Our Store</a>
        </div>
        
        <div style="padding: 20px; font-size: 12px; color: #777777; text-align: center;">
          &copy; ${new Date().getFullYear()} Smart Cart. All rights reserved.
        </div>

      </div>
    </body>
    </html>
  `;
};
