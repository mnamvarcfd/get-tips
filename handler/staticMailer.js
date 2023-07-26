const AWS = require('aws-sdk');
const { default: axios } = require('axios');
const sns = new AWS.SNS();

const buildEmailBody = (id, data) => {
  try {

    const { message, name, email } = data;

    return `
    Message: ${message}
    Name: ${name}
    Email: ${email}
    Service information: ${id.sourceIp} - ${id.userAgent}
    `;
  } catch (error) {
    console.error('Error building email body:', error);
    throw error;
  }
};

const publish2SNS = async (message) => {
  try {
    const params = {
      Message: message,
      TopicArn: "arn:aws:sns:ca-central-1:919622682568:quotes-message-dev",
    };

    await sns.publish(params).promise();

    console.log('Message published to SNS topic successfully.');
  } catch (error) {
    console.error('Error publishing message by publish2SNS to SNS topic:', error);
    throw error; // Rethrow the error to be caught by the caller or the error handler
  }
};


exports.staticMailer = async (event) => {

  console.log(event.body);

  try {
    // Extract email address from the request body or event payload
    const data = JSON.parse(event.body);
    const email = data.email;

    // Use try/catch to handle errors during the axios.post call
    try {
      await axios.post('https://z4vfs1d5oe.execute-api.ca-central-1.amazonaws.com/dev/subscribe', { email: email });
    } catch (error) {
      throw new Error('Error subscribing user.');
    }

    const emailBody = buildEmailBody(event.requestContext.identity, data);

    // Publish the email address to the SNS topic
    await publish2SNS(emailBody);


    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: `Email ${email} address published to SNS topic {}.` }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error publishing email address to SNS topic.' }),
    };
  }
};
