import { Helmet } from 'react-helmet-async';
import { Property } from '../types';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  url: string;
  type?: string;
  canonical?: string;
  dynamicData?: any; // Property or BlogPost object
}

const SEO = ({ 
  title, 
  description, 
  keywords,
  ogImage, 
  url, 
  type = "website",
  canonical,
  dynamicData
}: SEOProps) => {
  // Ensure absolute URL for images
  const getAbsoluteUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `https://www.boracay.house${path.startsWith('/') ? path : `/${path}`}`;
  };

  // Add cache busting parameter to image URL
  const addCacheBuster = (imageUrl: string): string => {
    if (!imageUrl) return '';
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}t=${Date.now()}`;
  };

  // Prioritize dynamic data if available
  const finalTitle = dynamicData?.og_title || dynamicData?.seo_title || dynamicData?.title || title;
  const finalDescription = dynamicData?.og_description || dynamicData?.seo_description || dynamicData?.excerpt || description;
  const finalImage = dynamicData?.og_image || dynamicData?.image_url || ogImage;
  const finalUrl = dynamicData?.og_url || dynamicData?.canonical_url || url;
  const finalType = dynamicData?.og_type || type;
  const finalCanonical = dynamicData?.canonical_url || canonical || url;

  // Process the image URL
  const absoluteImage = getAbsoluteUrl(finalImage);
  const cachedImage = addCacheBuster(absoluteImage);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={cachedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={finalType} />
      <meta property="og:site_name" content="Boracay House" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={cachedImage} />
      
      {/* Canonical URL */}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}
      
      {/* Cache Control */}
      <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta http-equiv="pragma" content="no-cache" />
      <meta http-equiv="expires" content="0" />
    </Helmet>
  );
};

export default SEO;