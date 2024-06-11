const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourcough.site/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourcough.site/fullchain.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, secure world!');
}).listen(3000, () => {
  console.log('Listening on port 3000');
});
