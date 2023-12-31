const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const { SubscribeCommand } = require("@aws-sdk/client-sns");
const { SNSClient } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({ region: process.env.REGION });

AWS.config.update({ region: process.env.REGION });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const subscribeToTopic = async (topicArn, protocol, endpoint) => {
  const params = {
    TopicArn: topicArn,
    Protocol: protocol,
    Endpoint: endpoint, 
  };

  try {
    const subscription = await snsClient.send(new SubscribeCommand(params));
    console.log('Subscription ARN:', subscription.SubscriptionArn);
    return subscription.SubscriptionArn;
  } catch (error) {
    console.error('Error subscribing to SNS topic:', error);
    throw error;
  }
};


exports.subscribeSNS = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const email = body.email;

    // Validate the email address
    EmailValidation();

    // Generate a unique id using uuidv4
    const id = uuidv4(); 

    // Prepare the item to put into the DynamoDB table
    const item = {
      TableName: process.env.USERS_TABLE , 
      Item: {
        userId: id,
        email: email,
        timestamp: new Date().toISOString(),
      },
    };


    // Put the item into the DynamoDB table
    await dynamoDB.put(item).promise();


    await subscribeToTopic(topicArn="arn:aws:sns:ca-central-1:919622682568:quotes-message-dev", protocol="email", endpoint=email)


    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully subscribed!', id, email }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.', error: error.message }),
    };
  }
};

// Function to validate the email address (simple validation!)
function EmailValidation(email) {
    
    // Check if the request body contains the 'email' field
    if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Email address is missing in the request body.' }),
        };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid email address.' }),
        };
    }
}
