import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tambisaanBeachImages = [
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297667/house_for_sale_in_boracay_bxf0dn.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297669/boracay_houses_for_sale_ifvwj1.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297671/properties_for_sale_in_boracay_ri2g4d.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297674/homes_for_sale_in_boracay_philippines_pjxtma.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297676/boracay_philippines_real_estate_urfjnt.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218677/cfimages_jaw9nr.avif",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218683/Tambisaan-Beach-2_hntion.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218681/Tambisaan-Beach-1_ga32si.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218680/photo8jpg_knkx9w.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218679/philippines-1800409_1280_nd3lx3.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218678/Jetty_Port_boracay_tambisaan_xchwh3.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218675/Boracay-Beachesd-Tambisaan_Beach-02-1024x576_ymgy17.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218674/aerial-view-beautiful-quiet-tropical-260nw-1439450348_rvo2zy.webp"
];

const TambisaanBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [imagesVisible, setImagesVisible] = useState<boolean[]>(new Array(tambisaanBeachImages.length).fill(false));
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
        title="Tambisaan Beach Boracay – Local Vibes and Reef Adventures"
        description="Tambisaan Beach offers access to marine life and fewer tourists. Great for budget travelers and morning snorkeling trips."
        keywords="Tambisaan Beach Boracay, Boracay snorkeling beach, Boracay marine sanctuary, Boracay port beach"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218677/cfimages_jaw9nr.avif"
        url="https://boracay.house/beaches/tambisaan"
        type="article"
        canonical="https://boracay.house/beaches/tambisaan"
        dynamicData={{
          og_title: "Tambisaan Beach – Boracay's Reef-Friendly Local Spot",
          og_description: "Get close to island life and coral beauty at Tambisaan Beach, a chill, reef-rich beach away from the crowds.",
          og_url: "https://boracay.house/beaches/tambisaan",
          og_type: "article",
          og_image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218677/cfimages_jaw9nr.avif"
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
            🪸 Tambisaan Beach
          </h1>
          
          <div 
            ref={contentRef}
            className={`transition-all duration-1000 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
              Close to the port and known for its marine sanctuary, Tambisaan Beach is ideal for early-morning snorkeling and local boat rides. This hidden gem offers a glimpse into authentic island life away from the tourist crowds.
            </p>
          </div>

          {/* Image Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {tambisaanBeachImages.map((src, index) => {
              let className = "relative overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ease-out";
              className += ` ${imagesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured images
              if (index === 0) className += " col-span-2 row-span-2"; // Large hero image
              if (index === 5) className += " md:col-span-2"; // Panoramic view
              if (index === 7) className += " md:col-span-2"; // Another wide image

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
                    alt={`Tambisaan Beach image ${index + 1}`}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.353119547685!2d121.94419731224357!3d11.950035588230465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53f165196e75d%3A0x8c921b96c4ffef62!2sTambisaan%20Beach!5e0!3m2!1sen!2sat!4v1751220755550!5m2!1sen!2sat" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Tambisaan Beach</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Marine Life & Snorkeling</h3>
                <p className="text-gray-700 mb-4">
                  Tambisaan Beach is home to a vibrant marine sanctuary that makes it one of Boracay's best snorkeling spots. The reef is accessible right from the shore, making it perfect for both beginners and experienced snorkelers.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Colorful coral formations close to shore</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Diverse tropical fish species</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Best visibility in the early morning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Affordable snorkeling gear rental from locals</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-green-800 mb-4">Local Experience</h3>
                <p className="text-gray-700 mb-4">
                  Unlike the more commercialized beaches on Boracay, Tambisaan offers a glimpse into authentic island life. The beach is frequented by locals and provides a more relaxed, budget-friendly experience.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Watch local fishermen bring in their morning catch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Enjoy fresh seafood at simple beachside eateries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Fewer tourists means more space to relax</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Proximity to Tambisaan Port for island hopping</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 bg-amber-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Getting There</h3>
              <p className="text-gray-700 mb-4">
                Tambisaan Beach is located on the eastern side of Boracay, approximately 15-20 minutes from White Beach by e-trike. The beach is close to Tambisaan Port, one of the island's main entry points.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Take an e-trike from D'Mall or any main road (₱150-200)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Best visited in the morning for calmer waters and better snorkeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Consider bringing your own snacks and drinks as facilities are limited</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Combine with a visit to nearby Manoc-Manoc for a full day of exploration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Exceptional Blog for Boracay section */}
          <Blog />
        </Container>
      </div>
    </>
  );
};

export default TambisaanBeachPage;