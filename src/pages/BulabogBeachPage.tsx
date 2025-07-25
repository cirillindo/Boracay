import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const bulabogBeachImages = [
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297927/boracay_real_estate_for_sale_t2kkht.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297929/boracay_resort_for_sale_rpv4ml.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297931/homes_for_sale_boracay_philippines_jydzbp.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297934/boracay_beach_house_for_sale_lzcsav.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297936/boracay_house_for_rent_xvm4yq.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297939/boracay_villa_for_sale_lzlohx.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297941/houses_in_boracay_r4j8dt.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297944/houses_for_sale_in_boracay_hzzg17.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297947/real_estate_boracay_ynb58o.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297949/boracay_homes_for_sale_hgidg3.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297952/property_for_sale_in_boracay_dag2kw.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298192/houses_for_sale_boracay_mjzbsc.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298189/boracay_house_for_sale_prices_ss4mgy.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298187/boracay_business_for_sale_ph8mhq.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298184/house_in_boracay_for_sale_gs6x2j.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298181/house_for_rent_in_boracay_npkywz.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298179/boracay_house_and_lot_for_sale_ui6q3f.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298176/boracay_rent_house_imtpwp.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298174/real_estate_boracay_philippines_yytbbm.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218590/Bulabog_Handsome_dude_cumem6.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218592/Kitesurf_club_Bulabogwebp_hsu3fh.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218591/Bulabog_Beach_scp8y4.webp"
];

const BulabogBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [imagesVisible, setImagesVisible] = useState<boolean[]>(new Array(bulabogBeachImages.length).fill(false));
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
        title="Bulabog Beach Boracay – Kitesurfing & Island Action Hub"
        description="Bulabog Beach is Boracay's kitesurfing capital. Popular for water sports and morning beach runs—less touristy, more thrill."
        keywords="Bulabog Beach Boracay, Boracay kitesurfing, Boracay water sports, Boracay east beach, Boracay adventure"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218590/Bulabog_Handsome_dude_cumem6.webp"
        url="https://boracay.house/beaches/bulabog"
        type="article"
        canonical="https://boracay.house/beaches/bulabog"
        dynamicData={{
          og_title: "Bulabog Beach – Boracay's Kitesurfing Playground",
          og_description: "Discover action and adrenaline at Bulabog Beach—perfect for kitesurfing and east-side Boracay adventures.",
          og_url: "https://boracay.house/beaches/bulabog",
          og_type: "article",
          og_image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218590/Bulabog_Handsome_dude_cumem6.webp"
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
            🧭 Bulabog Beach
          </h1>
          
          <div 
            ref={contentRef}
            className={`transition-all duration-1000 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
              The island's east coast sports beach, Bulabog is famous for wind and waves—kiteboarders and windsurfers call it home from November to April. This action-packed beach offers a completely different vibe from White Beach, with a focus on adventure and adrenaline rather than relaxation.
            </p>
          </div>

          {/* Image Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {bulabogBeachImages.map((src, index) => {
              let className = "relative overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ease-out";
              className += ` ${imagesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured images
              if (index === 0) className += " col-span-2 row-span-2"; // Large hero image
              if (index === 3) className += " md:col-span-2"; // Panoramic view
              if (index === 6) className += " md:col-span-2"; // Another wide image

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
                    alt={`Bulabog Beach image ${index + 1}`}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1351.5936825590352!2d121.93343792514229!3d11.959877115471556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53dd0163cebcd%3A0x3ec83a29b635af60!2sGreenyard%20boardsport!5e0!3m2!1sen!2sat!4v1751221086300!5m2!1sen!2sat" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Kitesurfing Paradise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Wind Season (November to April)</h3>
                <p className="text-gray-700 mb-4">
                  During the Amihan season (northeast monsoon), Bulabog Beach transforms into a world-class kitesurfing and windsurfing destination with consistent winds and perfect conditions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Consistent 15-25 knot winds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Protected by a reef for flat water conditions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Multiple kitesurfing schools and rental shops</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>International kitesurfing community</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-green-800 mb-4">Off-Wind Season (May to October)</h3>
                <p className="text-gray-700 mb-4">
                  During the Habagat season (southwest monsoon), Bulabog Beach becomes calm and peaceful, offering a different experience for visitors.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Calm waters perfect for swimming and paddleboarding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Quieter atmosphere with fewer tourists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Beautiful sunrise views over the water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Local fishing activities to observe</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg shadow mb-8">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Learning to Kitesurf</h3>
              <p className="text-gray-700 mb-4">
                Bulabog Beach is one of the best places in Asia to learn kitesurfing, with numerous schools offering lessons for all levels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Recommended Schools</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="font-semibold"><a href="https://www.instagram.com/greenyard_kitesurfing/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">Greenyard Kitesurfing School</a> <span className="text-green-600">(Highly Recommended)</span></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Isla Kitesurfing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Habagat Kiteboarding Center</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Freestyle Academy Boracay</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">What to Expect</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Beginner lessons: ₱3,500-5,000 per hour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Equipment rental: ₱2,000-3,000 per hour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>3-5 days to learn basics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>IKO-certified instructors available</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-amber-800 font-medium">
                  <span className="font-bold">Pro Tip:</span> Greenyard Kitesurfing School is our top recommendation for its excellent instructors, great atmosphere, and professional approach. They're known for their safety standards and personalized instruction.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Beyond Kitesurfing</h3>
              <p className="text-gray-700 mb-4">
                While kitesurfing is the main attraction, Bulabog Beach offers much more for visitors who aren't into water sports.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Morning Walks:</strong> The beach is perfect for sunrise walks and jogging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Beachfront Cafés:</strong> Several laid-back cafés offer great views of kitesurfers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Photography:</strong> Excellent opportunities to capture action shots and beautiful landscapes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Accommodations:</strong> More affordable options compared to White Beach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Local Culture:</strong> Closer interaction with local communities and fishermen</span>
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

export default BulabogBeachPage;