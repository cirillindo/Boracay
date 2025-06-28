const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Timeout for requests
const FETCH_TIMEOUT = 5000;

// Crawler detection
const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'facebookexternalhit', 'twitterbot', 
  'linkedinbot', 'whatsapp', 'bytespider', 'bot', 'crawler', 'spider'
];

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => lowerUA.includes(crawler));
};

exports.handler = async (event, context) => {
  console.log('🚀 OG Generator started');
  const path = event.path.replace(/\/$/, ''); // Remove trailing slashes
  const userAgent = event.headers['user-agent'] || '';
  const isBotRequest = isCrawler(userAgent);
  const siteUrl = `https://${event.headers.host}`;
  
  console.log('🔍 Path:', path);
  console.log('🔍 User-Agent:', userAgent);
  console.log('🔍 Is Bot:', isBotRequest);
  console.log('🔍 Supabase URL:', supabaseUrl);
  
  // List of excluded paths
  const EXCLUDED_PATHS = [
    '/about', '/airbnb', '/for-sale', '/blog', '/contact', 
    '/guest-help', '/vacation-rental-management', '/payment',
    '/payment-success', '/privacy-policy', '/we-do-better',
    '/favorites', '/admin'
  ];

  let htmlContent;
  
  try {
    // Fetch base HTML
    const response = await axios.get(`${siteUrl}/index.html`, {
      timeout: FETCH_TIMEOUT
    });
    htmlContent = response.data;
    
    // Return early for non-bots
    if (!isBotRequest) {
      console.log('🤖 Not a bot - returning original HTML');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: htmlContent,
      };
    }
  } catch (error) {
    console.error('❌ Error fetching HTML:', error.message);
    // Fallback HTML
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head>
        <title>Boracay.House</title>
        <meta property="og:title" content="Boracay.House">
        <meta property="og:description" content="Your source for Boracay Properties">
        <meta property="og:image" content="https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg">
        <meta property="og:url" content="${siteUrl}${path}">
        </head><body><h1>Loading...</h1></body></html>`
    };
  }

  // Default OG values
  let ogTitle = "Boracay.House – Property in Boracay, Made Simple";
  let ogDescription = "Your source for Boracay Properties for sale and rentals";
  let ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
  let ogUrl = `${siteUrl}${path}`;
  let ogType = "website";
  let pageTitle = ogTitle;
  let metaDescription = ogDescription;

  try {
    // 1. BLOG PAGES
    if (path.startsWith('/blog/')) {
      const parts = path.split('/').filter(p => p);
      
      if (parts.length >= 2) {
        const slug = parts[parts.length - 1];
        console.log('📝 Blog slug:', slug);

        const { data } = await supabase
          .from('blog_posts')
          .select('title, excerpt, image_url, seo_title, seo_description, og_title, og_description, og_image')
          .eq('slug', slug)
          .single();

        if (data) {
          pageTitle = data.seo_title || data.title || ogTitle;
          metaDescription = data.seo_description || data.excerpt || ogDescription;
          ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
          ogDescription = data.og_description || data.seo_description || data.excerpt || ogDescription;
          ogImage = data.og_image || data.image_url || ogImage;
          ogType = "article";
          
          console.log('✅ Blog data loaded');
        }
      }
    } 
    // 2. PROPERTY PAGES - ENHANCED DEBUGGING
    else {
      // Check if this is a property page
      let slug = null;
      let isPropertyPage = false;
      
      // Debug path matching
      console.log('🔍 Checking path type:');
      console.log(`- Starts with /property/: ${path.startsWith('/property/')}`);
      console.log(`- Is single segment: ${/^\/[\w-]+$/.test(path)}`);
      console.log(`- Not excluded: ${!EXCLUDED_PATHS.includes(path)}`);
      
      if (path.startsWith('/property/')) {
        slug = path.split('/').pop();
        isPropertyPage = true;
        console.log('🏠 Property (type 1) slug:', slug);
      } 
      else if (/^\/[\w-]+$/.test(path) && !EXCLUDED_PATHS.includes(path)) {
        slug = path.substring(1);
        isPropertyPage = true;
        console.log('🏠 Property (type 2) slug:', slug);
      }
      
      if (isPropertyPage && slug) {
        // Sanitize slug
        slug = slug.replace(/[^\w-]/g, '').trim();
        console.log('🔍 Sanitized property slug:', slug);
        
        try {
          console.log('🔍 Querying properties table for slug:', slug);
          const { data, error } = await supabase
            .from('properties')
            .select(`
              title,
              description,
              hero_image,
              images,
              seo_title,
              seo_description,
              og_title,
              og_description,
              og_image,
              canonical_url
            `)
            .eq('slug', slug)
            .single();

          if (error) {
            console.error('❌ Supabase error:', error);
          }
          
          if (data) {
            console.log('✅ Property data found:', data.title);
            
            // OG fields from database
            ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
            ogDescription = data.og_description || data.seo_description || 
                           (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : ogDescription);
            
            // Image priority: og_image > hero_image > first image
            if (data.og_image) {
              ogImage = data.og_image;
              console.log('🖼️ Using OG image from database');
            } else if (data.hero_image) {
              ogImage = data.hero_image;
              console.log('🖼️ Using hero image');
            } else if (data.images && data.images.length > 0) {
              const firstImg = data.images[0];
              ogImage = typeof firstImg === 'string' ? firstImg : (firstImg.url || ogImage);
              console.log('🖼️ Using first listing image');
            }
            
            pageTitle = data.seo_title || data.title || ogTitle;
            metaDescription = data.seo_description || ogDescription;
            ogUrl = data.canonical_url || ogUrl;
          } else {
            console.log('⚠️ No property found with slug:', slug);
            // Property-specific fallback
            ogTitle = `Property: ${slug.replace(/-/g, ' ')} | Boracay.House`;
            ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
          }
        } catch (error) {
          console.error('❌ Property fetch error:', error.message);
          ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
        }
      }
      else {
        console.log('📌 Not a property page');
      }
    }
    
    // 3. SPECIAL PAGES
    if (path === '/airbnb') {
      ogTitle = "Airbnb Rentals in Boracay";
      ogDescription = "Find verified Airbnb-style rentals in Boracay";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677155/31_marketing_copy_ydbeuh.jpg";
    }
    else if (path === '/for-sale') {
      ogTitle = "Boracay Properties for Sale";
      ogDescription = "Smart property listings in Boracay";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
    }
    // Add other special pages as needed

  } catch (error) {
    console.error('❌ Main processing error:', error);
  }

  // Final OG values
  console.log('✨ Final OG Values:');
  console.log(`- Title: ${ogTitle}`);
  console.log(`- Description: ${ogDescription.substring(0, 60)}...`);
  console.log(`- Image: ${ogImage}`);
  console.log(`- URL: ${ogUrl}`);
  console.log(`- Type: ${ogType}`);

  // Add cache busting to image
  ogImage = ogImage.includes('?') 
    ? `${ogImage}&t=${Date.now()}` 
    : `${ogImage}?t=${Date.now()}`;

  // Inject OG tags
  try {
    const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
    const headMatch = htmlContent.match(headRegex);
    
    if (headMatch) {
      let headContent = headMatch[1]
        .replace(/<title[^>]*>.*?<\/title>/gi, '')
        .replace(/<meta\s+name="description"[^>]*>/gi, '')
        .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');
      
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
      
      htmlContent = htmlContent.replace(
        headRegex, 
        `<head>${headContent}${newMetaTags}</head>`
      );
      console.log('✅ OG tags injected successfully');
    }
  } catch (error) {
    console.error('❌ HTML injection error:', error);
  }

  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300'
    },
    body: htmlContent,
  };
};
