require('dotenv').config();
// require('express-async-errors');

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const app = require('express')();
const config = require('config');
const loaders = require('./loaders/index');

// Load app
loaders(app);

const appName = config.get('name');
const port = config.get('port') || 4040;
const server = app.listen(port, () => console.log(`${appName} - Listening on port:[${port}]`));

module.exports = server;
