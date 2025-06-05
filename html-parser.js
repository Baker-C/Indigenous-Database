const fs = require('fs');
const cheerio = require('cheerio');

// Main function to parse HTML and extract specific elements
function parseHTML(htmlContent) {
  try {
    // Load HTML content into cheerio
    const $ = cheerio.load(htmlContent);
    
    // Example 1: Extract all links from the page
    console.log('===== LINKS ON THE PAGE =====');
    const links = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      if (href && text) {
        links.push({ href, text });
      }
    });
    console.log(links.slice(0, 10)); // Show first 10 links
    
    // Example 2: Extract all headings
    console.log('\n===== HEADINGS ON THE PAGE =====');
    const headings = [];
    $('h1, h2, h3').each((index, element) => {
      const text = $(element).text().trim();
      headings.push({ 
        type: element.name, 
        text 
      });
    });
    console.log(headings);
    
    // Example 3: Extract form fields
    console.log('\n===== FORM FIELDS =====');
    const formFields = [];
    $('input, textarea').each((index, element) => {
      const type = $(element).attr('type') || 'textarea';
      const name = $(element).attr('name');
      const placeholder = $(element).attr('placeholder');
      
      if (name) {
        formFields.push({ type, name, placeholder });
      }
    });
    console.log(formFields);

    // Example 4: Extract specific section by class or ID
    // Let's say you want to extract the contact information
    console.log('\n===== CONTACT INFO =====');
    const contactInfo = $('.framer-1j6ztqo').text().trim();
    console.log(contactInfo);
    
  } catch (error) {
    console.error('Error parsing HTML:', error);
  }
}

// Read the data file and parse
const filePath = './scraper/data.json';
try {
  // Read data from JSON file (the scraped HTML is stored as a JSON string)
  const rawData = fs.readFileSync(filePath, 'utf8');
  // Parse the HTML content
  parseHTML(rawData);
} catch (error) {
  console.error('Error reading or parsing the file:', error);
}
