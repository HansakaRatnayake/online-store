// src/templates/welcomeEmail.ts

export const generateWelcomeEmail = (userName: string) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        
        <div style="text-align: center;">
          <img src="https://logopond.com/logos/2e8835b000ff8224e0a278a0b1ce098f.png" alt="Smart Cart" width="120" />
          <h1 style="color: #333;">Welcome to <span style="color: #0f9d58;">Smart Cart</span>!</h1>
        </div>

        <p style="font-size: 16px; color: #555;">
          Hello <strong>${userName}</strong>,
        </p>

        <p style="font-size: 16px; color: #555;">
          <strong>Thank you for registering with us!</strong> We’re thrilled to have you join the Smart Cart family.
        </p>

        <p style="font-size: 16px; color: #555;">
          From daily essentials to the latest tech, we’ve got it all. Stay tuned for exclusive deals, special discounts, and personalized recommendations just for you.
        </p>

        <p style="font-size: 16px; color: #555;">
          If you ever need help or have questions, our support team is always here for you.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/products" style="background-color: #0f9d58; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px;">Start Shopping</a>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd;" />

        <p style="font-size: 12px; color: #aaa; text-align: center;">
          You are receiving this email because you signed up for Smart Cart.<br/>
          Smart Cart Inc, 123 Market St, Colombo, Sri Lanka
        </p>
      </div>
    </div>
  `;
};
