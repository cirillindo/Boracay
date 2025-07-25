import React, { useState, useEffect, useRef } from 'react';
import Container from '../components/ui/Container';
import SEO from '../components/SEO';
import Blog from '../components/home/Blog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iliganBeachImages = [
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298674/boracay_real_estate_dcztd5.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298672/boracay_house_for_sale_sthnez.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298669/boracay_property_for_sale_hafvla.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298666/property_for_sale_in_boracay_bxrtor.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298663/house_for_sale_boracay_sslhac.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298661/real_estate_boracay_ivwa4v.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298658/boracay_homes_for_sale_af2pto.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298655/property_for_sale_boracay_pmkvb7.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298653/boracay_properties_for_sale_l0odgo.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298650/boracay_for_sale_owxlfl.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298647/house_for_sale_in_boracay_fly1yg.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298644/boracay_houses_for_sale_ebskzd.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298642/properties_for_sale_in_boracay_bisuim.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298639/homes_for_sale_in_boracay_philippines_gpmkq1.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298636/boracay_philippines_real_estate_mj0nbi.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298634/boracay_apartment_for_sale_s06n0p.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298631/boracay_house_imxyea.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298629/boracay_real_estate_for_sale_rstvqc.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298626/boracay_resort_for_sale_rbp3ok.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298623/houses_for_sale_in_boracay_xmvhet.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298621/houses_in_boracay_inbbhb.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298618/boracay_villa_for_sale_qjev4o.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298616/boracay_house_for_rent_erfzb3.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298613/boracay_beach_house_for_sale_p1kj1w.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298611/homes_for_sale_boracay_philippines_f5wvns.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751298609/boracay_properties_blimzf.jpg",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218635/Iligajn_Beachwebp_ntyigy.webp",
  "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218635/ilig-iligan-beach_qrrxpd.webp"
];

const IliganBeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [imagesVisible, setImagesVisible] = useState<boolean[]>(new Array(iliganBeachImages.length).fill(false));
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    return () => {
      imageRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      if (mapRef.current) observer.unobserve(mapRef.current);
    };
  }, []);

  return (
    <>
      <SEO
        title="Iligan Beach Boracay – Hidden Snorkeling Spot Near Diniwid"
        description="Visit Iligan Beach, one of Boracay's best-kept secrets. Ideal for snorkeling, swimming, and relaxing away from White Beach crowds."
        keywords="Iligan Beach Boracay, Ilig-Iligan, snorkeling Boracay, east Boracay beach, hidden beach Boracay"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218635/Iligajn_Beachwebp_ntyigy.webp"
        url="https://boracay.house/beaches/iligan"
        type="article"
        canonical="https://boracay.house/beaches/iligan"
        dynamicData={{
          og_title: "Iligan Beach – Boracay's Best Hidden Snorkeling Beach",
          og_description: "Crystal waters, coral reefs, and quiet surroundings—explore Iligan Beach, Boracay's peaceful east-side secret.",
          og_url: "https://boracay.house/beaches/iligan",
          og_type: "article",
          og_image: "https://res.cloudinary.com/dq3fftsfa/image/upload/v1751218635/Iligajn_Beachwebp_ntyigy.webp"
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
            🏖️ Iligan Beach (Ilig-Iligan)
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
            A hidden gem on the east side, Iligan Beach is great for snorkeling and swimming in calm, clear water. Perfect for adventurers and families seeking a peaceful shore.
          </p>

          {/* Image Mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {iliganBeachImages.slice(0, 12).map((src, index) => {
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
                    alt={`Iligan Beach image ${index + 1}`}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.5154470259054!2d121.92338273148778!3d11.984554500137579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a53c5e108c4deb%3A0xbc9ed02c483c67d5!2sIlig%20-%20Iligan%20Beach!5e0!3m2!1sen!2sat!4v1751219860237!5m2!1sen!2sat" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Exceptional Blog for Boracay section */}
          <Blog />
        </Container>
      </div>
    </>
  );
};

export default IliganBeachPage;