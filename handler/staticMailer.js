const AWS = require('aws-sdk');
const { default: axios } = require('axios');
const sns = new AWS.SNS();

const publish2SNS = async (message) => {
  const params = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };

  await sns.publish(params).promise();
};

const buildEmailBody = (id, data) => {
  return `
    Message: ${data.message}
    Name: ${data.name}
    Email: ${data.email}
    Service information: ${id.sourceIp} - ${id.userAgent}
    `;
};

exports.staticMailer = async (event) => {
  try {
    // Extract email address from the request body or event payload
    const { email, data } = JSON.parse(event.body);

    const emailBody = buildEmailBody(event.requestContext.identity, data);

    // Publish the email address to the SNS topic
    await publish2SNS(emailBody);

    // Use try/catch to handle errors during the axios.post call
    try {
      await axios.post('https://bl31jnzmwc.execute-api.ca-central-1.amazonaws.com/dev/subscribe', { email: email });
    } catch (error) {
      console.error('Error in axios.post:', error);
      throw new Error('Error subscribing user.');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Email address published to SNS topic.' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error publishing email address to SNS topic.' }),
    };
  }
};
