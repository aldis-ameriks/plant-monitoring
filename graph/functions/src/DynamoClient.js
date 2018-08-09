const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

const getItemByKey = async (key, value, limit = 100, table) => {
  console.log(`Getting item by key: ${key} and value: ${value} in table: ${table}`);
  const params = {
    TableName: table,
    IndexName: key,
    KeyConditionExpression: `${key} = :value`,
    ExpressionAttributeValues: {
      ':value': value,
    },
    Limit: limit,
  };
  const result = await dynamoDb.query(params).promise();
  if (result.Count === 1) {
    return result.Items[0];
  }
  if (result.Count > 1) {
    return result.Items;
  }
  return null;
};

const createItem = (item, table) => {
  console.log(`Creating item: ${item} in table: ${table}`);
  return dynamoDb.put({ TableName: table, Item: { ...item } }).promise();
};

module.exports = {
  getItemByKey,
  createItem,
};
