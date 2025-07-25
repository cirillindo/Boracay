import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { CheckCircle2, Home, ArrowLeft } from 'lucide-react';
import Confetti from '../components/Confetti';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Successful | Boracay.house</title>
        <meta name="description" content="Your payment has been successfully processed. Thank you for your transaction." />
      </Helmet>

      <Confetti fire={showConfetti} />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <div 
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s ease-out'
            }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your payment. Your transaction has been completed successfully and your order is now being processed.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Order Confirmed</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your order has been automatically confirmed and is being processed. We will contact you shortly with further details.
                </p>
              </div>
              
              <p className="text-gray-600 mb-8">
                A receipt has been sent to your email address. If you have any questions, please contact our support team.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/')}
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Return to Home
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PaymentSuccessPage;