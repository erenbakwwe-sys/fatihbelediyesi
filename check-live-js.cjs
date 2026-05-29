const https = require('https');

https.get('https://fatihbelediyesi.vercel.app', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (!match) return console.log("Could not find main JS bundle.");
    
    const jsUrl = 'https://fatihbelediyesi.vercel.app' + match[1];
    console.log("Found JS:", jsUrl);
    
    https.get(jsUrl, (jsRes) => {
      let jsCode = '';
      jsRes.on('data', chunk => jsCode += chunk);
      jsRes.on('end', () => {
        console.log("Has withTimeout?", jsCode.includes('withTimeout'));
        console.log("Has drawer closing logic?", jsCode.includes('navLinksEl.classList.remove('));
      });
    });
  });
});
