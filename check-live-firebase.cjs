const https = require('https');

https.get('https://fatihbelediyesi.vercel.app/assets/index-Fx3c4Ufr.js', (res) => {
  let jsCode = '';
  res.on('data', chunk => jsCode += chunk);
  res.on('end', () => {
    const match = jsCode.match(/apiKey:"[^"]+"/);
    const match2 = jsCode.match(/projectId:"[^"]+"/);
    console.log("Live API Key:", match ? match[0] : "Not found");
    console.log("Live Project ID:", match2 ? match2[0] : "Not found");
  });
});
