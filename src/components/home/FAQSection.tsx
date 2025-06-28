import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';
import HALO from 'vanta/dist/vanta.halo.min';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQSectionProps {
  vantaEffect?: 'birds' | 'halo';
}

const faqs: FAQItem[] = [
  {
    question: "Do you sell beachfront property?",
    answer: "No. We don't list beachfront land or houses — those often come with legal risk or inflated pricing. We specialize in properties close to the beach, where ownership is more secure, pricing is fair, and rental demand stays strong year-round."
  },
  {
    question: "Can foreigners buy property in Boracay?",
    answer: (
      <div className="space-y-4">
        <p>Yes — but not land directly.</p>
        <p>Foreigners typically:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Buy condos or apartments, with legal ownership under the building's Tax Declaration</li>
          <li>Lease land or houses for 25 to 50 years, with renewable contracts</li>
          <li>Form a Philippine corporation to acquire land (a common workaround)</li>
        </ul>
        <p>We'll guide you through the most common paths and connect you with trusted legal partners.</p>
      </div>
    )
  },
  {
    question: "Are all your listings titled?",
    answer: (
      <div className="space-y-2">
        <p>Most are under Tax Declaration rather than formal titles — a standard in Boracay.</p>
        <p>We carefully review each property's documents, ownership history, and location, so you understand what you're buying.</p>
      </div>
    )
  },
  {
    question: "Can I use the property as an investment or Airbnb rental?",
    answer: (
      <div className="space-y-2">
        <p>Absolutely. Many of our listings are ideal for Airbnb or long-term rentals, with strong occupancy and guest demand.</p>
        <p>We also offer full property management and marketing support, so you can rent out even if you live abroad.</p>
      </div>
    )
  },
  {
    question: "What kind of ROI can I expect?",
    answer: (
      <div className="space-y-4">
        <p>It depends on the property and how you use it, but typical investors see:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>8–12% annual rental yield (net, if managed well)</li>
          <li>5–7% annual appreciation on land or resale homes</li>
          <li>Higher ROI on renovation + resale in 2–3 years</li>
        </ul>
        <p>We'll help you estimate realistic returns before you commit.</p>
      </div>
    )
  },
  {
    question: "How fast can I list my property here?",
    answer: (
      <div className="space-y-2">
        <p>If you send clean documents and good photos, we can usually go live in 1–2 business days.</p>
        <p>No hidden fees. No agent markups. We handle the exposure — you stay in control.</p>
      </div>
    )
  },
  {
    question: "What kind of properties do you list?",
    answer: (
      <div className="space-y-4">
        <p>We focus on smart, verified listings with high usability:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Lots and land (mostly under Tax Dec)</li>
          <li>Condos and apartments for sale or rent</li>
          <li>Villas, homes, and fixer-uppers with strong rental or resale potential</li>
          <li>Leasehold investments with clear terms</li>
        </ul>
        <p>Every listing is hand-reviewed — we don't just upload and forget.</p>
      </div>
    )
  }
];

const FAQSection: React.FC<FAQSectionProps> = ({ vantaEffect = 'halo' }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!vantaRef.current && sectionRef.current) {
      const vantaConfig = {
        el: sectionRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00
      };

      if (vantaEffect === 'birds') {
        vantaRef.current = BIRDS({
          ...vantaConfig,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0xffffff,
          color1: 0x68786f,
          color2: 0x74bfab,
          colorMode: "lerp",
          birdSize: 1.20,
          wingSpan: 40.00,
          speedLimit: 5.00,
          separation: 30.00,
          alignment: 40.00,
          cohesion: 40.00,
          quantity: 4.00,
          backgroundAlpha: 0.32
        });
      } else {
        vantaRef.current = HALO({
          ...vantaConfig,
          baseColor: 0x47af9b,
          backgroundColor: 0xc1f7e9,
          amplitudeFactor: 3.00,
          size: 2.60
        });
      }
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [vantaEffect]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      <Container>
        <div 
          className="max-w-3xl mx-auto"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease-out'
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${
                  activeIndex === index ? 'ring-4 ring-amber-500/30' : ''
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.5s ease-out',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-white/80 hover:bg-white/95 transition-colors duration-300"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-amber-600 transition-transform duration-500 ease-in-out ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-amber-50/50">
                    <div className="text-gray-700 leading-relaxed">{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/contact')}
              className="text-lg"
            >
              List your property →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;