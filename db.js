const debug = require('debug')('app:db');
const fs = require('fs');
const sql = require('mssql');

function connect() {
  if (process.env.DB === 'sql') {
    (async function connect2sql() {
      const config = {
        user: 'library-demo-admin',
        password: fs.readFileSync('D:\\Temp\\LIBRARY_DEMO_ADMIN_PASS.txt').toString(),
        server: 'library-demo-server.database.windows.net',
        database: 'library-demo',
        options: {
          encrypt: true // Use this if you are on Windows Azure
        }
      };
      try {
        debug('connectiong to Azure MsSQL...');
        await sql.connect(config);
        debug('connected to Azure MsSQL with success');
      } catch (error) {
        debug(`ERROR ${error} - Connection config to ${JSON.stringify(config)}`);
      }
    }());
  }
}

module.exports = {
  connect
};
