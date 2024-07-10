import AWS from 'aws-sdk';

// 환경 변수 로드
const region = process.env.REACT_APP_AWS_REGION;
const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default dynamoDB;
