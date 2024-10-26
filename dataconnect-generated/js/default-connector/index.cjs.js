const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'lms-data-connect',
  location: 'australia-southeast2'
};
exports.connectorConfig = connectorConfig;

