import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const whiteBeachImages = [
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Move_to_Boracay_u8a1qm.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218561/Typhoon_Boracay_Island_ktosvt.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Sping_in_Boracay_dm3fai.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218559/Kitesurfing_on_white_beach_smbmqu.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218559/Boracay_Island_summer_time_wslbqt.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218558/Amzing_White_beachj_nvilhw.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218558/500062279_1174522844688173_5804957929676914108_n_tjkya6.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218557/497852307_1165883538885437_4141878209430066706_n_uxchrf.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218556/491212595_1145000144307110_2366109176765777833_n_wnthim.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218556/7720eb2a-b475-4b15-a88f-36a0a27177c3_ahb8cj.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218556/7a9e54ff-9f9b-44f0-9f55-5315fb1c5b0f_r6tna7.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218556/2526ba6e-bb7f-4aa4-bb58-29bc894763d5_wt9osg.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218555/460b7d2d-7483-4cdd-ae78-532033b9a12e_kgmsc7.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218555/3ef852b7-9af8-4c82-9dcc-89800920418f_tkjwe5.jpg"
];

const WhiteBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [imagesVisible, setImagesVisible] = useState<boolean[]>(new Array(whiteBeachImages.length).fill(false));
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
        title="White Beach Boracay – The Island's Most Famous Shoreline"
        description="Visit White Beach, the center of Boracay life. From vibrant sunsets to beach bars and water sports—it's all here."
        keywords="White Beach Boracay, Boracay nightlife, Boracay beach activities, Boracay Station 2, Boracay sunsets"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Move_to_Boracay_u8a1qm.webp"
        url="https://boracay.house/beaches/white"
        type="article"
        canonical="https://boracay.house/beaches/white"
        dynamicData={{
          og_title: "White Beach – Boracay's Iconic Destination",
          og_description: "Discover why White Beach is Boracay's most popular destination—perfect sand, ocean fun, and vibrant evenings.",
          og_url: "https://boracay.house/beaches/white",
          og_type: "article",
          og_image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Move_to_Boracay_u8a1qm.webp"
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
            🌊 White Beach
          </h1>
          
          <div 
            ref={contentRef}
            className={`transition-all duration-1000 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
              Boracay's iconic stretch, White Beach is the heart of the island with fine white sand, bars, shops, and endless beach activities. Divided into three stations, this 4-kilometer paradise offers everything from vibrant nightlife to serene sunset views.
            </p>
          </div>

          {/* Image Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {whiteBeachImages.map((src, index) => {
              let className = "relative overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ease-out";
              className += ` ${imagesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured images
              if (index === 0) className += " col-span-2 row-span-2"; // Large hero image
              if (index === 3) className += " md:col-span-2"; // Panoramic view
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
                    alt={`White Beach image ${index + 1}`}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7162.675503007256!2d121.91486372811534!3d11.959170728148157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53c2210040847%3A0x27aa6fffda7727f!2sStation%202!5e0!3m2!1sen!2sat!4v1751220443213!5m2!1sen!2sat" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Exploring White Beach</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-amber-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-amber-800 mb-4">Station 1</h3>
                <p className="text-gray-700 mb-4">
                  The northernmost section of White Beach, known for its wider beachfront, luxury resorts, and upscale dining. This area offers a more relaxed atmosphere while still being close to the action.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Premium accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Willy's Rock landmark</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Spacious beachfront</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Station 2</h3>
                <p className="text-gray-700 mb-4">
                  The bustling center of White Beach, home to D'Mall shopping center and the island's main commercial hub. This is where you'll find the most vibrant nightlife, restaurants, and activities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>D'Mall shopping center</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Lively bars and restaurants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Water sports activities</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-green-800 mb-4">Station 3</h3>
                <p className="text-gray-700 mb-4">
                  The southernmost and most laid-back section of White Beach. This area offers more budget-friendly accommodations and a quieter atmosphere, perfect for those seeking relaxation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Budget-friendly options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Relaxed atmosphere</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Local beach bars</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 bg-gray-50 p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Best Times to Visit</h3>
              <p className="text-gray-700 mb-6">
                White Beach is beautiful year-round, but experiences different moods with the changing seasons:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Peak Season (November to May)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Clear blue skies and calm waters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Perfect for swimming and water activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Vibrant nightlife and busy atmosphere</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Higher prices and more crowds</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Off Season (June to October)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Occasional rain showers but still plenty of sun</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Fewer tourists and more relaxed vibe</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Better deals on accommodations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Perfect for budget travelers and locals</span>
                    </li>
                  </ul>
                </div>
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

export default WhiteBeachPage;