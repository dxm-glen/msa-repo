import AWS from 'aws-sdk';

const region = process.env.REACT_APP_AWS_REGION;
const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default dynamoDb;
