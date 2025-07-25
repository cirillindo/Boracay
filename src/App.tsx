import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import CookieConsent from './components/layout/CookieConsent';
import HtmlContentRenderer from './components/HtmlContentRenderer';
import HomePage from './pages/HomePage.tsx';
import PropertyPage from './pages/PropertyPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ForSalePage from './pages/ForSalePage';
import AirbnbPage from './pages/AirbnbPage';
import AboutPage from './pages/AboutPage';
import WeDoBetterPage from './pages/WeDoBetterPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogCategoryPage from './pages/BlogCategoryPage';
import FavoritesPage from './pages/FavoritesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactPage from './pages/ContactPage';
import GuestHelpPage from './pages/GuestHelpPage';
import VacationRentalManagementPage from './pages/VacationRentalManagementPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PropertyServicesPage from './pages/PropertyServicesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PukaBeachPage from './pages/PukaBeachPage';
import IliganBeachPage from './pages/IliganBeachPage';
import DiniwidBeachPage from './pages/DiniwidBeachPage';
import WhiteBeachPage from './pages/WhiteBeachPage';
import TambisaanBeachPage from './pages/TambisaanBeachPage';
import PromosPage from './pages/PromosPage';
import BulabogBeachPage from './pages/BulabogBeachPage';
import TablasIslandPage from './pages/TablasIslandPage';
import BoracayDreamMoveCalculator from './pages/BoracayDreamMoveCalculator';
import BeachesDashboardPage from './pages/BeachesDashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ShoppingCartPage from './pages/ShoppingCartPage';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track page view with Google Analytics
    if (window.gtag) {
      window.gtag('config', 'G-RNXSW628E5', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return null;
};

// Add gtag to Window interface
declare global {
  interface Window {
    gtag: (command: string, target: string, config?: any) => void;
    dataLayer: any[];
  }
}

function App() {
  const [footerHeight, setFooterHeight] = React.useState(0);

  // HTML content for the blog guide preview - newspaper style
  const tempBlogGuideHtmlContent = `
    <div class="newspaper-article-content">
      <div class="newspaper-header">
        <h1>How to Reach Ilaw Ilaw Villas from Caticlan Airport</h1>
        <div class="byline">A Complete Step-by-Step Transportation Guide</div>
        <div class="date">Published: January 2025 | Boracay Travel Guide</div>
      </div>

      <div class="lead-image">
        <video 
          controls 
          loop 
          muted 
          autoplay
          playsinline
          poster="https://res.cloudinary.com/dq3fftsfa/image/upload/v1748367206/489425930_1137085028431955_6025728311014440020_n_lkk5xd.jpg"
        >
          <source src="https://res.cloudinary.com/dq3fftsfa/video/upload/v1750412244/etrikeairport_Boracay_tjnpfn.mov" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="caption">Watch how travelers arrive at Caticlan Airport and begin their journey to Boracay Island via tricycle to the jetty port.</div>
      </div>

      <div class="article-content">
        <p class="lead">Welcome to your step-by-step journey from Caticlan Airport to Ilaw Ilaw Villas! Don't worry - I'll walk you through every detail so you know exactly what to expect. From the moment you land until you're relaxing at our beautiful villas, this guide has you covered with clear costs, timing, and insider tips for a smooth arrival.</p>

        <h2>Step 1: Getting to Caticlan Jetty Port 🚲</h2>
        
        <h3>Tricycle Option</h3>
        <p>Once you exit the airport terminal, you'll see some van services, but walk past them to find the tricycles waiting for passengers. These three-wheeled vehicles are your most economical choice to reach Caticlan Jetty Port.</p>
        
        <p><strong>Cost:</strong> <strong>PHP 150</strong> if you're traveling alone, or <strong>PHP 50 per person</strong> for groups of two or more.</p>
        <p><strong>Travel Time:</strong> 5-10 minutes depending on traffic.</p>

        <h2>Step 2: Handling Your Bags 🧳</h2>
        
        <h3>Porters</h3>
        <p>Upon arrival at the port, porters will offer to carry your bags. This is completely optional, but can be helpful if you have heavy luggage.</p>
        
        <ul class="fee-list">
          <li><strong>Porter Fee:</strong> <strong>PHP 50 per bag</strong> (tipping is optional)</li>
        </ul>

        <h2>Step 3: Pay the Necessary Fees 💰</h2>
        
        <h3>Rates per Person</h3>
        <p>All passengers must pay these mandatory fees before boarding the ferry to Boracay Island:</p>
        
        <ul class="fee-list">
          <li><strong>Boat Fee:</strong> <strong>PHP 50.00</strong></li>
          <li><strong>Local Tourist Terminal Fee:</strong> <strong>PHP 150.00</strong></li>
          <li><strong>Foreign Tourist Terminal Fee:</strong> <strong>PHP 300.00</strong></li>
          <li><strong>Environmental Fee:</strong> <strong>PHP 75.00</strong></li>
        </ul>

        <h3>Schedule</h3>
        <p>Here's what to expect for ferry timing:</p>
        <ul class="fee-list">
          <li>High frequency during the day, every <strong>10 minutes</strong></li>
          <li>Fewer boats at night; expect long waits between <strong>1 AM - 3 AM</strong></li>
          <li>For immediate departure at night, purchase all available spots for about <strong>PHP 1,500</strong></li>
        </ul>

        <h2>Step 4: Board Your Boat or Ferry ⛵</h2>
        
        <h3>After Payment</h3>
        <p>Once you've paid your fees, here's what happens next:</p>
        <ul class="fee-list">
          <li>Enter the port building and pass through security</li>
          <li>Wait in the Passenger Waiting Area until boarding time</li>
          <li>Queue up and board your boat or ferry</li>
        </ul>
        <p><strong>Travel Time:</strong> 10-15 minutes across calm waters.</p>

        <h2>Step 5: Get an E-Trike to Diniwid 🌴</h2>
        
        <p>Upon arrival at Boracay's Cagban Port, electric tricycles (e-trikes) will be waiting to take you to various destinations around the island.</p>
        
        <p><strong>Cost:</strong> <strong>PHP 250-300</strong> for the journey to Diniwid area</p>
        <p><strong>Travel Time:</strong> About 15 minutes</p>
        <p>Ask the driver to take you to <strong>"Diniwid corner Bukid way (SPR Real Estate)"</strong></p>
        <p>If needed, they can call Norland at <strong>+63 969 331 6725</strong> for directions.</p>

        <div class="downloadable-image">
          <a href="https://res.cloudinary.com/dq3fftsfa/image/upload/v1749285358/e37696_8470c18bc21541349545f71e354f7e11_mv2_drrgjq.avif" download="Boracay_Etrike_Price_Chart.avif">
            <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1749285358/e37696_8470c18bc21541349545f71e354f7e11_mv2_drrgjq.avif" alt="Boracay E-trike Price Chart" />
            <div class="download-text">
              <span class="download-icon">📱</span>
              <span>Click to download E-trike Price Chart</span>
            </div>
          </a>
        </div>

        <h2>Step 6: Find Ilaw Ilaw Villas 🏠</h2>
        
        <p>Now for the final stretch! Here's exactly how to find us:</p>
        
        <ul class="fee-list">
          <li><strong>Look for the big SPR panel</strong> on your left side and find Bukid Way</li>
          <li><strong>Go up 50 meters</strong>, and on your right side, you'll see a big white house with a cocoon roof, known as <strong>Nonna's House</strong></li>
          <li><strong>At the intersection of Bukid Way</strong>, turn at the large billboard for SPR. A short, steep 30-meter walk brings you to your destination, where a warm welcome awaits</li>
        </ul>

        <div class="downloadable-image">
          <a href="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750411038/Bukid_Etrike_guide_copy_hu0ctf.jpg" download="Nonna_House_Map_Guide.jpg">
            <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750411038/Bukid_Etrike_guide_copy_hu0ctf.jpg" alt="Nonna's House Map Guide" />
            <div class="download-text">
              <span class="download-icon">🗺️</span>
              <span>Click to download Nonna's House Map Guide</span>
            </div>
          </a>
        </div>

        <div class="downloadable-image">
          <a href="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750411055/Pulang_Etrike_guide_copy_fe0wa3.jpg" download="Ilaw_Ilaw_Villa_Map_Guide.jpg">
            <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750411055/Pulang_Etrike_guide_copy_fe0wa3.jpg" alt="Ilaw Ilaw Villa Map Guide" />
            <div class="download-text">
              <span class="download-icon">🏡</span>
              <span>Click to download Ilaw Ilaw Villa Map Guide</span>
            </div>
          </a>
        </div>

        <p><strong>Enjoy your stay at Ilaw Ilaw Villas! 🌺⛱️</strong></p>

        <div class="info-box">
          <h4>Additional Resources</h4>
          
          <div class="norland-contact">
            <div class="norland-image">
              <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1749249083/Norland_ighb6z.jpg" alt="Norland - On-Site Coordinator" />
            </div>
            <div class="norland-info">
              <h5>Meet Norland - Your On-Site Coordinator</h5>
              <p>For emergency assistance or directions during your journey, contact our friendly on-site coordinator:</p>
              <a href="https://wa.me/639693316725?text=Hello%20Norland%2C%20I%20need%20assistance%20with%20directions%20to%20Ilaw%20Ilaw%20Villas." class="whatsapp-link" target="_blank" rel="noopener noreferrer">
                <span class="whatsapp-icon">💬</span>
                <span>WhatsApp Norland: +63 969 331 6725</span>
              </a>
              <p class="availability">Available 24/7 for arriving guests</p>
            </div>
          </div>
          
          <p>Our latest article compares the best transfer options from Caticlan Airport to make your journey easy and hassle-free. From standard to premium services, <strong>check all the compared costs to reach your villa</strong> and find the best deal for you.</p>
        </div>
      </div>
    </div>

    <style>
      .newspaper-article-content {
        font-family: 'Times New Roman', serif;
        line-height: 1.7;
        color: #2c3e50;
        background-color: #fefefe;
        padding-top: 8rem;
      }

      .newspaper-header {
        text-align: center;
        border-bottom: 4px double #5aa893;
        padding-bottom: 25px;
        margin-bottom: 35px;
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        padding: 30px 20px 25px;
        border-radius: 8px 8px 0 0;
      }

      .newspaper-header h1 {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 3.2em;
        font-weight: 900;
        margin: 0 0 15px 0;
        color: #1a252f;
        letter-spacing: -1px;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        line-height: 1.1;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .byline {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.3em;
        font-style: italic;
        color: #5aa893;
        margin-bottom: 12px;
        font-weight: 600;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
      }

      .date {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 0.95em;
        color: #7f8c8d;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 500;
      }

      .lead-image {
        margin: 35px 0;
        text-align: center;
      }

      .lead-image video {
        width: 100%;
        max-width: 600px;
        height: auto;
        border: 2px solid #5aa893;
        box-shadow: 0 8px 24px rgba(90, 168, 147, 0.2);
        border-radius: 12px;
        display: block;
        margin: 0 auto;
        object-fit: cover;
      }

      .lead-image img {
        width: 100%;
        max-width: 600px;
        height: auto;
        border: 2px solid #5aa893;
        box-shadow: 0 8px 24px rgba(90, 168, 147, 0.2);
        border-radius: 12px;
        display: block;
        margin: 0 auto;
      }

      .caption {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 0.95em;
        color: #7f8c8d;
        font-style: italic;
        margin-top: 12px;
        padding: 0 20px;
      }

      .article-content {
        column-count: 1;
        column-gap: 30px;
        text-align: justify;
      }

      .lead {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.25em;
        font-weight: 600;
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e8f5f0 100%);
        border-left: 6px solid #5aa893;
        font-style: italic;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 4px 12px rgba(90, 168, 147, 0.1);
      }

      h2 {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 2.2em;
        font-weight: 800;
        color: #2c3e50;
        margin: 40px 0 20px 0;
        padding-bottom: 12px;
        border-bottom: 4px solid #5aa893;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        position: relative;
      }

      h2::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 60px;
        height: 4px;
        background: #74bfab;
      }

      h3 {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.6em;
        font-weight: 700;
        color: #458576;
        margin: 30px 0 15px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
      }

      h4 {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.3em;
        color: #2c3e50;
        margin: 25px 0 12px 0;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      h5 {
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.1em;
        color: #2c3e50;
        margin: 15px 0 8px 0;
        font-weight: 600;
      }

      p {
        margin-bottom: 18px;
        text-indent: 0;
        line-height: 1.8;
      }

      .fee-list {
        background: linear-gradient(135deg, #f8f9fa 0%, #e8f5f0 100%);
        padding: 20px 25px;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px solid #5aa893;
        box-shadow: 0 4px 12px rgba(90, 168, 147, 0.1);
      }

      .fee-list li {
        margin-bottom: 10px;
        list-style-type: none;
        position: relative;
        padding-left: 25px;
        font-weight: 500;
      }

      .fee-list li:before {
        content: "💰";
        position: absolute;
        left: 0;
        font-size: 1.1em;
      }

      .downloadable-image {
        margin: 30px 0;
        text-align: center;
        border: 2px dashed #5aa893;
        border-radius: 12px;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e8f5f0 100%);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .downloadable-image:hover {
        border-color: #74bfab;
        background: linear-gradient(135deg, #e8f5f0 0%, #d4f1e8 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(90, 168, 147, 0.2);
      }

      .downloadable-image img {
        width: 100%;
        max-width: 500px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
      }

      .downloadable-image:hover img {
        transform: scale(1.02);
      }

      .download-text {
        margin-top: 15px;
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.1em;
        font-weight: 600;
        color: #2c3e50;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .download-icon {
        font-size: 1.3em;
      }

      .info-box {
        background: linear-gradient(135deg, #e8f5f0 0%, #d4f1e8 100%);
        border: 2px solid #5aa893;
        border-radius: 12px;
        padding: 25px;
        margin: 35px 0;
        box-shadow: 0 8px 24px rgba(90, 168, 147, 0.15);
        position: relative;
      }

      .info-box::before {
        content: "ℹ️";
        position: absolute;
        top: -15px;
        left: 25px;
        background: #5aa893;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
      }

      .info-box h4 {
        color: #2c3e50;
        margin-top: 5px;
        margin-bottom: 18px;
        font-size: 1.4em;
      }

      .info-box p {
        margin-bottom: 12px;
        font-size: 1em;
        line-height: 1.7;
      }

      .norland-contact {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        margin: 20px 0;
        padding: 20px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 12px;
        border: 1px solid rgba(90, 168, 147, 0.3);
      }

      .norland-image {
        flex-shrink: 0;
      }

      .norland-image img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #5aa893;
        box-shadow: 0 4px 12px rgba(90, 168, 147, 0.2);
      }

      .norland-info {
        flex: 1;
      }

      .norland-info h5 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #2c3e50;
      }

      .norland-info p {
        margin-bottom: 10px;
        font-size: 0.95em;
      }

      .whatsapp-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #25D366;
        color: white;
        padding: 10px 16px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95em;
        transition: all 0.3s ease;
        margin: 8px 0;
      }

      .whatsapp-link:hover {
        background: #128C7E;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        color: white;
        text-decoration: none;
      }

      .whatsapp-icon {
        font-size: 1.1em;
      }

      .availability {
        font-size: 0.85em;
        color: #5aa893;
        font-style: italic;
        margin-top: 8px;
        margin-bottom: 0;
      }

      strong {
        color: #1a252f;
        font-weight: 700;
      }

      ul {
        margin: 18px 0;
        padding-left: 0;
      }

      li {
        margin-bottom: 10px;
      }

      @media (max-width: 768px) {
        .newspaper-article-content {
          padding: 15px;
          padding-top: 8rem;
        }
        
        .newspaper-header h1 {
          font-size: 2.2em;
          letter-spacing: -0.5px;
        }

        h2 {
          font-size: 1.8em;
        }

        h3 {
          font-size: 1.4em;
        }
        
        .article-content {
          column-count: 1;
        }

        .lead {
          font-size: 1.1em;
          padding: 15px;
        }

        .downloadable-image {
          padding: 15px;
        }

        .download-text {
          font-size: 1em;
        }

        .lead-image video {
          max-width: 100%;
        }

        .norland-contact {
          flex-direction: column;
          text-align: center;
          gap: 15px;
        }

        .norland-image img {
          width: 60px;
          height: 60px;
        }

        .whatsapp-link {
          font-size: 0.9em;
          padding: 8px 14px;
        }
      }
    </style>
  `;

  return (
    <BrowserRouter>
      <ShoppingCartProvider>
        <ScrollToTop />
        <div className="relative">
          <Footer onHeightChange={setFooterHeight} />
          <div className="content-wrapper" style={{ paddingBottom: footerHeight }}>
            <div className="theater-curtain" />
            <div className="relative z-10">
              <Navbar />
              <main className="relative">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/for-sale" element={<ForSalePage />} />
                  <Route path="/airbnb" element={<AirbnbPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/we-do-better" element={<WeDoBetterPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:categorySlug" element={<BlogCategoryPage />} />
                  <Route path="/blog/:categorySlug/:slug" element={<BlogPostPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/:slug" element={<PropertyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/guest-help" element={<GuestHelpPage />} />
                  <Route path="/vacation-rental-management" element={<VacationRentalManagementPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/payment-success" element={<PaymentSuccessPage />} />
                  <Route path="/services" element={<PropertyServicesPage />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/dream-move-calculator" element={<BoracayDreamMoveCalculator />} />
                  {/* Preview route for HTML content */}
                  <Route path="/preview-html" element={<HtmlContentRenderer htmlContent={tempBlogGuideHtmlContent} />} />
                  <Route path="/beaches/puka-shell-beach" element={<PukaBeachPage />} />
                  <Route path="/beaches/ilig-iligan-beach" element={<IliganBeachPage />} />
                  <Route path="/beaches/diniwid-beach" element={<DiniwidBeachPage />} />
                  <Route path="/beaches/white-beach" element={<WhiteBeachPage />} />
                  <Route path="/beaches/tambisaan-beach" element={<TambisaanBeachPage />} />
                  <Route path="/promos" element={<PromosPage />} />
                  <Route path="/beaches/bulabog-beach" element={<BulabogBeachPage />} />
                  <Route path="/tablas-island" element={<TablasIslandPage />} />
                  <Route path="/beaches" element={<BeachesDashboardPage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/cart" element={<ShoppingCartPage />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <WhatsAppButton />
              </main>
              <CookieConsent />
            </div>
          </div>
        </div>
      </ShoppingCartProvider>
    </BrowserRouter>
  );
}

export default App;