export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  land_size?: number;
  lot_size?: number;
  location: string;
  location_name?: string;
  status: string;
  property_type: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id?: string;
  grid_photo?: string;
  grid_photo_overlay?: string;
  map_url?: string;
  map_coordinates?: any;
  hero_image?: string;
  photo_dimensions?: any;
  furnish_status?: string;
  label?: string;
  description?: string;
  is_for_sale?: boolean;
  is_for_rent?: boolean;
  airbnb_url?: string;
  nightly_rate_min?: number;
  nightly_rate_max?: number;
  max_occupancy?: number;
  rating?: number;
  seo_title?: string;
  seo_keywords?: string[];
  seo_description?: string;
  seo_image?: string;
  property_category?: string;
  features?: any;
  policy?: any;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
  og_type?: string;
  og_locale?: string;
  images?: any[];
  earnings_info?: string;
  legal_info?: string;
  pdf_url?: string;
  pdf_name?: string;
  selectedCurrency?: string;
  slug?: string;
  display_order?: number;
}

export interface ThingToNote {
  id: string;
  property_id: string;
  title: string;
  description: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  excerpt: string;
  image_url: string;
  location: string;
  price_range: string;
  price_level: number;
  rating: number;
  rating_count: number;
  cuisine_type: string;
  features: string[];
  specialties: string[];
  atmosphere: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  menu_url?: string;
  phone?: string;
  hours?: string;
  created_at: string;
}

export interface BlogSection {
  id: string;
  title: string;
  content: string;
  images: string[];
  youtubeUrls: string[];
  icon: React.ReactNode;
}