const fs = require('fs');
(async()=>{
    const data = await fs.readFileSync('../ai/miniLM_browser_model/model.safetensors', {encoding: 'base64'});
    fs.writeFileSync("./model.safetensors.base64.js",`window.sagetensors = "${data}"`);
})();