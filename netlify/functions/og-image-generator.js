const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Timeout for fetch requests in milliseconds
const FETCH_TIMEOUT = 5000;

// List of common crawler user agents (case-insensitive)
const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yahoo! slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterestbot',
  'slackbot',
  'whatsapp',
  'discordbot',
  'telegrambot',
  'applebot',
  'screaming frog',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'petalbot',
  'seznambot',
  'dotbot',
  'exabot',
  'msnbot',
  'sogou spider',
  'bytespider', // TikTok's crawler
  'gptbot', // OpenAI's crawler
  'claude-bot', // Anthropic's crawler
  'perplexitybot', // Perplexity AI's crawler
  'cohere-bot', // Cohere's crawler
  'ai-bot', // Generic AI bot
  'bot', // General bot identifier
  'crawler', // General crawler identifier
  'spider', // General spider identifier
];

// Function to check if the request is from a known crawler
const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const lowerCaseUserAgent = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => lowerCaseUserAgent.includes(crawler));
};

exports.handler = async (event, context) => {
  console.log('🔍 OG Image Generator function started');
  console.log('🔍 Request path:', event.path);
  console.log('🔍 Request host:', event.headers.host);
  console.log('🔍 Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('🔍 Supabase Anon Key:', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey.length + ')' : 'Missing');
  
  // Clean path by removing trailing slash
  const path = event.path.replace(/\/$/, '');
  const userAgent = event.headers['user-agent'] || '';
  const isBotRequest = isCrawler(userAgent);

  console.log('🔍 User-Agent:', userAgent);
  console.log('🔍 Is Bot Request:', isBotRequest);

  let htmlContent;
  let siteUrl = `https://${event.headers.host}`;

  try {
    // Fetch the base index.html from the deployed site with timeout
    console.log('🔍 Fetching base HTML from:', `${siteUrl}/index.html`);
    
    const response = await axios.get(`${siteUrl}/index.html`, {
      timeout: FETCH_TIMEOUT
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch HTML: ${response.status} ${response.statusText}`);
    }
    
    htmlContent = response.data;
    console.log('✅ Base HTML fetched successfully');

    // If it's not a bot request, return the HTML content directly without modification
    if (!isBotRequest) {
      console.log('🔍 Not a bot request, returning unmodified HTML');
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        },
        body: htmlContent,
      };
    }
  } catch (error) {
    console.error('❌ Error fetching base index.html:', error.message);
    // Provide a simple fallback HTML with basic OG tags
    htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Boracay.House</title>
          <meta property="og:title" content="Boracay.House – Property in Boracay, Made Simple">
          <meta property="og:description" content="Your source for Boracay Properties for sale, trusted local rentals, and insider travel tips.">
          <meta property="og:image" content="https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg">
          <meta property="og:url" content="https://${event.headers.host}${path}">
          <meta property="og:type" content="website">
        </head>
        <body>
          <h1>Loading Boracay.House...</h1>
          <script>window.location.href = "${siteUrl}${path}";</script>
        </body>
      </html>
    `;
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: htmlContent
    };
  }

  // Default Open Graph tags (from your homepage)
  let ogTitle = "Boracay.House – Property in Boracay, Made Simple";
  let ogDescription = "Your source for Boracay Properties for sale, trusted local rentals, and insider travel tips. Plan your dream island stay with real info and real people.";
  let ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
  let ogUrl = `https://${event.headers.host}${path}`;
  let ogType = "website";
  let pageTitle = ogTitle;
  let metaDescription = ogDescription;

  try {
    console.log('🔍 Processing path:', path);
    
    if (path.startsWith('/blog/')) {
      // ... [BLOG SECTION REMAINS UNCHANGED FROM ORIGINAL] ...
      // Keep your existing blog code here
    } 
    // FIXED PROPERTY SECTION STARTS HERE
    else if (path.startsWith('/property/') || (path.match(/^\/[\w-]+$/) && !path.match(/^\/(about|airbnb|for-sale|blog|contact|guest-help|vacation-rental-management|payment|payment-success|privacy-policy|we-do-better|favorites|admin)$/))) {
      let slug;
      if (path.startsWith('/property/')) {
        const parts = path.split('/');
        slug = parts[parts.length - 1]; // Last part is the slug
      } else {
        slug = path.substring(1); // Remove leading slash
      }
      
      // Sanitize slug
      slug = slug.replace(/[^\w-]/g, '').trim();
      console.log('🔍 Property slug:', slug);

      try {
        console.log('🔍 Fetching property data from Supabase');
        
        // Set timeout for Supabase query
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase query timeout')), FETCH_TIMEOUT)
        );
        
        const queryPromise = supabase
          .from('properties')
          .select('title, description, hero_image, images, seo_title, seo_description, og_title, og_description, og_image, og_url, og_type, canonical_url')
          .ilike('slug', slug)  // Case-insensitive search
          .single();
        
        // Race between the query and the timeout
        const { data, error } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => ({ data: null, error: new Error('Query timeout') }))
        ]);

        if (error) {
          console.error('❌ Supabase error details:', error);
          throw error;
        }

        if (data) {
          console.log('✅ Property data fetched successfully:', JSON.stringify(data, null, 2));
          pageTitle = data.seo_title || data.title || ogTitle;
          metaDescription = data.seo_description || (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : ogDescription);
          
          ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
          ogDescription = data.og_description || data.seo_description || (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : ogDescription;
          
          // Check for og_image first, then hero_image, then first image from images array
          if (data.og_image) {
            ogImage = data.og_image;
          } else if (data.hero_image) {
            ogImage = data.hero_image;
          } else if (data.images && data.images.length > 0) {
            // Handle both string arrays and object arrays
            if (typeof data.images[0] === 'string') {
              ogImage = data.images[0];
            } else if (typeof data.images[0] === 'object' && data.images[0] !== null && data.images[0].url) {
              ogImage = data.images[0].url;
            }
          }
          
          ogUrl = data.og_url || data.canonical_url || `https://${event.headers.host}${path}`;
          ogType = data.og_type || "website";
          
          console.log('🔍 Property OG values:');
          console.log('- Title:', ogTitle);
          console.log('- Description:', ogDescription?.substring(0, 50) + '...');
          console.log('- Image:', ogImage);
          console.log('- URL:', ogUrl);
          console.log('- Type:', ogType);
        } else {
          console.log('⚠️ No property data found for slug:', slug);
          // Property-specific fallback image
          ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
        }
      } catch (error) {
        console.error('❌ Property data fetch failed:', error.message);
        // Property-specific fallback image
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
      }
    } 
    // FIXED PROPERTY SECTION ENDS HERE
    else if (path === '/airbnb') {
        // ... [OTHER PAGES REMAIN UNCHANGED] ...
        // Keep your existing special pages code here
    } else {
      console.log('🔍 Using default OG values for path:', path);
    }

  } catch (error) {
    console.error('❌ Error fetching data for OG tags:', error.message);
    if (error.stack) {
      console.error('❌ Stack trace:', error.stack);
    }
    // Fallback to default OG tags if data fetching fails
  }

  // Add cache busting parameter to image URL
  if (ogImage) {
    const separator = ogImage.includes('?') ? '&' : '?';
    ogImage = `${ogImage}${separator}t=${Date.now()}`;
    console.log('🔍 Added cache busting to OG image:', ogImage);
  }

  // Test image URL accessibility with timeout
  try {
    console.log('🔍 Testing OG image URL accessibility:', ogImage);
    
    const imageResponse = await axios.head(ogImage, { 
      timeout: FETCH_TIMEOUT 
    });
    
    if (imageResponse.status < 200 || imageResponse.status >= 300) {
      throw new Error(`Image not accessible: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    console.log('✅ OG image is accessible. Status:', imageResponse.status);
  } catch (error) {
    console.error('❌ Error accessing OG image:', error.message);
    console.log('⚠️ Falling back to default image');
    ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
  }

  // Completely replace all meta tags and title with our dynamically generated ones
  try {
    console.log('🔍 Replacing HTML head content');
    
    // Extract everything between <head> and </head>
    const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
    const headMatch = htmlContent.match(headRegex);
    
    if (!headMatch) {
      throw new Error('Could not find <head> section in HTML');
    }
    
    let headContent = headMatch[1];
    
    // Remove existing title tag
    headContent = headContent.replace(/<title[^>]*>.*?<\/title>/gi, '');
    
    // Remove existing meta description tag
    headContent = headContent.replace(/<meta\s+name="description"[^>]*>/gi, '');
    
    // Remove all existing OG tags
    headContent = headContent.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '');
    
    // Remove all existing Twitter card tags
    headContent = headContent.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');
    
    // Create new meta tags
    const newMetaTags = `
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${ogDescription}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${ogUrl}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="Boracay.House">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="${ogDescription}">
    <meta name="twitter:image" content="${ogImage}">
    `;
    
    // Insert new meta tags right before </head>
    const newHeadContent = headContent + newMetaTags;
    
    // Replace the old head content with the new one
    htmlContent = htmlContent.replace(headRegex, `<head>${newHeadContent}</head>`);
    
    console.log('✅ HTML head content replaced successfully');
  } catch (error) {
    console.error('❌ Error replacing HTML head content:', error.message);
  }

  // Log the final OG tags for debugging
  console.log('🔍 Final OG tags:');
  console.log('- Title:', ogTitle);
  console.log('- Description:', ogDescription?.substring(0, 50) + '...');
  console.log('- Image:', ogImage);
  console.log('- URL:', ogUrl);
  console.log('- Type:', ogType);
  console.log('- Path:', path);
  console.log('✅ OG Image Generator function completed');

  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
    },
    body: htmlContent,
  };
};
