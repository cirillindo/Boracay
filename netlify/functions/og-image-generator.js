const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Configuration
const FETCH_TIMEOUT = 5000;
const DEFAULT_IMAGE = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
const CACHE_BUSTER = `t=${Date.now()}`;

// Crawler detection
const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'facebookexternalhit', 'twitterbot', 
  'linkedinbot', 'whatsapp', 'telegrambot', 'discordbot',
  'bytespider', 'gptbot', 'claude-bot', 'perplexitybot',
  'bot', 'crawler', 'spider', 'embed', 'preview'
];

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const lowerAgent = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => lowerAgent.includes(crawler));
};

// Default metadata
const DEFAULT_METADATA = {
  title: "Boracay.House – Property in Boracay, Made Simple",
  description: "Your source for Boracay Properties for sale, trusted local rentals, and insider travel tips.",
  image: DEFAULT_IMAGE,
  type: "website"
};

// Page-specific defaults
const PAGE_METADATA = {
  '/blog': {
    title: "Boracay Real Estate & Lifestyle Blog",
    description: "Expert real estate advice, Airbnb hosting tips, and local guides for Boracay Island.",
    image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677314/20_marketing_copy_evoyjn.jpg",
    type: "blog"
  },
  '/property': {
    title: "Boracay Properties for Sale & Rent",
    description: "Find your perfect property in Boracay with verified listings and local expertise.",
    image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg",
    type: "website"
  },
  '/airbnb': {
    title: "Airbnb Rentals in Boracay",
    description: "Verified Airbnb-style rentals in Boracay with local support.",
    image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677155/31_marketing_copy_ydbeuh.jpg"
  },
  // Add other pages as needed
};

// Helper to fetch with timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await axios.get(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

// Main handler
exports.handler = async (event, context) => {
  console.log('🔍 OG Generator Request:', event.path);
  
  const { path, headers } = event;
  const userAgent = headers['user-agent'] || '';
  const isBot = isCrawler(userAgent);
  
  // Skip processing for non-bots
  if (!isBot) {
    console.log('🔍 Regular user request - serving standard HTML');
    try {
      const response = await fetchWithTimeout(`https://${headers.host}/index.html`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: response.data
      };
    } catch (error) {
      return serveFallback(headers.host, path);
    }
  }

  console.log('🤖 Bot detected - generating enhanced OG tags');
  
  // Initialize metadata with defaults
  let metadata = { ...DEFAULT_METADATA };
  metadata.url = `https://${headers.host}${path}`;
  
  try {
    // Check for page-specific defaults
    const basePath = `/${path.split('/')[1]}`;
    if (PAGE_METADATA[basePath]) {
      Object.assign(metadata, PAGE_METADATA[basePath]);
    }

    // Handle dynamic content (blog posts and properties)
    if (path.startsWith('/blog/')) {
      await handleBlogPost(path, metadata);
    } else if (path.startsWith('/property/')) {
      await handleProperty(path, metadata);
    }

    // Verify and prepare the image URL
    metadata.image = await prepareImageUrl(metadata.image);
    
    // Generate the HTML response
    const html = await generateHtmlResponse(headers.host, path, metadata);
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300'
      },
      body: html
    };
    
  } catch (error) {
    console.error('❌ Error generating OG tags:', error);
    return serveFallback(headers.host, path);
  }
};

// Content handlers
async function handleBlogPost(path, metadata) {
  const slug = path.split('/').pop();
  console.log(`📝 Fetching blog post: ${slug}`);
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, excerpt, image_url, seo_title, seo_description, og_title, og_description, og_image, og_url')
    .eq('slug', slug)
    .single();

  if (!data || error) {
    console.log('⚠️ No blog post found, using defaults');
    return;
  }

  // Update metadata from post data
  metadata.title = data.og_title || data.seo_title || data.title || metadata.title;
  metadata.description = data.og_description || data.seo_description || data.excerpt || metadata.description;
  metadata.image = data.og_image || data.image_url || metadata.image;
  metadata.url = data.og_url || metadata.url;
  metadata.type = "article";
}

async function handleProperty(path, metadata) {
  const slug = path.split('/').pop();
  console.log(`🏠 Fetching property: ${slug}`);
  
  const { data, error } = await supabase
    .from('properties')
    .select('title, description, grid_photo, images, seo_title, seo_description, og_title, og_description, og_image, og_url')
    .eq('slug', slug)
    .single();

  if (!data || error) {
    console.log('⚠️ No property found, using defaults');
    return;
  }

  // Update metadata from property data
  metadata.title = data.og_title || data.seo_title || data.title || metadata.title;
  metadata.description = data.og_description || data.seo_description || 
                        (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : metadata.description;
  
  // Simplified image selection
  metadata.image = data.og_image || data.grid_photo || 
                 (data.images?.[0]?.url || data.images?.[0]) || 
                 metadata.image;
  
  metadata.url = data.og_url || metadata.url;
}

// Image handling
async function prepareImageUrl(imageUrl) {
  if (!imageUrl) return DEFAULT_IMAGE;
  
  // Add cache busting
  const separator = imageUrl.includes('?') ? '&' : '?';
  const finalUrl = `${imageUrl}${separator}${CACHE_BUSTER}`;
  
  // Verify image accessibility
  try {
    await fetchWithTimeout(finalUrl, { method: 'HEAD' });
    return finalUrl;
  } catch (error) {
    console.log('⚠️ Image not accessible, using default');
    return DEFAULT_IMAGE;
  }
}

// HTML generation
async function generateHtmlResponse(host, path, metadata) {
  try {
    // Fetch base HTML
    const response = await fetchWithTimeout(`https://${host}/index.html`);
    let html = response.data;
    
    // Replace meta tags
    const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
    const headMatch = html.match(headRegex);
    
    if (!headMatch) {
      throw new Error('No <head> section found');
    }
    
    let headContent = headMatch[1]
      .replace(/<title[^>]*>.*?<\/title>/gi, '')
      .replace(/<meta\s+name="description"[^>]*>/gi, '')
      .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
      .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');
    
    // Add new meta tags
    const newMetaTags = `
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}">
      <meta property="og:title" content="${metadata.title}">
      <meta property="og:description" content="${metadata.description}">
      <meta property="og:image" content="${metadata.image}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:url" content="${metadata.url}">
      <meta property="og:type" content="${metadata.type}">
      <meta property="og:site_name" content="Boracay.House">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${metadata.title}">
      <meta name="twitter:description" content="${metadata.description}">
      <meta name="twitter:image" content="${metadata.image}">
    `;
    
    return html.replace(headRegex, `<head>${headContent}${newMetaTags}</head>`);
    
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
}

// Fallback response
function serveFallback(host, path) {
  console.log('⚠️ Serving fallback HTML');
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${DEFAULT_METADATA.title}</title>
          <meta property="og:title" content="${DEFAULT_METADATA.title}">
          <meta property="og:description" content="${DEFAULT_METADATA.description}">
          <meta property="og:image" content="${DEFAULT_IMAGE}">
          <meta property="og:url" content="https://${host}${path}">
          <meta property="og:type" content="website">
        </head>
        <body>
          <h1>Loading Boracay.House...</h1>
          <script>window.location.href = "/";</script>
        </body>
      </html>
    `
  };
}
