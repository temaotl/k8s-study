const http = require('http');

const port = process.env.PORT || 4000;
const message = process.env.WELCOME_MESSAGE || 'Hello from default MiniApp!';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Message: ${message}\n`);
});

server.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
  console.log(`📣 WELCOME_MESSAGE = ${message}`);
});

