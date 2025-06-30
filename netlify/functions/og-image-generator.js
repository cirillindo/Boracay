const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Timeout for fetch requests in milliseconds
const FETCH_TIMEOUT = 10000; // Increased to 10 seconds

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

// Function to validate URLs
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Function to get the best available OG image
const getOgImage = (data, defaultImage) => {
  if (!data) return defaultImage;
  
  // Check all possible image sources in priority order
  const sources = [
    data.og_image,
    data.hero_image,
    ...(Array.isArray(data.images) ? data.images : []),
    defaultImage
  ];

  for (const source of sources) {
    if (!source) continue;
    
    // Handle string URLs
    if (typeof source === 'string' && isValidUrl(source)) {
      return source;
    }
    
    // Handle image objects
    if (typeof source === 'object' && source !== null) {
      if (source.url && isValidUrl(source.url)) {
        return source.url;
      }
    }
  }
  
  return defaultImage;
};

exports.handler = async (event, context) => {
  console.log('🔍 OG Image Generator function started');
  console.log('🔍 Request path:', event.path);
  console.log('🔍 Request host:', event.headers.host);
  console.log('🔍 Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('🔍 Supabase Anon Key:', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey.length + ')' : 'Missing');
  
  const path = event.path;
  const userAgent = event.headers['user-agent'] || '';
  const isBotRequest = isCrawler(userAgent);
  console.log('🔍 User-Agent:', userAgent);
  console.log('🔍 Is Bot Request:', isBotRequest);
  console.log('🔍 Full path being processed:', path);

  // Check if this is a property page (either /property/slug or direct /slug format)
  const isPropertyPage = path.startsWith('/property/') || 
                         (path.match(/^\/[^\/]+$/) && 
                          !path.match(/^\/(about|airbnb|for-sale|blog|contact|guest-help|vacation-rental-management|payment|payment-success|privacy-policy|we-do-better|favorites|admin)$/));
  
  console.log('🔍 Is Property Page:', isPropertyPage);
  
  if (isPropertyPage) {
    console.log('🔍 Processing as property page');
    
    // Extract slug from path
    let slug;
    if (path.startsWith('/property/')) {
      const parts = path.split('/');
      slug = parts[parts.length - 1]; // Last part is the slug
    } else {
      slug = path.substring(1); // Remove leading slash
    }
    
    console.log('🔍 Extracted property slug:', slug);
    console.log('🔍 Will query Supabase for property with slug:', slug);
  }

  let htmlContent;

  try {
    // Fetch the base index.html from the deployed site with timeout
    // This ensures we always start with the latest deployed HTML
    const siteUrl = `https://${event.headers.host}`;
    console.log('🔍 Fetching base HTML from:', `${siteUrl}/index.html`);
    
    // Using axios with timeout instead of fetch
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
    console.error('❌ Detailed error:', {
      message: error.message,
      path: path,
      stack: error.stack,
      response: error.response?.data
    });
    
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
      const parts = path.split('/');
      // Check if this is a blog post (has at least 3 parts: /blog/category/slug)
      if (parts.length >= 3) {
        const slug = parts[parts.length - 1]; // Last part is the slug
        console.log('🔍 Blog post slug:', slug);

        // Fetch blog post data from Supabase with timeout
        console.log('🔍 Fetching blog post data from Supabase');
        
        // Set timeout for Supabase query
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase query timeout')), FETCH_TIMEOUT)
        );
        
        const queryPromise = supabase
          .from('blog_posts')
          .select('title, excerpt, image_url, seo_title, seo_description, og_title, og_description, og_image, og_url, og_type, canonical_url')
          .eq('slug', slug)
          .single();
        
        // Race between the query and the timeout
        const { data, error } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => ({ data: null, error: new Error('Query timeout') }))
        ]);

        if (error) {
          console.error('❌ Supabase error fetching blog post:', error.message);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));
          throw error;
        }

        if (data) {
          console.log('✅ Blog post data fetched successfully:', JSON.stringify(data, null, 2));
          pageTitle = data.seo_title || data.title || ogTitle;
          metaDescription = data.seo_description || data.excerpt || ogDescription;
          ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
          ogDescription = data.og_description || data.seo_description || data.excerpt || ogDescription;
          ogImage = data.og_image || data.image_url || ogImage;
          ogUrl = data.og_url || data.canonical_url || `https://${event.headers.host}${path}`;
          ogType = data.og_type || "article";
          
          console.log('🔍 Blog post OG values:');
          console.log('- Title:', ogTitle);
          console.log('- Description:', ogDescription?.substring(0, 50) + '...');
          console.log('- Image:', ogImage);
          console.log('- URL:', ogUrl);
          console.log('- Type:', ogType);
        } else {
          console.log('⚠️ No blog post data found for slug:', slug);
        }
      } else if (parts.length === 2) {
        // This is the main blog page or a category page
        console.log('🔍 Processing Blog main or category page');
        ogTitle = "Boracay Real Estate & Lifestyle Blog – Tips, Insights & Island News";
        ogDescription = "Explore the Boracay.house blog for expert real estate advice, Airbnb hosting tips, local guides, and investment insights — all focused on Boracay Island.";
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677314/20_marketing_copy_evoyjn.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "blog";
        pageTitle = ogTitle;
        metaDescription = ogDescription;
        
        console.log('🔍 Blog main page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
      }
    } else if (path.startsWith('/property/') || (path.match(/^\/[^\/]+$/) && !path.match(/^\/(about|airbnb|for-sale|blog|contact|guest-help|vacation-rental-management|payment|payment-success|privacy-policy|we-do-better|favorites|admin)$/))) {
      // Match both /property/slug and /slug formats for properties
      let slug;
      if (path.startsWith('/property/')) {
        const parts = path.split('/');
        slug = parts[parts.length - 1]; // Last part is the slug
      } else {
        slug = path.substring(1); // Remove leading slash
      }
      
      console.log('🔍 Property slug:', slug);
      console.log('🔍 Attempting to fetch property data for slug:', slug);

      // Fetch property data from Supabase with timeout
      console.log('🔍 Fetching property data from Supabase');
      
      // Set timeout for Supabase query
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase query timeout')), FETCH_TIMEOUT)
      );
      
      const queryPromise = supabase
        .from('properties')
        .select('title, description, hero_image, images, seo_title, seo_description, og_title, og_description, og_image, og_url, og_type, canonical_url')
        .eq('slug', slug)
        .single();
      
      // Race between the query and the timeout
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error('Query timeout') }))
      ]);

      if (error) {
        console.error('❌ Supabase error fetching property:', error.message);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      if (data) {
        console.log('✅ Property data fetched successfully:', JSON.stringify(data, null, 2));
        pageTitle = data.seo_title || data.title || ogTitle;
        metaDescription = data.seo_description || (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : ogDescription);
        
        ogTitle = data.og_title || data.seo_title || data.title || ogTitle;
        ogDescription = data.og_description || data.seo_description || (data.description ? data.description.slice(0, 160).replace(/<[^>]*>/g, '') : ogDescription);
        
        // Use the improved image selection function
        console.log('🔍 Determining OG image from property data:');
        console.log('- og_image:', data.og_image);
        console.log('- hero_image:', data.hero_image);
        console.log('- images array:', JSON.stringify(data.images));
        
        const defaultImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749293212/05_marketing_copy_xqzpsf.jpg";
        ogImage = getOgImage(data, defaultImage);
        console.log('✅ Selected OG image:', ogImage);
        
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
      }
    } else if (path === '/airbnb') {
        console.log('🔍 Processing Airbnb page');
        pageTitle = "Airbnb Rentals in Boracay – Villas, Homes & Long Stays Near White Beach";
        metaDescription = "Find verified Airbnb-style rentals in Boracay. Book villas, houses, and apartments near White Beach with local support, fast Wi-Fi, and no stress.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677155/31_marketing_copy_ydbeuh.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Airbnb page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/for-sale') {
        console.log('🔍 Processing For Sale page');
        pageTitle = "Boracay Properties for Sale – Villas, Homes & Land Listings";
        metaDescription = "Smart property listings in Boracay with clean titles, legal clarity, and income potential. Browse villas, houses, and land 1–5 minutes from the beach — no overpriced beachfront traps.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "article";
        pageTitle = ogTitle;
        metaDescription = ogDescription;
        
        console.log('🔍 For Sale page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/beaches/puka-shell-beach') {
      console.log('🔍 Processing Puka Shell Beach page');
      pageTitle = "Puka Beach Boracay – Quiet, Natural Escape Near Diniwid";
      metaDescription = "Puka Beach in Boracay offers a quiet retreat with a crushed-shell shoreline and turquoise waters—ideal for those who prefer nature and tranquility over crowds.";
      ogTitle = "Discover Puka Beach – Boracay's Quiet Northern Retreat";
      ogDescription = "Escape to Puka Beach in Boracay for peaceful swimming, sunsets, and raw natural beauty far from the crowds.";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218656/Life_in_Boracay_tevx7m.webp";
      ogUrl = `https://${event.headers.host}${path}`;
      ogType = "article";
      
      console.log('🔍 Puka Beach OG values:');
      console.log('- Title:', ogTitle);
      console.log('- Description:', ogDescription);
      console.log('- Image:', ogImage);
      console.log('- URL:', ogUrl);
      console.log('- Type:', ogType);
    } else if (path === '/beaches/ilig-iligan-beach') {
      console.log('🔍 Processing Iligan Beach page');
      pageTitle = "Iligan Beach Boracay – Hidden Snorkeling Spot Near Diniwid";
      metaDescription = "Visit Iligan Beach, one of Boracay's best-kept secrets. Ideal for snorkeling, swimming, and relaxing away from White Beach crowds.";
      ogTitle = "Iligan Beach – Boracay's Best Hidden Snorkeling Beach";
      ogDescription = "Crystal waters, coral reefs, and quiet surroundings—explore Iligan Beach, Boracay's peaceful east-side secret.";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218635/Iligajn_Beachwebp_ntyigy.webp";
      ogUrl = `https://${event.headers.host}${path}`;
      ogType = "article";
      
      console.log('🔍 Iligan Beach OG values:');
      console.log('- Title:', ogTitle);
      console.log('- Description:', ogDescription);
      console.log('- Image:', ogImage);
      console.log('- URL:', ogUrl);
      console.log('- Type:', ogType);
    } else if (path === '/beaches/diniwid-beach') {
      console.log('🔍 Processing Diniwid Beach page');
      pageTitle = "Diniwid Beach Boracay – Private Vibe Next to White Beach";
      metaDescription = "Diniwid Beach offers peace and privacy with access to White Beach. Ideal for romantic getaways and small group stays in Boracay.";
      ogTitle = "Diniwid Beach – Boracay's Private Sunset Cove";
      ogDescription = "Relax at Diniwid Beach, where Boracay's laid-back charm meets golden sunsets and tranquil waters.";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218611/Diniwid_beach_sunset_rnzv4n.webp";
      ogUrl = `https://${event.headers.host}${path}`;
      ogType = "article";
      
      console.log('🔍 Diniwid Beach OG values:');
      console.log('- Title:', ogTitle);
      console.log('- Description:', ogDescription);
      console.log('- Image:', ogImage);
      console.log('- URL:', ogUrl);
      console.log('- Type:', ogType);
    } else if (path === '/beaches/white-beach') {
      console.log('🔍 Processing White Beach page');
      pageTitle = "White Beach Boracay – The Island's Most Famous Shoreline";
      metaDescription = "Visit White Beach, the center of Boracay life. From vibrant sunsets to beach bars and water sports—it's all here.";
      ogTitle = "White Beach – Boracay's Iconic Destination";
      ogDescription = "Discover why White Beach is Boracay's most popular destination—perfect sand, ocean fun, and vibrant evenings.";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Move_to_Boracay_u8a1qm.webp";
      ogUrl = `https://${event.headers.host}${path}`;
      ogType = "article";
      
      console.log('🔍 White Beach OG values:');
      console.log('- Title:', ogTitle);
      console.log('- Description:', ogDescription);
      console.log('- Image:', ogImage);
      console.log('- URL:', ogUrl);
      console.log('- Type:', ogType);
    } else if (path === '/beaches/tambisaan-beach') {
      console.log('🔍 Processing Tambisaan Beach page');
      pageTitle = "Tambisaan Beach Boracay – Local Vibes and Reef Adventures";
      metaDescription = "Tambisaan Beach offers access to marine life and fewer tourists. Great for budget travelers and morning snorkeling trips.";
      ogTitle = "Tambisaan Beach – Boracay's Reef-Friendly Local Spot";
      ogDescription = "Get close to island life and coral beauty at Tambisaan Beach, a chill, reef-rich beach away from the crowds.";
      ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218677/cfimages_jaw9nr.avif";
      ogUrl = `https://${event.headers.host}${path}`;
      ogType = "article";
      
      console.log('🔍 Tambisaan Beach OG values:');
      console.log('- Title:', ogTitle);
      console.log('- Description:', ogDescription);
      console.log('- Image:', ogImage);
      console.log('- URL:', ogUrl);
      console.log('- Type:', ogType);
    } else if (path === '/about') {
        console.log('🔍 Processing About page');
        pageTitle = "About Boracay House – Local Experts & Real Island Life";
        metaDescription = "Meet the team behind Boracay.House. We live here, build here, rent here. And we love helping you do the same.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/13_marketing_copy_xemnmh.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "profile";
        
        console.log('🔍 About page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/contact') {
        console.log('🔍 Processing Contact page');
        pageTitle = "Contact Boracay House – Get in Touch with Local Experts";
        metaDescription = "Have questions about properties in Boracay? Contact our local team for personalized assistance and expert advice.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/13_marketing_copy_xemnmh.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Contact page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/guest-help') {
        console.log('🔍 Processing Guest Help page');
        pageTitle = "Guest Help & Support | Boracay.house - Your Stay Made Easy";
        metaDescription = "Complete guest support for your Boracay stay. Emergency contacts, housekeeping, maintenance, and local services - all in one place.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1749289431/Helppage_se161f.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Guest Help page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/vacation-rental-management') {
        console.log('🔍 Processing Vacation Rental Management page');
        pageTitle = "Vacation Rental Management in Boracay | Full-Service Property Care";
        metaDescription = "Rent out your Boracay home stress-free. We manage listings, guests, cleaning, repairs, and bookings — end to end.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1748371472/Screenshot_2025-05-27_at_12.14.17_PM_efoue1_copy_cjtu8h.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Vacation Rental Management page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/payment' || path === '/payment-success') {
        console.log('🔍 Processing Payment page');
        pageTitle = "Make a Payment | Boracay.house";
        metaDescription = "Make a secure payment to Boracay.house. We accept Stripe, PayPal, GCash, Rubles, and Revolut.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/13_marketing_copy_xemnmh.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Payment page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/privacy-policy') {
        console.log('🔍 Processing Privacy Policy page');
        pageTitle = "Privacy Policy | Boracay.house";
        metaDescription = "Learn how Boracay.house collects, uses, and protects your personal information. Our privacy policy explains your rights and our practices.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/13_marketing_copy_xemnmh.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Privacy Policy page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/we-do-better') {
        console.log('🔍 Processing We Do Better page');
        pageTitle = "Why We're Different — and Why It Works | Boracay.house";
        metaDescription = "Discover how Boracay.house delivers exceptional property management and real estate services that outperform traditional agencies.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1748371020/Screenshot_2025-05-27_at_12.14.17_PM_efoue1_copy_cjtu8h.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 We Do Better page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else if (path === '/favorites') {
        console.log('🔍 Processing Favorites page');
        pageTitle = "Your Saved Properties | Boracay.house";
        metaDescription = "View and manage your favorite Boracay properties. Compare options and contact our team about your selected listings.";
        ogTitle = pageTitle;
        ogDescription = metaDescription;
        ogImage = "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677233/38_marketing_copy_j9vspj.jpg";
        ogUrl = `https://${event.headers.host}${path}`;
        ogType = "website";
        
        console.log('🔍 Favorites page OG values:');
        console.log('- Title:', ogTitle);
        console.log('- Description:', ogDescription);
        console.log('- Image:', ogImage);
        console.log('- URL:', ogUrl);
        console.log('- Type:', ogType);
    } else {
      console.log('🔍 Using default OG values for path:', path);
    }

  } catch (error) {
    console.error('❌ Error fetching data for OG tags:', error.message);
    console.error('❌ Detailed error:', {
      message: error.message,
      path: path,
      slug: path.startsWith('/property/') ? path.split('/').pop() : path.substring(1),
      stack: error.stack,
      response: error.response?.data
    });
    
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
    console.error('❌ Detailed error:', {
      message: error.message,
      imageUrl: ogImage,
      stack: error.stack,
      response: error.response?.data
    });
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
    console.error('❌ Detailed error:', {
      message: error.message,
      stack: error.stack
    });
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