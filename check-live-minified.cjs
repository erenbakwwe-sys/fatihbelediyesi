const https = require('https');

https.get('https://fatihbelediyesi.vercel.app/assets/index-Fx3c4Ufr.js', (res) => {
  let jsCode = '';
  res.on('data', chunk => jsCode += chunk);
  res.on('end', () => {
    console.log("Has 'open' removal?", jsCode.includes('.remove("open")') || jsCode.includes(".remove('open')"));
    console.log("Has modal-overlay fade-in?", jsCode.includes('modal-overlay fade-in'));
    console.log("Has admin-modal?", jsCode.includes('admin-modal'));
  });
});
