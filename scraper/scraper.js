// scraper/scrape.js
const axios = require('axios');
const fs = require('fs');

async function scrape() {
  try {
    const response = await axios.get('https://www.nativenuclear.org/contact');
    fs.writeFileSync('./scraper/data.json', JSON.stringify(response.data, null, 2));
    console.log("Scraping complete. Data saved.");
  } catch (error) {
    console.error("Scraping failed:", error);
  }
}

scrape();
