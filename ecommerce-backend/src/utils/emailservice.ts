import nodemailer from 'nodemailer';

// Reusable email sending function
export const sendEmail = async (to:any, subject:any, text:any,htmls:any) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gglakshan@@gmail.com', // Your email address
                pass: 'ptprbccnebchhngs' // Your email password from google app passwords
            }
        });

        // Define mail options
        const mailOptions = {
            from: 'gglakshan@gmail.com',  // Sender's email
            to,                           // Receiver's email passed as argument
            subject,                      // Subject passed as argument
            text,                          // Email body passed as argument
            html: htmls
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};