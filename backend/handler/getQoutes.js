const dotenv = require('dotenv');
dotenv.config();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.getQoutes = async (event) => {
  const bucketName = process.env.BUCKET_NAME; 
  const fileName = process.env.FILE_NAME;

  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const data = await s3.getObject(params).promise();

    const jsonData = JSON.parse(data.Body.toString('utf-8'));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      },
      body: JSON.stringify(jsonData, null, 2), // Format JSON with 2 spaces indentation
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving JSON file from S3.' }),
    };
  }
};


