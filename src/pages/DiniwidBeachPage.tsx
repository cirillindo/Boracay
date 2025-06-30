import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const diniwidBeachImages = [
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218611/Diniwid_beach_sunset_rnzv4n.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218612/Diniwid_Beach_wvg5mw.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218610/Diniwid_Beach_relax_vyv3bm.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218609/Diniwid_Beach_Boracay_ycusek.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Diniwid_Beach_baby_zrbh6c.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218612/Diniwid_from_air_sxldvd.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218614/Diniwid_real_estate_uynyp6.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218613/Diniwid_real_aestate_us9pio.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Buy_a_house_in_Diniwid_op4558.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Buy_a_house_in_Boracay_ofkkl3.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Boracay_properties_guvrew.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218615/Move_to_Boracay_cwkrs3.jpg"
];

const DiniwidBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [imagesVisible, setImagesVisible] = useState<boolean[]>(new Array(diniwidBeachImages.length).fill(false));
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === mapRef.current) {
              setMapVisible(true);
            } else if (entry.target === contentRef.current) {
              setContentVisible(true);
            } else {
              const index = parseInt(entry.target.getAttribute('data-index') || '0');
              setImagesVisible(prev => {
                const newVisibility = [...prev];
                newVisibility[index] = true;
                return newVisibility;
              });
            }
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    imageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      imageRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
    };
  }, []);

  return (
    <>
      <SEO
        title="Diniwid Beach Boracay – Private Vibe Next to White Beach"
        description="Diniwid Beach offers peace and privacy with access to White Beach. Ideal for romantic getaways and small group stays in Boracay."
        keywords="Diniwid Beach Boracay, private beach Boracay, Boracay sunsets, Boracay cove beach, Boracay cliff villas"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218611/Diniwid_beach_sunset_rnzv4n.webp"
        url="https://boracay.house/beaches/diniwid"
        type="article"
        canonical="https://boracay.house/beaches/diniwid"
        dynamicData={{
          og_title: "Diniwid Beach – Boracay's Private Sunset Cove",
          og_description: "Relax at Diniwid Beach, where Boracay's laid-back charm meets golden sunsets and tranquil waters.",
          og_url: "https://boracay.house/beaches/diniwid",
          og_type: "article",
          og_image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218611/Diniwid_beach_sunset_rnzv4n.webp"
        }}
      />

      <div className="min-h-screen bg-white">
        <div className="h-32" /> {/* Spacer for fixed navbar */}

        <Container className="py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Beaches
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            🏝️ Diniwid Beach
          </h1>
          
          <div 
            ref={contentRef}
            className={`transition-all duration-1000 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
              Small, intimate, and just north of White Beach, Diniwid is a quiet oasis that still offers easy access to Boracay nightlife and restaurants. With its golden sand, stunning sunsets, and relaxed atmosphere, it's perfect for those seeking a more authentic island experience.
            </p>
          </div>

          {/* Image Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {diniwidBeachImages.map((src, index) => {
              let className = "relative overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ease-out";
              className += ` ${imagesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured images
              if (index === 0) className += " col-span-2 row-span-2"; // Large hero image
              if (index === 5) className += " md:col-span-2"; // Panoramic view
              if (index === 8) className += " md:col-span-2"; // Another wide image

              return (
                <div
                  key={index}
                  ref={el => imageRefs.current[index] = el}
                  data-index={index}
                  className={className}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={src}
                    alt={`Diniwid Beach image ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: index === 0 ? '16/9' : '4/3' }} // Different aspect ratio for hero
                  />
                </div>
              );
            })}
          </div>

          {/* Google Maps */}
          <div 
            ref={mapRef}
            className={`w-full rounded-lg overflow-hidden shadow-lg mb-16 transition-all duration-1000 ease-out ${
              mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.974080863589!2d121.90908741224413!3d11.976295288206153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53c1291734c89%3A0x9d59764264cb4756!2sDiniwid%20Beach!5e0!3m2!1sen!2sat!4v1751220198939!5m2!1sen!2sat" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Additional Content */}
          <div 
            className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Diniwid Beach?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-amber-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-amber-800 mb-4">For Visitors</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Quieter alternative to White Beach with fewer crowds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Stunning sunset views from a more intimate setting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Easy 10-minute walk to White Beach via scenic coastal path</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Boutique accommodations and cliffside restaurants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>More authentic local atmosphere</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-800 mb-4">For Property Buyers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Premium location with excellent rental potential</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Properties with ocean views and hillside advantages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Close to amenities but away from the main tourist crowds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Strong appreciation potential as Boracay continues to develop</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Ideal for both personal use and investment properties</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exceptional Blog for Boracay section */}
          <Blog />
        </Container>
      </div>
    </>
  );
};

export default DiniwidBeachPage;