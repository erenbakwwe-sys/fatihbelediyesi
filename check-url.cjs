const https = require('https');
https.get('https://fatihbelediyesi.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.slice(0, 1000)); // Print just the start to see if it matches my code
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});
