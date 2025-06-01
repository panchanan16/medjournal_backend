const brevo = require('@getbrevo/brevo');


async function SendEmail(params) {
  const emailBody = {
    "sender": {
      "name": "Sender Alex",
      "email": "office@theinternationalmedicine.com"
    },
    "to": [
      {
        "email": "p.deka.1625@gmail.com",
        "name": "John Doe"
      }
    ],
    "subject": "Hello world",
    "htmlContent": "<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
  }

  const sendMail = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    body: JSON.stringify(emailBody),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }
  })

  const response = await sendMail.json()
  console.log(response)
}

async function SendMailUsingBravo(url) {
  let apiInstance = new brevo.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "My {{params.subject}}";
  sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Main Content Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <!-- Email Icon -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="width: 80px; height: 80px; background-color: #667eea; border-radius: 50%; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; color: #ffffff;">✉</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td style="padding: 0 40px; text-align: center;">
                            <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 28px; font-weight: bold; line-height: 1.2;">Verify Your Email Address</h1>
                        </td>
                    </tr>
                    
                    <!-- Description -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px; text-align: center;">
                            <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up! Please click the button below to verify your email address and activate your account.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Verify Button -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="background-color: #667eea; border-radius: 30px; text-align: center;">
                                        <a href=${url} style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 30px;">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Alternative Link -->
                    <tr>
                        <td style="padding: 0 40px 20px 40px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                                Button not working? Copy and paste this link into your browser:<br>
                                <a href=${url} style="color: #667eea; text-decoration: none; word-break: break-all;">
                                    ${url}
                                </a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="border-top: 1px solid #eeeeee;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; line-height: 1.4;">
                                This verification link will expire in 24 hours for security reasons.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.4;">
                                Didn't request this email? <a href="mailto:support@example.com" style="color: #667eea; text-decoration: none;">Contact our support team</a>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Email Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto 0 auto;">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.4;">
                                © 2025 Your Company Name. All rights reserved.<br>
                                123 Business Street, City, State 12345
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  sendSmtpEmail.htmlContent = `Hello this Intro mail from us`
  sendSmtpEmail.sender = { "name": "theinternationalmedicine", "email": "office@theinternationalmedicine.com" };
  sendSmtpEmail.to = [
    { "email": "p.deka.1625@gmail.com", "name": "Panchanan Deka" }
  ];
  sendSmtpEmail.replyTo = { "email": "office@theinternationalmedicine.com", "name": "theinternationalmedicine" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "Email Verification from The International Medicine" };


  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });
}



module.exports = SendMailUsingBravo


