import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { Check, X, ChevronRight, TrendingUp, Home, Users, Briefcase, Plane, Handshake as HandShake } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Initialize Vanta effect with your specified configuration
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      const initVanta = async () => {
        const THREE = await import('three');
        const BIRDS = await import('vanta/dist/vanta.birds.min');
        
        vantaEffect.current = BIRDS.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0xffffff, // White background
          color1: 0x87ff, // Blue color for birds
          speedLimit: 4.00,
          quantity: 4.00
        });
      };

      initVanta().catch(console.error);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id');
          if (id) {
            setSectionsVisible(prev => ({
              ...prev,
              [id]: entry.isIntersecting
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="About Boracay House – Local Experts & Real Island Life"
        description="Meet the team behind Boracay.House. We live here, build here, rent here. And we love helping you do the same."
        keywords="about boracay house, boracay local experts, boracay real estate team, boracay island life"
        ogImage="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/13_marketing_copy_xemnmh.jpg"
        url="https://www.boracay.house/about"
        type="profile"
      />

      <div className="min-h-screen bg-white">
        <div className="h-32" />
        
        <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 w-full h-full animate-hero"
              style={{
                backgroundImage: 'url(https://res.cloudinary.com/dq3fftsfa/image/upload/v1748371020/Screenshot_2025-05-27_at_12.14.17_PM_efoue1_copy_cjtu8h.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform'
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="theater-curtain" />

          <Container className="relative z-10">
            <div 
              className="max-w-4xl mx-auto text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s ease-out'
              }}
            >
              <h1 className="text-5xl font-bold text-white mb-6">
                About Us
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                We're not just another real estate agency. We're property owners who understand what works in Boracay.
              </p>
            </div>
          </Container>
        </div>

        <section 
          ref={el => sectionRefs.current['island-life'] = el}
          data-section-id="island-life"
          className="py-24 relative overflow-hidden min-h-[600px]"
        >
          <div 
            ref={vantaRef}
            className="absolute inset-0 z-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-white/80 z-0" />
          
          <Container>
            <div 
              className="max-w-6xl mx-auto relative z-10"
              style={{
                opacity: sectionsVisible['island-life'] ? 1 : 0,
                transform: `translateY(${sectionsVisible['island-life'] ? '0' : '40px'})`,
                transition: 'all 1s ease-out'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-8">
                    Living the Island Life — and Sharing It with You
                  </h2>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>
                      We're a small European family who moved to Boracay nearly 10 years ago — chasing wind, sea, and a simpler life. What began as a kitesurfing dream turned into building our own tropical home. That project grew into a family-run Airbnb business with fully renovated villas, now sold as part of a new condo-style community.
                    </p>
                    <p>
                      We're not real estate agents. Just homeowners who struggled to work with local agencies — too slow, too vague, often unreliable. So we built our own site: Boracay.house. At first, it was just for our listings. But traffic and demand grew fast, and now it helps others rent, sell, or buy homes, condos, and land across the island.
                    </p>
                    <p>
                      We know what works here — from property design to permits, and from guest reviews to legal paperwork. And we keep it honest: no fake listings, no inflated beachfront prices, no commissions.
                    </p>
                    <p>
                      If you want to invest in Boracay, rent with ease, or list your property without the stress — you're in the right place.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-[60px] rotate-6 transform-gpu"></div>
                  <img 
                    src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1748367634/482324584_1130259389112739_6638706798572273322_n_hihhyf.jpg"
                    alt="Island Life in Boracay"
                    className="relative rounded-[40px] shadow-xl transform-gpu transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Rest of your sections remain exactly the same */}
        <section 
          ref={el => sectionRefs.current['different'] = el}
          data-section-id="different"
          className="py-24 bg-gray-50"
        >
          <Container>
            <div 
              className="max-w-5xl mx-auto"
              style={{
                opacity: sectionsVisible['different'] ? 1 : 0,
                transform: `translateY(${sectionsVisible['different'] ? '0' : '40px'})`,
                transition: 'all 1s ease-out'
              }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">How We're Different</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We've tried working with traditional agencies. The results were slow, and service was lacking. So we built something better.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-red-50 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-red-900">Traditional Agents</h3>
                  <div className="space-y-4">
                    {[
                      'Work across dozens of locations',
                      'Push overpriced listings',
                      'Slow to respond, poor photos',
                      "Don't understand rentals"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-primary-900">Boracay.house</h3>
                  <div className="space-y-4">
                    {[
                      'Focused 100% on Boracay',
                      'Filtered for real value',
                      'Direct, fast, honest, with real media',
                      'We operate high-performing Airbnbs ourselves'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                        <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span className="text-primary-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section 
          ref={el => sectionRefs.current['why-exist'] = el}
          data-section-id="why-exist"
          className="py-24 bg-white"
        >
          <Container>
            <div 
              className="max-w-6xl mx-auto"
              style={{
                opacity: sectionsVisible['why-exist'] ? 1 : 0,
                transform: `translateY(${sectionsVisible['why-exist'] ? '0' : '40px'})`,
                transition: 'all 1s ease-out'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-100 rounded-[60px] -rotate-6 transform-gpu"></div>
                  <img 
                    src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750260129/properties/pqadieeprcvucwh2yz11.webp"
                    alt="Why We Exist"
                    className="relative rounded-[40px] shadow-xl transform-gpu transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-8">Why We Exist</h2>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>
                      We couldn't find a single place focused only on Boracay — without the noise. So we built one.
                    </p>
                    <p>
                      We live here. We manage Airbnb rentals here. We know which deals make sense and which to avoid.
                    </p>
                    <p>
                      This site is for people who want to own, rent, or invest in Boracay with clear facts, clean properties, and no middlemen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section 
          ref={el => sectionRefs.current['local-advantage'] = el}
          data-section-id="local-advantage"
          className="py-24 bg-gray-50"
        >
          <Container>
            <div 
              className="max-w-6xl mx-auto"
              style={{
                opacity: sectionsVisible['local-advantage'] ? 1 : 0,
                transform: `translateY(${sectionsVisible['local-advantage'] ? '0' : '40px'})`,
                transition: 'all 1s ease-out'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Local Advantage</h2>
                    <p className="text-gray-600 leading-relaxed">
                      We're not a Manila-based agency. We walk these streets every day.
                      We know which neighborhoods are growing, what permits matter, and how to make an investment work — legally and profitably.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-4">Airbnb Operations</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      We don't just list — we host.
                      With 85%+ occupancy, 100+ five-star reviews, and full-service property management, we know what makes a Boracay rental successful.
                      And we're happy to share.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Who Uses This Site</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Investors looking for rental income</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Families relocating to Boracay</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Owners tired of poor property managers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Plane className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Travelers who want direct rentals with trust</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HandShake className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Locals who want to list and sell without being pushed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-[60px] rotate-3 transform-gpu"></div>
                  <img 
                    src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1748368416/download_ggl7m4.jpg"
                    alt="Local Advantage"
                    className="relative rounded-[40px] shadow-xl transform-gpu transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section 
          ref={el => sectionRefs.current['cta'] = el}
          data-section-id="cta"
          className="py-24 bg-white"
        >
          <Container>
            <div 
              className="max-w-4xl mx-auto text-center"
              style={{
                opacity: sectionsVisible['cta'] ? 1 : 0,
                transform: `translateY(${sectionsVisible['cta'] ? '0' : '40px'})`,
                transition: 'all 1s ease-out'
              }}
            >
              <h2 className="text-4xl font-bold mb-8">
                Ready to Work Together?
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Whether you're buying, selling, or just exploring options in Boracay, we're here to help.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="text-lg flex items-center gap-2"
              >
                Get in Touch
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Container>
        </section>

        <div className="sr-only">
          Expert real estate services in Boracay. Local property knowledge, direct owner listings, and transparent transactions. Find your perfect home or investment property in Boracay with us.
        </div>
      </div>
    </>
  );
};

export default AboutPage;