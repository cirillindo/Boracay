import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const diniwidBeachMedia = [
  // Original Images
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218611/Diniwid_beach_sunset_rnzv4n.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218612/Diniwid_Beach_wvg5mw.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218610/Diniwid_Beach_relax_vyv3bm.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218609/Diniwid_Beach_Boracay_ycusek.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Diniwid_Beach_baby_zrbh6c.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218612/Diniwid_from_air_sxldvd.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218614/Diniwid_real_estate_uynyp6.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218613/Diniwid_real_aestate_us9pio.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Buy_a_house_in_Diniwid_op4558.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Buy_a_house_in_Boracay_ofkkl3.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218608/Boracay_properties_guvrew.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218615/Move_to_Boracay_cwkrs3.jpg" },
  
  // New Images
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751443743/DJI_0571_hmpj75.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751443743/DJI_0571_hmpj75.jpg" }, // Appears twice in your list

  // Vertical Videos
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443733/DJI_0585_zulcsr.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443733/DJI_0585_zulcsr.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443733/DJI_0585_zulcsr.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443733/DJI_0585_zulcsr.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443659/IMG_9659_xhdwqf.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443659/IMG_9659_xhdwqf.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443659/IMG_9659_xhdwqf.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443659/IMG_9659_xhdwqf.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443587/IMG_1510_wbuo3j.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443587/IMG_1510_wbuo3j.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443587/IMG_1510_wbuo3j.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443587/IMG_1510_wbuo3j.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443531/IMG_1507_wsmtc0.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443531/IMG_1507_wsmtc0.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443531/IMG_1507_wsmtc0.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443531/IMG_1507_wsmtc0.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443283/WhatsApp_Video_2024-06-07_at_15.14.31_3_wab2qb.mp4",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443283/WhatsApp_Video_2024-06-07_at_15.14.31_3_wab2qb.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443283/WhatsApp_Video_2024-06-07_at_15.14.31_3_wab2qb.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443283/WhatsApp_Video_2024-06-07_at_15.14.31_3_wab2qb.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443361/IMG_1437_smqtb3.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443361/IMG_1437_smqtb3.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443361/IMG_1437_smqtb3.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443361/IMG_1437_smqtb3.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443243/4995001665119761816_mphp4c.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443243/4995001665119761816_mphp4c.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443243/4995001665119761816_mphp4c.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443243/4995001665119761816_mphp4c.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  }
];

const DiniwidBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [mediaVisible, setMediaVisible] = useState<boolean[]>(new Array(diniwidBeachMedia.length).fill(false));
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
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
              setMediaVisible(prev => {
                const newVisibility = [...prev];
                newVisibility[index] = true;
                return newVisibility;
              });
              
              if (diniwidBeachMedia[index].type === 'video' && videoRefs.current[index]) {
                videoRefs.current[index]?.play().catch(e => console.log('Video play failed:', e));
              }
            }
            observer.unobserve(entry.target);
          } else {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (diniwidBeachMedia[index].type === 'video' && videoRefs.current[index]) {
              videoRefs.current[index]?.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    mediaRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      mediaRefs.current.forEach(ref => {
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

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {diniwidBeachMedia.map((media, index) => {
              const isVerticalVideo = media.type === 'video' && media.orientation === 'vertical';
              
              let className = "relative overflow-hidden rounded-xl shadow-lg transition-all duration-1000 ease-out bg-gray-100";
              className += ` ${mediaVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured media
              if (index === 0) className += " col-span-1 sm:col-span-2 lg:col-span-3"; // Large hero media
              if (index === 5) className += " sm:col-span-2"; // Panoramic view
              if (index === 8) className += " sm:col-span-2"; // Another wide image

              return (
                <div
                  key={index}
                  ref={el => mediaRefs.current[index] = el}
                  data-index={index}
                  className={className}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    aspectRatio: isVerticalVideo ? '9/16' : index === 0 ? '16/9' : '4/3'
                  }}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.src}
                      alt={`Diniwid Beach ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        ref={el => videoRefs.current[index] = el}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full ${
                          isVerticalVideo ? 'object-contain' : 'object-cover'
                        } bg-black`}
                        poster={media.poster}
                        preload="metadata"
                      >
                        {media.formats?.map((format, i) => (
                          <source key={i} src={format.src} type={format.type} />
                        ))}
                        Your browser does not support HTML5 video.
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                        <div className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
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

          <Blog />
        </Container>
      </div>
    </>
  );
};

export default DiniwidBeachPage;