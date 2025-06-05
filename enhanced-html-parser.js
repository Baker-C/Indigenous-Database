// enhanced-html-parser.js
const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// Main function to parse HTML and extract specific elements
function parseHTML(htmlContent) {
  try {
    // Load HTML content into cheerio
    const $ = cheerio.load(htmlContent);
    
    // Create an object to store all extracted data
    const extractedData = {
      pageTitle: $('title').text().trim(),
      metaDescription: $('meta[name="description"]').attr('content'),
      navigation: [],
      contactInfo: {},
      socialLinks: [],
      formFields: [],
      footerLinks: [],
      allHeadings: [],
      allLinks: []
    };

    // Extract navigation links
    console.log('===== NAVIGATION LINKS =====');
    $('.framer-17t5q3o a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      const isCurrent = $(element).attr('data-framer-page-link-current') === 'true';
      
      if (href && text) {
        extractedData.navigation.push({ href, text, isCurrent });
      }
    });
    console.log(extractedData.navigation);

    // Extract contact form fields
    console.log('\n===== CONTACT FORM FIELDS =====');
    $('form input, form textarea').each((index, element) => {
      const type = $(element).attr('type') || 'textarea';
      const name = $(element).attr('name');
      const placeholder = $(element).attr('placeholder');
      const required = $(element).attr('required') !== undefined;
      
      if (name) {
        extractedData.formFields.push({ type, name, placeholder, required });
      }
    });
    console.log(extractedData.formFields);

    // Extract email contact info
    console.log('\n===== EMAIL CONTACT INFO =====');
    const emailDiv = $('.framer-1j6ztqo');
    if (emailDiv.length > 0) {
      const emailText = emailDiv.find('.framer-6gdhey').text().trim();
      extractedData.contactInfo.email = emailText;
      console.log(`Email: ${emailText}`);
    }

    // Extract social media links
    console.log('\n===== SOCIAL MEDIA LINKS =====');
    // For Instagram
    const instaLink = $('.framer-1ptlna2');
    if (instaLink.length > 0) {
      const href = instaLink.attr('href');
      const text = instaLink.find('.framer-2hlehg').text().trim();
      extractedData.socialLinks.push({ 
        platform: 'Instagram',
        href, 
        username: text 
      });
    }
    
    // For LinkedIn
    const linkedinLink = $('.framer-1sfd5lr');
    if (linkedinLink.length > 0) {
      const href = linkedinLink.attr('href');
      const text = linkedinLink.find('.framer-y12fkn').text().trim();
      extractedData.socialLinks.push({ 
        platform: 'LinkedIn',
        href, 
        username: text 
      });
    }
    console.log(extractedData.socialLinks);

    // Extract all headings for content structure
    console.log('\n===== CONTENT STRUCTURE (HEADINGS) =====');
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const text = $(element).text().trim();
      if (text) {
        extractedData.allHeadings.push({
          type: element.name,
          text: text,
          classes: $(element).attr('class')
        });
      }
    });
    console.log(extractedData.allHeadings);

    // Extract footer links
    console.log('\n===== FOOTER LINKS =====');
    $('.framer-14576r1 a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (href && text) {
        extractedData.footerLinks.push({ href, text });
      }
    });
    console.log(extractedData.footerLinks);

    // Extract all links for mapping the site
    $('.framer-text a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      const target = $(element).attr('target');
      const rel = $(element).attr('rel');
      
      if (href && text) {
        extractedData.allLinks.push({ 
          href, 
          text,
          isExternal: target === '_blank' || (href && href.startsWith('http')),
          target,
          rel
        });
      }
    });

    // Save the structured data to a JSON file
    fs.writeFileSync('./extracted-data.json', JSON.stringify(extractedData, null, 2));
    console.log('\n===== EXTRACTION COMPLETE =====');
    console.log('All extracted data has been saved to extracted-data.json');
    
    return extractedData;
    
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
}

// Advanced extraction - Get all sections with their content
function extractPageSections(htmlContent) {
  try {
    const $ = cheerio.load(htmlContent);
    const sections = [];
    
    // Try to find major containers that might represent sections
    $('.framer-ysni7g, .framer-1hfykm7, .framer-5o9ae1').each((index, element) => {
      const sectionTitle = $(element).find('h1, h2, h3').first().text().trim();
      const sectionContent = $(element).text().trim().replace(/\s+/g, ' ');
      const sectionClass = $(element).attr('class');
      const sectionDataName = $(element).attr('data-framer-name');
      
      sections.push({
        id: index,
        title: sectionTitle || sectionDataName || `Section ${index + 1}`,
        class: sectionClass,
        contentPreview: sectionContent.substring(0, 100) + '...',
        hasForm: $(element).find('form').length > 0,
        hasLinks: $(element).find('a').length > 0,
        hasImages: $(element).find('img').length > 0
      });
    });
    
    console.log('\n===== PAGE SECTIONS =====');
    console.log(sections);
    return sections;
  } catch (error) {
    console.error('Error extracting page sections:', error);
    return [];
  }
}

// Read the data file and parse
function main() {
  const filePath = path.join(__dirname, 'scraper', 'data.json');
  try {
    // Read data from JSON file (the scraped HTML is stored as a JSON string)
    const rawData = fs.readFileSync(filePath, 'utf8');
    
    // Parse the HTML content
    const extractedData = parseHTML(rawData);
    
    // Get page sections
    const pageSections = extractPageSections(rawData);
    
    // You could add more specialized extraction functions here
    
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
  }
}

main();
