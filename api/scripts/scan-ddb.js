const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  accessKeyId: 'testapi',
  secretAccessKey: 'testapi'
});

(async () => {
  try {
    const res = await ddb.scan({ TableName: 'Items' }).promise();
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
