import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import Container from '../components/ui/Container';
import PropertyCard from '../components/property/PropertyCard';
import BeachesSection from '../components/property/BeachesSection';
import Blog from '../components/home/Blog';
import GuestReviews from '../components/home/GuestReviews';
import type { Property } from '../types';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const AirbnbPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State for search filters
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // State for properties and UI
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [sortOption, setSortOption] = useState('latest');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  
  // Refs for Vanta.js effects
  const vantaRefSeo = useRef<HTMLDivElement>(null);
  const vantaRefFaq = useRef<HTMLDivElement>(null);
  const [vantaEffectSeo, setVantaEffectSeo] = useState<any>(null);
  const [vantaEffectFaq, setVantaEffectFaq] = useState<any>(null);

  // Toggle FAQ item expansion
  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  // Currency and sort options
  const currencies = [
    { value: 'EUR', label: 'EUR', symbol: '€', rate: 1 },
    { value: 'USD', label: 'USD', symbol: '$', rate: 1.08 },
    { value: 'PHP', label: 'PHP', symbol: '₱', rate: 60.50 },
    { value: 'AUD', label: 'AUD', symbol: 'A$', rate: 1.65 },
    { value: 'RUB', label: 'RUB', symbol: '₽', rate: 98.50 },
    { value: 'KRW', label: 'KRW', symbol: '₩', rate: 1450.25 },
    { value: 'CNY', label: 'CNY', symbol: '¥', rate: 7.85 }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest Properties' },
    { value: 'oldest', label: 'Oldest Properties' },
    { value: 'highest', label: 'Highest Price' },
    { value: 'lowest', label: 'Lowest Price' }
  ];

  // Load properties when component mounts or sort option changes
  useEffect(() => {
    loadProperties();
  }, [sortOption]);

  // Initialize Vanta.js effects
  useEffect(() => {
    const initVanta = async () => {
      try {
        const [VANTA, THREE] = await Promise.all([
          import('vanta/dist/vanta.birds.min'),
          import('three')
        ]);

        // Initialize SEO section effect
        if (vantaRefSeo.current && !vantaEffectSeo) {
          const effectSeo = VANTA.default({
            el: vantaRefSeo.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xffffff,
            color1: 0x74c0f5,
            speedLimit: 4.00,
            quantity: 4.00,
            THREE: THREE.default
          });
          setVantaEffectSeo(effectSeo);
        }
        
        // Initialize FAQ section effect
        if (vantaRefFaq.current && !vantaEffectFaq) {
          const effectFaq = VANTA.default({
            el: vantaRefFaq.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xffffff,
            color1: 0x74c0f5,
            speedLimit: 4.00,
            quantity: 4.00,
            THREE: THREE.default
          });
          setVantaEffectFaq(effectFaq);
        }
      } catch (error) {
        console.error('Error loading Vanta.js:', error);
        // Fallback to static background
        if (vantaRefSeo.current) vantaRefSeo.current.style.backgroundColor = '#ffffff';
        if (vantaRefFaq.current) vantaRefFaq.current.style.backgroundColor = '#ffffff';
      }
    };

    initVanta();

    return () => {
      if (vantaEffectSeo) vantaEffectSeo.destroy();
      if (vantaEffectFaq) vantaEffectFaq.destroy();
    };
  }, []);

  // Intersection observer for property cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.getAttribute('data-index')) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    document.querySelectorAll('.property-card-container').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [properties]);

  // Load properties from Supabase
  const loadProperties = async (resetFilters = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_for_rent', true);

      if (!resetFilters) {
        if (propertyType) query = query.eq('property_type', propertyType.toLowerCase());
        if (bedrooms) query = query.eq('bedrooms', parseInt(bedrooms));
        if (location) query = query.eq('location', location);
        if (minPrice) query = query.gte('nightly_rate_min', parseInt(minPrice));
        if (maxPrice) query = query.lte('nightly_rate_max', parseInt(maxPrice));
      }

      // Apply sorting
      switch (sortOption) {
        case 'latest': query = query.order('created_at', { ascending: false }); break;
        case 'oldest': query = query.order('created_at', { ascending: true }); break;
        case 'highest': query = query.order('nightly_rate_max', { ascending: false }); break;
        case 'lowest': query = query.order('nightly_rate_min', { ascending: true }); break;
      }

      const { data, error } = await query;
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadProperties(false);
  };

  const handleReset = () => {
    setPropertyType('');
    setBedrooms('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setLoading(true);
    loadProperties(true);
  };

  // FAQ data organized into two columns
  const faqItems = [
    {
      question: "How do I make a reservation?",
      answer: "You can book directly with us via WhatsApp or email, or through Airbnb if the unit is listed there. We respond fast and confirm within hours."
    },
    {
      question: "What is your cancellation policy?",
      answer: "On Airbnb: we follow a strict policy. Guests who cancel 7 or more days before check-in receive a 50% refund. After that, the booking becomes non-refundable. For promo-rate bookings made directly, no refund is provided."
    },
    {
      question: "Do you require a deposit?",
      answer: "Yes, we require a 20–30% deposit to confirm your stay. Balance is due at check-in or via online transfer. Airbnb bookings follow their payment system."
    },
    {
      question: "What are the check-in and check-out times?",
      answer: "Check-in: from 2:00 PM. Check-out: by 10:00 AM. Early check-in / late check-out may be possible — ask us in advance."
    },
    {
      question: "How do I check in to the property?",
      answer: "We'll meet you in person or send a self-check-in guide depending on arrival time. Our team is always on standby if you need help."
    },
    {
      question: "Are your properties child-friendly?",
      answer: "Yes, most units are family-friendly. Some have stairs or open balconies — ask us about the best fit for your group."
    },
    {
      question: "Are pets allowed?",
      answer: "Some units allow pets; others don't. Please confirm in advance — a pet deposit may apply."
    },
    {
      question: "What amenities are included?",
      answer: (
        <>
          Each listing is unique, but most include:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Fast Wi-Fi</li>
            <li>Kitchen or kitchenette</li>
            <li>Air conditioning</li>
            <li>Towels, bed sheets, and basic toiletries</li>
            <li>Weekly or daily cleaning</li>
            <li>On-call maintenance</li>
            <li>Local guest support</li>
          </ul>
        </>
      )
    },
    {
      question: "Can you help arrange activities and tours?",
      answer: "Absolutely. We connect you with trusted local providers for island hopping, diving, e-bike rental, golf, and more. You can also follow our blog for ideas, inspiration, and tips for your journey."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Direct bookings: bank transfer (local or international), Wise, Revolut, GCash, or PayPal (fees may apply). Airbnb: through their platform."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes — we can book airport pickup and drop-off with trusted local providers. Let us know your arrival details at least 24 hours in advance."
    },
    {
      question: "Are these Airbnb properties or direct rentals?",
      answer: "Yes — all homes are Airbnb-ready and can be booked either directly or via Airbnb. You get verified hosts, guest-reviewed properties, and simple check-in."
    },
    {
      question: "How close are the homes to White Beach?",
      answer: "Most rentals are 2–10 minutes from White Beach, D'Mall, and Station 1 — walkable but without the beachfront markup. Many units are near Diniwid Beach (4 min walk)."
    },
    {
      question: "Can I rent monthly or long-term?",
      answer: "Yes. We welcome digital nomads and long-stay guests. Monthly rates are discounted, especially off-season."
    },
    {
      question: "Can you help manage my property?",
      answer: "Yes — we offer full property management: listings, guest support, cleaning, maintenance, photos, pricing strategy. Hands-free for owners."
    },
    {
      question: "We are a group of 16–20 people — can you organize something for us?",
      answer: "Yes, we specialize in group bookings. We can arrange nearby units or private villas to host your full group. Just send us your dates."
    }
  ];

  // Split FAQ items into two columns
  const faqColumns = [
    faqItems.slice(0, Math.ceil(faqItems.length / 2)),
    faqItems.slice(Math.ceil(faqItems.length / 2))
  ];

  return (
    <>
      <SEO
        title="Airbnb-Style Rentals in Boracay – Private & Authentic"
        description="Find verified Airbnb-style rentals in Boracay. Book villas, houses, and apartments near White Beach with local support, fast Wi-Fi, and no stress."
        keywords="Airbnb Boracay, Boracay vacation rental, House for rent Boracay, Apartment rental Boracay, Villas near White Beach, Monthly rental Boracay, Short stay Boracay, Digital nomad Boracay, Boracay Airbnb management, Best Airbnb in Boracay, Clean rental Boracay, Long-term stay Boracay"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677155/31_marketing_copy_ydbeuh.jpg"
        url="https://www.boracay.house/airbnb"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dq3fftsfa/image/upload/v1748371588/e37696_e4ae41811242449885effc44c7593d3b_mv2_ajftwb.jpg')] bg-cover bg-center animate-hero" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="theater-curtain" />

          <Container className="relative z-10">
            <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-lg transition-all duration-1000 transform translate-y-0 opacity-100">
              <div className="text-center mb-6">
                <h1 className="text-5xl font-bold text-white mb-2">
                  BORACAY HIDEWAYS - Relaxed Living, Island Style
                </h1>
                <p className="text-xl text-gray-200">
                  Relax, unwind, and enjoy heartfelt service in your island home away from home
                </p>
              </div>

              <div className="search-bar-content">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full h-[42px] px-3 bg-white/80 border-0 rounded text-gray-900 font-medium text-sm"
                  >
                    <option value="">VILLA</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                  </select>

                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full h-[42px] px-3 bg-white/80 border-0 rounded text-gray-900 font-medium text-sm"
                  >
                    <option value="">BEDROOMS</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>

                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-[42px] px-3 bg-white/80 border-0 rounded text-gray-900 font-medium text-sm"
                  >
                    <option value="">SELECT AREA</option>
                    <option value="monaco">Monaco Suites</option>
                    <option value="diniwid">Diniwid</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-[42px] px-3 bg-white/80 border-0 rounded text-gray-900 font-medium text-sm"
                  >
                    <option value="">MIN PRICE/NIGHT</option>
                    <option value="100">€100</option>
                    <option value="200">€200</option>
                    <option value="300">€300</option>
                    <option value="500">€500</option>
                    <option value="1000">€1,000</option>
                  </select>

                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-[42px] px-3 bg-white/80 border-0 rounded text-gray-900 font-medium text-sm"
                  >
                    <option value="">MAX PRICE/NIGHT</option>
                    <option value="200">€200</option>
                    <option value="300">€300</option>
                    <option value="500">€500</option>
                    <option value="1000">€1,000</option>
                    <option value="2000">€2,000</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 h-[42px] bg-amber-600 hover:bg-amber-700 text-white font-medium rounded flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Search className="w-4 h-4" />
                    FIND VILLAS FOR RENT
                  </button>
                  <button
                    onClick={handleReset}
                    className="h-[42px] px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* SEO Section with Vanta Background */}
        <section ref={vantaRefSeo} className="py-24 relative min-h-[60vh] flex items-center overflow-hidden">
          <Container>
            <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Stay Smart in Boracay: Handpicked Airbnb-Style Rentals with Local Service
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed max-w-3xl mx-auto">
                Looking for Airbnb-style rentals in Boracay? We manage high-quality homes, villas, and apartments just minutes from White Beach. Whether you want nightly rentals, long stays, or hidden gems off the main strip, our properties are reviewed, maintained, and ready to book — with real-time availability and local support.
              </p>
              <div className="w-24 h-1 bg-amber-500 mx-auto mt-8" />
            </div>
          </Container>
        </section>

        {/* Property Listings Section */}
        <Container className="py-16">
          <div className="flex justify-end items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <div 
                  key={property.id}
                  data-index={index}
                  className="property-card-container"
                  onClick={() => navigate(`/property/${property.id}`)}
                  style={{
                    opacity: visibleCards.has(index) ? 1 : 0,
                    transform: `perspective(1000px) ${visibleCards.has(index) 
                      ? 'rotateY(0) translateY(0)' 
                      : 'rotateY(-45deg) translateY(100px)'}`,
                    transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`
                  }}
                >
                  <PropertyCard 
                    property={{ ...property, selectedCurrency }} 
                    disableNavigation={true}
                    showNightlyRate={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">
                We couldn't find any rental properties matching your criteria. Please try adjusting your search filters.
              </p>
            </div>
          )}
        </Container>

        {/* FAQ Section with Vanta Background */}
        <section ref={vantaRefFaq} className="py-24 relative min-h-[70vh] flex items-center overflow-hidden">
          <Container>
            <div className="max-w-6xl mx-auto relative z-10">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
                Frequently Asked Questions
              </h2>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* FAQ Columns */}
                  {faqColumns.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-4">
                      {column.map((item, index) => {
                        const globalIndex = colIndex === 0 ? index : index + Math.ceil(faqItems.length / 2);
                        const isExpanded = expandedFaqIndex === globalIndex;
                        
                        return (
                          <div 
                            key={globalIndex} 
                            className="faq-item border-b border-gray-200 pb-4 last:border-0"
                          >
                            <button
                              className="flex items-center justify-between w-full text-left"
                              onClick={() => toggleFaq(globalIndex)}
                            >
                              <h3 className="text-xl font-semibold text-gray-900">
                                {item.question}
                              </h3>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-amber-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-amber-600" />
                              )}
                            </button>
                            
                            <div 
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded ? 'max-h-96 mt-4' : 'max-h-0'
                              }`}
                            >
                              <div className="text-gray-700">
                                {item.answer}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-12">
                <a
                  href="https://wa.me/639617928834?text=Hey%20good%20day%2C%20I%20am%20interested%20in%20Airbnb%20in%20Boracay."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 text-lg font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact us on WhatsApp
                </a>
              </div>
            </div>
          </Container>
        </section>

        <GuestReviews />
        <BeachesSection />
        <Blog />
      </div>
    </>
  );
};

export default AirbnbPage;