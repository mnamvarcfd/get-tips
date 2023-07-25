const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.REGION }); 

module.exports.createContact = async (event, context) => {
  // Retrieve the required data from the Lambda event
  const { sender, recipient, subject, body } = event;

  // Define the email parameters
  const params = {
    Source: sender,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };

  try {
    // Send the email using the SES service
    const data = await ses.sendEmail(params).promise();
    console.log('Email sent:', data);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (err) {
    console.error('Error sending email:', err);
    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
