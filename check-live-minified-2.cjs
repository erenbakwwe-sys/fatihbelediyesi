const https = require('https');

https.get('https://fatihbelediyesi.vercel.app/assets/index-Fx3c4Ufr.js', (res) => {
  let jsCode = '';
  res.on('data', chunk => jsCode += chunk);
  res.on('end', () => {
    console.log("Has drawer closing logic?", jsCode.includes('classList.remove(`open`)') || jsCode.includes('classList.remove("open")') || jsCode.includes("classList.remove('open')"));
  });
});
