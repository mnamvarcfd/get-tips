# This is the architecture of the server-less backend of the application.
<div align="center">
  <img src="https://github.com/mnamvarcfd/get-tips/assets/46830884/f41c3dee-e6f3-4515-938b-f6169adaa386" width="600" height="400" alt="image">
</div>

The serverless application follows a scalable and event-driven architecture using AWS Lambda, Amazon SNS (Simple Notification Service), and Amazon EventBridge (formerly CloudWatch Events). The application allows users to interact with various endpoints via HTTP requests. 

# Let's break down the architecture:

AWS Lambda: The core of the application is built using AWS Lambda functions. Lambda functions are stateless, serverless computing services that respond to events from various sources.

Amazon SNS: The application uses Amazon SNS to manage pub/sub messaging. It has a topic to which messages can be published (published by one Lambda function and subscribed to by another).

Amazon EventBridge: The application uses EventBridge to schedule the execution of specific Lambda functions periodically. 
API Endpoints: The application provides HTTP endpoints that are mapped to different Lambda functions. These endpoints enable users to interact with the application.

AWS IAM: The application defines an IAM role for each Lambda function with specific permissions. The role allows the Lambda functions to access AWS services like SNS.

# The high-level flow of the application is as follows:
When a user requests quotes, the get quotes Lambda function is triggered via an HTTP request. The function retrieves quotes from some data source stored in the s3 bucket and returns them as an HTTP response.

In addition, a user can subscribe to get a quote every day. When a user submits a contact form via the front end, a Lambda function is triggered via an HTTP request. The function processes the input and adds the user as a subscriber to the app.

When a user subscribes, the subscribeSNS Lambda function is triggered via an HTTP request. The function publishes a message to the SNS topic.
A function is scheduled to run periodically by EventBridge. It retrieves static content (e.g., newsletter) and sends it to subscribed users via SNS.

Overall, this architecture leverages the event-driven nature of AWS services, providing a scalable and cost-effective solution for handling different aspects of the application, from HTTP requests to scheduled tasks.
