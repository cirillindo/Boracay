import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Property, ThingToNote } from '../types';
import Container from '../components/ui/Container';
import { Heart, Bed, Bath, Home, MapPin, ArrowLeft, Expand, ExternalLink, Star, Share2, Printer, Info, AlertCircle, FileIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import PropertyCarousel from '../components/property/PropertyCarousel';
import GuestReviews from '../components/home/GuestReviews';
import FAQ from '../components/property/FAQ';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { playSound } from '../utils/audio';
import PropertyTabs from '../components/property/PropertyTabs';
import Accordion from '../components/ui/Accordion';
import InquireNowForm from '../components/forms/InquireNowForm';
import SEO from '../components/SEO';
import { logOGTags } from '../utils/ogDebugger';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = L.divIcon({
  className: 'custom-marker-icon',
  html: '<div class="marker-pin map-marker-pulse"></div>',
  iconSize: [40, 40],
  iconAnchor: [20, 35]
});

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, options]);

  return isVisible;
};

const unescapeHtmlEntities = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.innerHTML;
};

const PropertyPage: React.FC = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState<Property | null>(null);
  const [thingsToNote, setThingsToNote] = useState<ThingToNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const defaultPosition: [number, number] = [11.9929, 121.9124];
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const detailsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const thingsToNoteRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const isDetailsVisible = useIntersectionObserver(detailsRef);
  const isFeaturesVisible = useIntersectionObserver(featuresRef);
  const isDescriptionVisible = useIntersectionObserver(descriptionRef);
  const isThingsToNoteVisible = useIntersectionObserver(thingsToNoteRef);
  const isLocationVisible = useIntersectionObserver(locationRef);
  const isFaqVisible = useIntersectionObserver(faqRef);
  const isInquiryVisible = useIntersectionObserver(inquiryRef);
  const isSimilarVisible = useIntersectionObserver(similarRef);

  const currencies = [
    { value: 'EUR', label: 'EUR', symbol: '€', rate: 1 },
    { value: 'USD', label: 'USD', symbol: '$', rate: 1.08 },
    { value: 'PHP', label: 'PHP', symbol: '₱', rate: 60.50 },
    { value: 'AUD', label: 'AUD', symbol: 'A$', rate: 1.65 },
    { value: 'RUB', label: 'RUB', symbol: '₽', rate: 98.50 },
    { value: 'KRW', label: 'KRW', symbol: '₩', rate: 1450.25 },
    { value: 'CNY', label: 'CNY', symbol: '¥', rate: 7.85 }
  ];

  useEffect(() => {
    loadProperty();
  }, [id, slug]);

  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favoritesStr = localStorage.getItem('favorites');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      setIsFavorite(property ? favorites.includes(property.id) : false);
    };

    checkFavoriteStatus();

    window.addEventListener('favoritesUpdated', checkFavoriteStatus);
    return () => window.removeEventListener('favoritesUpdated', checkFavoriteStatus);
  }, [property]);

  useEffect(() => {
    setIsHeroVisible(true);
    
    const galleryTimer = setTimeout(() => {
      setIsGalleryVisible(true);
    }, 500);

    return () => clearTimeout(galleryTimer);
  }, []);

  // Debug OG tags
  useEffect(() => {
    if (property) {
      // Log OG tags after page loads
      const timer = setTimeout(() => {
        logOGTags();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [property]);

  const loadProperty = async () => {
    try {
      let query = supabase.from('properties').select('*');
      
      if (id) {
        query = query.eq('id', id);
      } else if (slug) {
        query = query.eq('slug', slug);
      } else {
        throw new Error('No identifier provided');
      }
      
      const { data, error } = await query.single();

      if (error) throw error;
      
      if (data && data.description) {
        data.description = unescapeHtmlEntities(data.description);
      }
      
      setProperty(data);

      const { data: thingsToNoteData, error: thingsToNoteError } = await supabase
        .from('things_to_note')
        .select('*')
        .eq('property_id', data.id)
        .order('created_at', { ascending: true });

      if (thingsToNoteError) throw thingsToNoteError;
      setThingsToNote(thingsToNoteData || []);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/for-sale');
  };

  const toggleFavorite = () => {
    if (!property) return;
    
    const favoritesStr = localStorage.getItem('favorites');
    const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];

    let newFavorites;
    if (favorites.includes(property.id)) {
      newFavorites = favorites.filter((fid: string) => fid !== property.id);
      setIsFavorite(false);
      playSound('click.mp3');
    } else {
      newFavorites = [...favorites, property.id];
      setIsFavorite(true);
      playSound('click.mp3');
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleShare = () => {
    // Add cache-busting parameter to URL
    const shareUrl = `${window.location.href}?v=${Date.now()}`;
    
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description?.slice(0, 100),
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const downloadPdf = async () => {
    if (!property || !property.pdf_url) return;
    
    try {
      const response = await fetch(property.pdf_url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${property.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = property.pdf_url;
      fallbackLink.download = `${property.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
          <p className="mt-2 text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    const currencyInfo = currencies.find(c => c.value === currency);
    if (!currencyInfo) return `€${price.toLocaleString()}`;
    
    const convertedPrice = price * currencyInfo.rate;
    return `${currencyInfo.symbol}${convertedPrice.toLocaleString('en-US', {
      maximumFractionDigits: 0
    })}`;
  };

  const position: [number, number] = property.map_coordinates 
    ? [property.map_coordinates.coordinates[1], property.map_coordinates.coordinates[0]]
    : defaultPosition;

  const validImages = (property.images || [])
    .filter(image => {
      if (typeof image === 'string') {
        return image && image.startsWith('http');
      } else if (typeof image === 'object' && image !== null) {
        return image.url && typeof image.url === 'string' && image.url.startsWith('http');
      }
      return false;
    })
    .map(image => {
      if (typeof image === 'string') {
        return image;
      } else {
        return image.url;
      }
    });

  const slides = validImages.map((url, index) => ({
    src: url,
    alt: `${property.title} - Property Image ${index + 1}`
  }));

  const heroImage = property.hero_image && property.hero_image.startsWith('http') 
    ? property.hero_image 
    : validImages[0];

  // Default keywords for property pages
  const defaultKeywords = "boracay property, boracay villa, boracay house, boracay real estate, boracay vacation rental";

  return (
    <>
      <SEO
        title={property.seo_title || `${property.title} - Boracay House`}
        description={property.seo_description || property.description?.slice(0, 160) || ''}
        keywords={property.seo_keywords?.join(', ') || defaultKeywords}
        ogImage={property.og_image || heroImage || "https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677056/37_marketing_copy_wg7umr.jpg"}
        url={`https://www.boracay.house${location.pathname}`}
        type={property.og_type || "website"}
        canonical={property.canonical_url}
        dynamicData={property}
      />

      <div className="min-h-screen bg-white">
        <div className="h-32" />
        
        <div 
          ref={heroRef}
          className="bg-white border-b"
          style={{
            opacity: isHeroVisible ? 1 : 0,
            transform: `translateY(${isHeroVisible ? '0' : '20px'})`,
            transition: 'opacity 1s ease-out, transform 1s ease-out'
          }}
        >
          <Container className="py-4 md:py-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex items-center text-gray-600 mb-2 md:mb-4">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    <span className="text-base md:text-lg font-['Roboto_Condensed']">{property.location_name || property.location}</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold font-['Roboto_Condensed'] text-gray-900 mb-3 md:mb-4 tracking-tight">
                    {property.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {property.status && (
                      <span className="px-2 md:px-3 py-1 bg-amber-600 text-white text-xs md:text-sm font-medium rounded-md">
                        {property.status.toUpperCase()}
                      </span>
                    )}
                    {property.grid_photo_overlay && (
                      <span className="px-2 md:px-3 py-1 bg-amber-700 text-white text-xs md:text-sm font-medium rounded-md">
                        {property.grid_photo_overlay}
                      </span>
                    )}
                    <span className="px-2 md:px-3 py-1 bg-green-600 text-white text-xs md:text-sm font-medium rounded-md">
                      NEW LISTING
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3 md:gap-4 order-1 md:order-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={toggleFavorite}
                      className="p-2 md:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      <span className="text-gray-700 font-medium text-sm md:text-base hidden sm:inline">
                        {isFavorite ? 'Remove from favourite' : 'Add to favourite'}
                      </span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 md:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    </button>
                    
                    {property.pdf_url && (
                      <button
                        onClick={downloadPdf}
                        className="p-2 md:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Download PDF Brochure"
                      >
                        <FileIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                      </button>
                    )}
                    
                    {!property.pdf_url && (
                      <button
                        onClick={handlePrint}
                        className="p-2 md:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Print"
                      >
                        <Printer className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                      </button>
                    )}
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-2xl md:text-3xl font-bold font-['Roboto_Condensed'] text-gray-900 mb-2">
                      {formatPrice(property.price, selectedCurrency)}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {currencies.map(currency => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 text-xs">
                        *EUR only
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 md:w-6 md:h-6 ${i < (property.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* Updated Gallery Section */}
          <div 
            ref={galleryRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8"
            style={{
              opacity: isGalleryVisible ? 1 : 0,
              transform: `translateY(${isGalleryVisible ? '0' : '20px'})`,
              transition: 'opacity 1s ease-out, transform 1s ease-out',
              transitionDelay: '0.3s'
            }}
          >
            {/* Hero Image (Left Column) */}
            <div className="md:col-span-2 h-[300px] md:h-[500px] rounded-lg overflow-hidden relative group">
              {heroImage && (
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => validImages.length > 0 && openLightbox(0)}
                >
                  <img
                    src={heroImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Grid (Right Column) */}
            <div className="grid grid-cols-2 gap-4 h-[300px] md:h-[500px]">
              {[1, 2, 3, 4].map((index) => (
                validImages[index] ? (
                  <div 
                    key={index}
                    className="relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={validImages[index]}
                      alt={`${property.title} image ${index}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      {index === 3 && validImages.length > 5 ? (
                        <span className="text-white text-sm md:text-xl font-semibold">
                          +{validImages.length - 5} MORE
                        </span>
                      ) : (
                        <Expand className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="bg-gray-100 rounded-lg flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                )
              ))}
            </div>
          </div>

          {validImages.length > 0 && (
            <Lightbox
              open={isLightboxOpen}
              close={() => setIsLightboxOpen(false)}
              index={lightboxIndex}
              slides={slides}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <div 
                ref={detailsRef}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-all duration-1000"
                style={{
                  opacity: isDetailsVisible ? 1 : 0,
                  transform: isDetailsVisible ? 'translateY(0)' : 'translateY(40px)'
                }}
              >
                <div className="relative inline-block mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Property Details</h2>
                  <div 
                    className="absolute -bottom-0.5 left-0 h-0.5 bg-amber-600 transition-all duration-1000 ease-out"
                    style={{
                      width: isDetailsVisible ? '100%' : '0%',
                      transitionDelay: '0.5s'
                    }}
                  />
                </div>
                <div className={`grid grid-cols-2 ${
                  property.airbnb_url 
                    ? 'md:grid-cols-3 lg:grid-cols-5' 
                    : 'md:grid-cols-4'
                } gap-3 md:gap-4 mb-4 md:mb-6`}>
                  <div className="flex flex-col items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mb-2" />
                    <span className="text-base md:text-lg font-bold">{property.bedrooms}</span>
                    <span className="text-xs md:text-sm text-gray-600">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mb-2" />
                    <span className="text-base md:text-lg font-bold">{property.bathrooms}</span>
                    <span className="text-xs md:text-sm text-gray-600">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mb-2" />
                    <span className="text-base md:text-lg font-bold">{property.area}</span>
                    <span className="text-xs md:text-sm text-gray-600">m² Built</span>
                  </div>
                  <div className="flex flex-col items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mb-2" />
                    <span className="text-base md:text-lg font-bold">{property.lot_size}</span>
                    <span className="text-xs md:text-sm text-gray-600">m² Lot</span>
                  </div>
                  
                  {property.airbnb_url && (
                    <a 
                      href={property.airbnb_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="radar-container mb-2">
                        <div className="radar-pulse"></div>
                        <div className="radar-pulse"></div>
                        <div className="radar-pulse"></div>
                        
                        <div className="radar-content">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 448 512" 
                            className="w-4 h-4 md:w-5 md:h-5 text-amber-600 group-hover:text-amber-700 transition-colors"
                          >
                            <path 
                              fill="currentColor" 
                              d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm324.2 179.6c-1.4 31.4-18.3 61.8-43.7 79.3L224 368 103.5 290.9c-25.4-17.5-42.3-47.9-43.7-79.3C48.5 195.1 64 160 64 160H384s15.5 35.1 4.2 51.6z"
                            />
                          </svg>
                          <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-gray-600 group-hover:text-amber-600 transition-colors" />
                        </div>
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 group-hover:text-amber-600 transition-colors">
                        Airbnb Listing
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div 
                ref={descriptionRef}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-all duration-1000"
                style={{
                  opacity: isDescriptionVisible ? 1 : 0,
                  transform: isDescriptionVisible ? 'translateY(0)' : 'translateY(40px)'
                }}
              >
                <PropertyTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  description={property.description || ''}
                  features={property.features}
                  earningsInfo={property.earnings_info}
                  legalInfo={property.legal_info}
                  policy={property.policy}
                />
              </div>

              {thingsToNote.length > 0 && (
                <div 
                  ref={thingsToNoteRef}
                  className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-all duration-1000"
                  style={{
                    opacity: isThingsToNoteVisible ? 1 : 0,
                    transform: isThingsToNoteVisible ? 'translateY(0)' : 'translateY(40px)'
                  }}
                >
                  <div className="relative inline-block mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Things to Note</h2>
                    <div 
                      className="absolute -bottom-0.5 left-0 h-0.5 bg-amber-600 transition-all duration-1000 ease-out"
                      style={{
                        width: isThingsToNoteVisible ? '100%' : '0%',
                        transitionDelay: '0.5s'
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    {thingsToNote.map((note, index) => (
                      <Accordion 
                        key={note.id} 
                        title={note.title}
                        icon={<AlertCircle className="w-5 h-5" />}
                        defaultOpen={index === 0}
                      >
                        <div className="font-['Times_New_Roman'] text-base text-gray-700 leading-relaxed">
                          {note.description}
                        </div>
                      </Accordion>
                    ))}
                  </div>
                </div>
              )}

              <div 
                ref={locationRef}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 transition-all duration-1000"
                style={{
                  opacity: isLocationVisible ? 1 : 0,
                  transform: isLocationVisible ? 'translateY(0)' : 'translateY(40px)'
                }}
              >
                <div className="relative inline-block mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Location</h2>
                  <div 
                    className="absolute -bottom-0.5 left-0 h-0.5 bg-amber-600 transition-all duration-1000 ease-out"
                    style={{
                      width: isLocationVisible ? '100%' : '0%',
                      transitionDelay: '0.5s'
                    }}
                  />
                </div>
                <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer 
                    center={position} 
                    zoom={16} 
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={customIcon}>
                      <Popup>
                        {property.location_name || property.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {property.is_for_rent && (
                <div 
                  ref={faqRef}
                  className="transition-all duration-1000"
                  style={{
                    opacity: isFaqVisible ? 1 : 0,
                    transform: isFaqVisible ? 'translateY(0)' : 'translateY(40px)'
                  }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
                    <div className="relative inline-block mb-4 md:mb-6">
                      <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
                      <div 
                        className="absolute -bottom-0.5 left-0 h-0.5 bg-amber-600 transition-all duration-1000 ease-out"
                        style={{
                          width: isFaqVisible ? '100%' : '0%',
                          transitionDelay: '0.5s'
                        }}
                      />
                    </div>
                    <FAQ />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div 
                ref={inquiryRef}
                className="sticky transition-all duration-1000"
                style={{
                  top: '160px',
                  maxHeight: 'calc(100vh - 160px - 40px)',
                  overflowY: 'auto',
                  opacity: isInquiryVisible ? 1 : 0,
                  transform: isInquiryVisible ? 'translateX(0)' : 'translateX(40px)'
                }}
              >
                <InquireNowForm 
                  propertyTitle={property.title}
                  propertyId={property.id}
                  defaultSubject="buy"
                />
              </div>
            </div>
          </div>

          <div 
            ref={similarRef}
            className="transition-all duration-1000"
            style={{
              opacity: isSimilarVisible ? 1 : 0,
              transform: isSimilarVisible ? 'translateY(0)' : 'translateY(40px)'
            }}
          >
            <GuestReviews />
            <PropertyCarousel currentPropertyId={property.id} />
          </div>

          <div className="mt-8 md:mt-12 mb-12 md:mb-20 flex justify-center">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go back to for sale page
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PropertyPage;