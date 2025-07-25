import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pukaBeachMedia = [
  // Images
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297328/boracay_real_estate_vysrz4.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297326/boracay_house_for_sale_eesawb.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297323/property_for_sale_boracay_hwtkvv.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297321/boracay_properties_for_sale_l12uzl.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297319/property_for_sale_in_boracay_xfrdeh.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297317/real_estate_boracay_xjiqxi.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297314/boracay_property_for_sale_ikpzft.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297312/house_for_sale_boracay_dgnguq.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751297311/boracay_homes_for_sale_mw8j5s.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218661/puka-beach_sxnpwl.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218660/Puka_shell_beach_fqgqq8.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218659/Puka_BOracay_ngvb4y.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218658/Puka_Beach_fnykug.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218657/Puak_Beach_Boreacay_Island_ki3onq.webp" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218656/Life_in_Boracay_tevx7m.webp" },
  
  // Vertical Videos
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443209/IMG_9213_tu9x9v.mp4",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443209/IMG_9213_tu9x9v.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443209/IMG_9213_tu9x9v.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443209/IMG_9213_tu9x9v.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443229/IMG_9040_a81gf6.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443229/IMG_9040_a81gf6.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443229/IMG_9040_a81gf6.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443229/IMG_9040_a81gf6.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  }
];

const PukaBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [mediaVisible, setMediaVisible] = useState<boolean[]>(new Array(pukaBeachMedia.length).fill(false));
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === mapRef.current) {
              setMapVisible(true);
            } else {
              const index = parseInt(entry.target.getAttribute('data-index') || '0');
              setMediaVisible(prev => {
                const newVisibility = [...prev];
                newVisibility[index] = true;
                return newVisibility;
              });
              
              if (pukaBeachMedia[index].type === 'video' && videoRefs.current[index]) {
                videoRefs.current[index]?.play().catch(e => console.log('Video play failed:', e));
              }
            }
            observer.unobserve(entry.target);
          } else {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (pukaBeachMedia[index].type === 'video' && videoRefs.current[index]) {
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

    return () => {
      mediaRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      if (mapRef.current) observer.unobserve(mapRef.current);
    };
  }, []);

  return (
    <>
      <SEO
        title="Puka Beach Boracay – Quiet, Natural Escape Near Diniwid"
        description="Puka Beach in Boracay offers a quiet retreat with a crushed-shell shoreline and turquoise waters—ideal for those who prefer nature and tranquility over crowds."
        keywords="Puka Beach Boracay, quiet beach Boracay, Boracay hidden gems, Boracay northern beach, nature Boracay"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218656/Life_in_Boracay_tevx7m.webp"
        url="https://boracay.house/beaches/puka-shell-beach"
        type="article"
        canonical="https://boracay.house/beaches/puka-shell-beach"
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
            🌴 Puka Beach
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
            Secluded and raw, Puka Beach is known for its crushed-shell shoreline and peaceful atmosphere.
          </p>

          {/* Media Grid with proper vertical video display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {pukaBeachMedia.map((media, index) => {
              const isVerticalVideo = media.type === 'video' && media.orientation === 'vertical';
              
              let className = "relative overflow-hidden rounded-xl shadow-lg transition-all duration-1000 ease-out bg-gray-100";
              className += ` ${mediaVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

              return (
                <div
                  key={index}
                  ref={el => mediaRefs.current[index] = el}
                  data-index={index}
                  className={className}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    aspectRatio: isVerticalVideo ? '9/16' : '4/3'
                  }}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.src}
                      alt={`Puka Beach image ${index + 1}`}
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
                        className="absolute inset-0 w-full h-full object-contain bg-black"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10861.436662664564!2d121.90824318009705!3d11.994535647882829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53c62a3ac4afb%3A0x2e5fab9ab3d78a34!2sPuka%20Shell%20Beach!5e0!3m2!1sen!2sat!4v1751222546015!5m2!1sen!2sat" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <Blog />
        </Container>
      </div>
    </>
  );
};

export default PukaBeachPage;