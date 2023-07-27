'use strict';
require('dotenv').config();

// Start up DB Server
const { db } = require('./src/models');
db.sync()
  .then(() => {
    // Start the web server
    require('./src/server.js').start(process.env.PORT);
  })
  .catch((e) => {
    console.error('Could not start server', e.message);
  });
