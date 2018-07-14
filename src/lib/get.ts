import * as http from 'http';

export default function get(options: http.RequestOptions) {
  return new Promise<string>((resolve, reject) => {
    http
      .get(options, response => {
        if (response.statusCode && (response.statusCode >= 300 || response.statusCode < 200)) {
          response.resume();
          return reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }

        const body: string[] = [];

        response
          .setEncoding('utf8')
          .on('data', chunk => {
            if (typeof chunk === 'string') {
              body.push(chunk);
            }
            // TODO: Buffer?
          })
          .on('end', () => resolve(body.join('')));
      })
      .on('error', reject);
  });
}
