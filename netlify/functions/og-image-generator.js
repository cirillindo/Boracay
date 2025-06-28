const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const path = event.path.replace(/\/$/, ''); // Remove trailing slashes
  const userAgent = event.headers['user-agent'] || '';
  const siteUrl = `https://${event.headers.host}`;
  
  console.log('🔍 Handling path:', path);
  console.log('👤 User-Agent:', userAgent);

  // 1. Skip non-bot requests immediately
  const isBot = /bot|crawler|spider|facebook|twitter|pinterest|whatsapp|telegram|linkedin/i.test(userAgent.toLowerCase());
  if (!isBot) {
    try {
      const { data } = await axios.get(`${siteUrl}/index.html`, { timeout: 3000 });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: data
      };
    } catch (error) {
      return fallbackResponse(siteUrl, path);
    }
  }

  // 2. Default values
  let ogTitle = "Boracay.House – Property in Boracay, Made Simple";
  let ogDescription = "Your source for Boracay Properties for sale and rentals";
  let ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
  let ogUrl = `${siteUrl}${path}`;
  let pageTitle = ogTitle;
  
  // 3. Property Page Handling - NEW SIMPLIFIED APPROACH
  let propertySlug = null;
  
  // Extract slug from URL
  if (path.startsWith('/property/')) {
    propertySlug = path.split('/').pop(); // Get last segment
  } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
    propertySlug = path.substring(1); // Remove leading slash
  }
  
  if (propertySlug) {
    console.log('🏠 Detected property page. Slug:', propertySlug);
    
    // Clean and format slug
    const cleanSlug = propertySlug.replace(/[^\w-]/g, '').trim().toLowerCase();
    console.log('🔧 Cleaned slug:', cleanSlug);
    
    try {
      // Query Supabase with multiple fallbacks
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
          og_image
        `)
        .or(`slug.eq.${cleanSlug},title.ilike.%${cleanSlug.replace(/-/g, ' ')}%`)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error.message);
      }
      
      if (data) {
        console.log('✅ Found property:', data.title);
        
        // Use OG fields if available
        ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
        ogDescription = data.og_description || data.seo_description || 
                       (data.description ? data.description.substring(0, 160).replace(/<[^>]*>/g, '') : ogDescription);
        
        // Image selection with priority
        if (data.og_image) {
          ogImage = data.og_image;
        } else if (data.hero_image) {
          ogImage = data.hero_image;
        } else if (data.images && data.images.length > 0) {
          const firstImg = data.images[0];
          ogImage = typeof firstImg === 'string' ? firstImg : firstImg.url;
        }
        
        pageTitle = data.seo_title || data.title || ogTitle;
      } else {
        console.log('⚠️ No property found. Using default values.');
        ogTitle = `${cleanSlug.replace(/-/g, ' ')} | Boracay.House`;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
      }
    } catch (error) {
      console.error('❌ Property fetch failed:', error.message);
    }
  }
  // 4. Blog Page Handling (Keep your working blog logic)
  else if (path.startsWith('/blog/')) {
    // YOUR EXISTING BLOG CODE HERE
    // Keep this section exactly as it works in your current implementation
  }
  
  // 5. Inject OG tags
  try {
    const { data: html } = await axios.get(`${siteUrl}/index.html`, { timeout: 3000 });
    const updatedHtml = html
      .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
      .replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${ogTitle}"`)
      .replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${ogDescription}"`)
      .replace(/<meta property="og:image" content=".*?"/i, `<meta property="og:image" content="${ogImage}"`)
      .replace(/<meta property="og:url" content=".*?"/i, `<meta property="og:url" content="${ogUrl}"`);
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300'
      },
      body: updatedHtml
    };
  } catch (error) {
    return fallbackResponse(siteUrl, path, ogTitle, ogDescription, ogImage);
  }
};

// Helper functions
function fallbackResponse(siteUrl, path, title = 'Boracay.House', description = 'Boracay Property Listings', image = 'https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg') {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${image}">
          <meta property="og:url" content="${siteUrl}${path}">
        </head>
        <body>
          <h1>Loading Boracay.House...</h1>
          <script>window.location.href = "${siteUrl}${path}";</script>
        </body>
      </html>`
  };
}
