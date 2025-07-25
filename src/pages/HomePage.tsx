import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import PropertyListings from '../components/home/PropertyListings';
import Services from '../components/home/Services';
import Statistics from '../components/home/Statistics';
import InvestmentGuarantee from '../components/home/InvestmentGuarantee';
import GuestReviews from '../components/home/GuestReviews';
import TargetAudience from '../components/home/TargetAudience';
import Blog from '../components/home/Blog';
import BeachesSection from '../components/property/BeachesSection';
import FAQSection from '../components/home/FAQSection';
import Container from '../components/ui/Container';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import type { Property } from '../types';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import InvestmentCalculatorPromo from '../components/shared/InvestmentCalculatorPromo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    document.querySelectorAll('.property-card-container').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [properties]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_for_sale', true)
        .order('created_at', { ascending: false })
        .limit(9);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "name": "Boracay.house",
    "url": "https://boracay.house",
    "logo": "https://boracay.house/logo.png",
    "sameAs": [
      "https://www.facebook.com/boracaybedandbreakfast",
      "https://www.instagram.com/ilawilawvillas/"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you sell beachfront property?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We don't list direct beachfront properties. Instead, we focus on homes and land just minutes from the beach — where ownership is safer, returns are stronger, and paperwork is simpler."
        }
      },
      {
        "@type": "Question",
        "name": "Can foreigners buy property in Boracay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Foreigners can't own land directly. Most either buy a condo or apartment, with individual ownership and shared title or Tax Declaration, or they form a Philippine corporation (minimum 60% Filipino ownership) to legally purchase land. We don't offer legal advice, but we can share real-world experience and connect you with trusted local contacts."
        }
      },
      {
        "@type": "Question",
        "name": "How fast can I list my property here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your paperwork is clean and you provide good photos and details, we can usually publish within 1–2 days. Send us an email with your info, and we'll help you get it live — no hidden fees, no delays."
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Boracay House – Villas, Houses, Condos - SALE - RENT"
        description="Discover and book or buy unique villas, houses, and studios on Boracay. Stay like a local, rent or buy your piece of paradise."
        keywords="boracay villas, boracay houses, boracay condos, boracay real estate, buy property boracay, rent property boracay"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750676861/02_copy_kn1yip.jpg"
        url="https://boracay.house"
      />
      
      <Helmet>
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <HeroSection />
      <PropertyListings />
      <section className="bg-white">
        <Container className="py-16">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {properties.map((property, index) => (
                  <div 
                    key={property.id}
                    data-index={index}
                    className="property-card-container"
                    style={{
                      opacity: visibleCards.has(index) ? 1 : 0,
                      transform: `perspective(1000px) ${visibleCards.has(index) 
                        ? 'rotateY(0) translateY(0)' 
                        : 'rotateY(-45deg) translateY(100px)'}`,
                      transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`
                    }}
                  >
                    <PropertyCard 
                      property={{
                        ...property,
                        selectedCurrency
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = '/for-sale'}
                  className="text-lg flex items-center gap-2"
                >
                  VIEW ALL LISTINGS
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      <InvestmentCalculatorPromo />

      <Statistics />
      <InvestmentGuarantee />
      <GuestReviews />
      <TargetAudience />
      <BeachesSection />
      <Services />
      <Blog />
      <FAQSection />
    </>
  );
};

export default HomePage;