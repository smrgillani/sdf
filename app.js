// Get dependencies
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const http = require('http');
const frameguard = require('frameguard');

process.on('uncaughtException', function(err) {
  console.log('Oooops ~~~~ uncaughtException = ' + err.stack);
});

const app = express();

app.use(frameguard({ action: 'deny' }));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
var port = process.env.PORT || 3000;
/**
 * Listen on provided port, on all network interfaces.
 */

/*Start - For https*/
var https = require('https');  
var fs = require('fs');
var httpsport = process.env.SECURE_PORT || 3443;
   
var options = {  
  key: fs.readFileSync('cert/hostkey.pem'),  
  cert: fs.readFileSync('cert/hostcert.pem')  
};  
   
https.createServer(options, app).listen(httpsport, function (err) {
  if (err) {
      throw err
  }
  console.log('Secure server is listening on '+httpsport+'...');
});

/*End - For https */

// server.listen(port,'10.0.2.51');
server.listen(port, function (err) {
  if (err) {
      throw err
  }
  console.log('Insecure server is listening on '+port+'...');
});
server.on('error', onError);
server.timeout = 30000;

function onError(error) {
  console.log(error);

  if (error.syscall !== 'listen') {
    console.log('error');
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCESS':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
