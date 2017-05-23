const http = require('http');

module.exports = function getJson (url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      if (response.statusCode >= 300 || response.statusCode < 200) {
        response.resume();
        return reject(new Error(`${response.statusCode} ${response.statusMessage}`));
      }

      const body = [];
      response.setEncoding('utf8')
        .on('data', chunk => body.push(chunk))
        .on('end', () => resolve(body.join('')));
    })
    .on('error', reject);
  })
  .then(JSON.parse);
}
