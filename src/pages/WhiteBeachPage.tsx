import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const whiteBeachMedia = [
  // Images
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299514/real_estate_boracay_a1wopy.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299511/house_for_sale_boracay_llsaqr.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299507/property_for_sale_in_boracay_znwfae.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299504/boracay_property_for_sale_inzpkk.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299501/boracay_house_for_sale_tqompa.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299474/boracay_real_estate_oo4a4e.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299471/boracay_beachfront_properties_for_sale_o3t8yh.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299468/boracay_house_rental_yehgiv.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299465/house_in_boracay_tsowz7.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299462/boracay_apartments_for_sale_jk0ycs.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299459/house_for_sale_boracay_philippines_oe2koc.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299456/houses_for_rent_in_boracay_philippines_yksczu.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299453/boracay_villas_for_sale_imprbs.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299450/land_for_sale_in_boracay_s7wr7z.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299447/house_and_lot_for_sale_in_boracay_yaunnk.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299444/real_estate_boracay_philippines_sza1am.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299441/boracay_rent_house_sdacqp.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299438/boracay_house_and_lot_for_sale_dzxz0c.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299435/house_for_rent_in_boracay_liadvi.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299432/house_in_boracay_for_sale_hwhgza.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299429/boracay_business_for_sale_q4hfig.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299426/boracay_house_for_sale_prices_uslkak.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299423/houses_for_sale_boracay_llylc1.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299420/house_for_sale_in_boracay_philippines_i8dtbq.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299417/property_in_boracay_prc41c.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299414/houses_for_sale_in_boracay_philippines_zkutrn.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299411/boracay_land_for_sale_mekvvq.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299408/boracay_island_real_estate_wl3tfs.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299405/boracay_houses_pvojxc.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299402/house_for_rent_boracay_l3fsxp.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299399/boracay_properties_iz3wii.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299396/homes_for_sale_boracay_philippines_oygtb7.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299393/boracay_beach_house_for_sale_ok14mj.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299390/boracay_house_for_rent_hfxhcn.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299388/boracay_villa_for_sale_ggjhmr.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299385/houses_in_boracay_fipl69.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299382/houses_for_sale_in_boracay_csioiy.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299379/boracay_resort_for_sale_fruhy9.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299376/boracay_real_estate_for_sale_l3fbgt.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299373/boracay_house_ghlqy6.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299370/boracay_apartment_for_sale_p7uxng.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299367/boracay_houses_for_sale_fhfslf.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299365/boracay_philippines_real_estate_bfr5zg.jpg" },
  { type: 'image', src: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751299361/homes_for_sale_in_boracay_philippines_xqzpol.jpg" },

  // Vertical Videos
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
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443644/IMG_9206_dtzr4l.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443644/IMG_9206_dtzr4l.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443644/IMG_9206_dtzr4l.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443644/IMG_9206_dtzr4l.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443630/IMG_9202_gyrwuc.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443630/IMG_9202_gyrwuc.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443630/IMG_9202_gyrwuc.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443630/IMG_9202_gyrwuc.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443333/IMG_1300_rmlfmk.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443333/IMG_1300_rmlfmk.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443333/IMG_1300_rmlfmk.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443333/IMG_1300_rmlfmk.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443286/WhatsApp_Video_2024-06-07_at_15.14.24_2_pgyxh6.mp4",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443286/WhatsApp_Video_2024-06-07_at_15.14.24_2_pgyxh6.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443286/WhatsApp_Video_2024-06-07_at_15.14.24_2_pgyxh6.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443286/WhatsApp_Video_2024-06-07_at_15.14.24_2_pgyxh6.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443237/IMG_9028_bmxjnz.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443237/IMG_9028_bmxjnz.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443237/IMG_9028_bmxjnz.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443237/IMG_9028_bmxjnz.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  },
  { 
    type: 'video', 
    src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443229/IMG_9030_ptsmzg.mov",
    poster: "https://res.cloudinary.com/dq3fftsfa/image/upload/w_500/v1751443229/IMG_9030_ptsmzg.jpg",
    formats: [
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_h265/v1751443229/IMG_9030_ptsmzg.mp4", type: "video/mp4" },
      { src: "https://res.cloudinary.com/dq3fftsfa/video/upload/f_auto,q_auto,vc_vp9/v1751443229/IMG_9030_ptsmzg.webm", type: "video/webm" }
    ],
    orientation: 'vertical'
  }
];

const WhiteBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [mediaVisible, setMediaVisible] = useState<boolean[]>(new Array(whiteBeachMedia.length).fill(false));
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
              
              if (whiteBeachMedia[index].type === 'video' && videoRefs.current[index]) {
                videoRefs.current[index]?.play().catch(e => console.log('Video play failed:', e));
              }
            }
            observer.unobserve(entry.target);
          } else {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (whiteBeachMedia[index].type === 'video' && videoRefs.current[index]) {
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
        title="White Beach Boracay – The Island's Most Famous Shoreline"
        description="Visit White Beach, the center of Boracay life. From vibrant sunsets to beach bars and water sports—it's all here."
        keywords="White Beach Boracay, Boracay nightlife, Boracay beach activities, Boracay Station 2, Boracay sunsets"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218560/Move_to_Boracay_u8a1qm.webp"
        url="https://boracay.house/beaches/white"
        type="article"
        canonical="https://boracay.house/beaches/white"
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

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {whiteBeachMedia.map((media, index) => {
              const isVerticalVideo = media.type === 'video' && media.orientation === 'vertical';
              
              let className = "relative overflow-hidden rounded-xl shadow-lg transition-all duration-1000 ease-out bg-gray-100";
              className += ` ${mediaVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
              
              // Special sizing for featured media
              if (index === 0) className += " col-span-1 sm:col-span-2 lg:col-span-3"; // Large hero media
              if (index === 3) className += " sm:col-span-2"; // Wide media

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
                      alt={`White Beach ${index + 1}`}
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

          <Blog />
        </Container>
      </div>
    </>
  );
};

export default WhiteBeachPage;