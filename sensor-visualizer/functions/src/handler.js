/* eslint-disable no-console */
const SensorService = require('./SensorService');
const GraphqlServer = require('./graphql');
const { ALLOWED_ORIGINS } = require('./config');

const getCorsHeaders = origin => {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    };
  }
  return {};
};

const handlePostReading = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const headers = getCorsHeaders(event.headers.origin);
  const parsedBody = JSON.parse(event.body);
  await SensorService.saveReading(parsedBody);
  callback(null, { statusCode: 200, headers, body: JSON.stringify({ message: 'success' }) });
};

const handleGetReadings = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const headers = getCorsHeaders(event.headers.origin);
  const { nodeid, limit, every } = event.queryStringParameters;
  const result = await SensorService.getReadings(nodeid, limit, every);
  callback(null, { statusCode: 200, headers, body: JSON.stringify(result) });
};

module.exports = {
  handlePostReading,
  handleGetReadings,
  graphql: GraphqlServer,
};
