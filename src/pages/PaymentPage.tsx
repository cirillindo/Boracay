import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { CreditCard, Check, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Confetti from '../components/Confetti';

const PaymentPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'stripe' | 'paypal' | 'gcash' | 'rubles' | 'revolut'>('stripe');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<{
    paypal: boolean;
    gcash: boolean;
    rubles: boolean;
    revolut: boolean;
  }>({ paypal: false, gcash: false, rubles: false, revolut: false });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleStripePayment = async () => {
    if (amount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call the Supabase Edge Function to create a payment intent
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'eur',
          description: description || 'Payment to Boracay.house',
          email: email || undefined,
          name: name || undefined
        }
      });

      if (error) {
        throw new Error(`Payment service error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response from payment service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating payment:', error);
      
      let errorMsg = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // Provide user-friendly error messages
      if (errorMsg.includes('STRIPE_SECRET_KEY')) {
        errorMsg = 'Payment service is temporarily unavailable. Please try again later or contact support.';
      } else if (errorMsg.includes('Network')) {
        errorMsg = 'Network error. Please check your connection and try again.';
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async (text: string, type: 'paypal' | 'gcash' | 'rubles' | 'revolut') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const simulateSuccessfulPayment = () => {
    setSuccessMessage('Payment information copied! Please complete your payment using the copied details.');
    setShowConfetti(true);
  };

  const paymentInstructionNote = (
    <div className="bg-amber-50 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
      <p className="font-medium text-amber-800 mb-2">Important Payment Instructions:</p>
      <p className="text-amber-700">
        When making your payment, please include your <strong>booking name</strong>, <strong>check-in</strong> and <strong>check-out dates</strong>. 
        After payment, please send us a copy or screenshot of your payment confirmation.
      </p>
    </div>
  );

  const russianPaymentInstructionNote = (
    <div className="bg-amber-50 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
      <p className="font-medium text-amber-800 mb-2">Важные инструкции по оплате:</p>
      <p className="text-amber-700">
        При осуществлении платежа, пожалуйста, укажите имя, на которое оформлено бронирование, а также даты заезда и выезда.
        После оплаты отправьте нам, пожалуйста, копию или скриншот подтверждения платежа.
      </p>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Make a Payment | Boracay.house</title>
        <meta name="description" content="Make a secure payment to Boracay.house. We accept Stripe, PayPal, GCash, Rubles, and Revolut." />
        <link rel="canonical" href="https://www.boracay.house/payment" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="h-32" />
        
        <Container className="py-16">
          <div 
            className="max-w-3xl mx-auto"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s ease-out'
            }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Make a Payment
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Use this page to make payments for deposits, room upgrades, or any other services.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Payment Method Tabs */}
              <div className="flex flex-wrap border-b">
                <button
                  onClick={() => setActiveTab('stripe')}
                  className={`py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === 'stripe'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setActiveTab('paypal')}
                  className={`py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === 'paypal'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  PayPal
                </button>
                <button
                  onClick={() => setActiveTab('gcash')}
                  className={`py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === 'gcash'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  GCash
                </button>
                <button
                  onClick={() => setActiveTab('rubles')}
                  className={`py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === 'rubles'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  Рубли
                </button>
                <button
                  onClick={() => setActiveTab('revolut')}
                  className={`py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === 'revolut'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  Revolut
                </button>
              </div>

              {/* Payment Form Content */}
              <div className="p-6 md:p-8">
                {/* Only show input fields for Stripe/Credit Card */}
                {activeTab === 'stripe' && (
                  <>
                    {/* Common Amount Input */}
                    <div className="mb-6">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (EUR) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          min="1"
                          step="0.01"
                          value={amount || ''}
                          onChange={handleAmountChange}
                          required
                          className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Optional Fields */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Description (Optional)
                        </label>
                        <input
                          type="text"
                          id="description"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          placeholder="e.g., Booking deposit, Property payment"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name (Optional)
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email for Receipt (Optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Stripe Payment */}
                {activeTab === 'stripe' && (
                  <div className="space-y-6">
                    {paymentInstructionNote}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Pay with Credit Card</h3>
                      <p className="text-blue-700 text-sm">
                        Secure payment processing via Stripe. Your card details are never stored on our servers.
                      </p>
                    </div>

                    <Button
                      onClick={handleStripePayment}
                      disabled={isLoading || amount <= 0}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay €{amount.toFixed(2)} with Card
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* PayPal Payment */}
                {activeTab === 'paypal' && (
                  <div className="space-y-6">
                    {paymentInstructionNote}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Pay with PayPal</h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Send your payment to the following PayPal account:
                      </p>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <span className="font-medium text-gray-800">giorgio@schwaiger.ws</span>
                        <button 
                          onClick={() => handleCopyToClipboard('giorgio@schwaiger.ws', 'paypal')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Copy PayPal email"
                        >
                          {copySuccess.paypal ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleCopyToClipboard('giorgio@schwaiger.ws', 'paypal')}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        Copy Email
                      </Button>
                      
                      <a
                        href="https://www.paypal.com/signin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6]"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Go to PayPal
                        </Button>
                      </a>
                    </div>
                    
                    <Button
                      onClick={simulateSuccessfulPayment}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      I've Completed My Payment
                    </Button>
                  </div>
                )}

                {/* GCash Payment */}
                {activeTab === 'gcash' && (
                  <div className="space-y-6">
                    {paymentInstructionNote}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Pay with GCash</h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Send your payment to the following GCash number:
                      </p>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <span className="font-medium text-gray-800">09615844773</span>
                        <button 
                          onClick={() => handleCopyToClipboard('09615844773', 'gcash')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Copy GCash number"
                        >
                          {copySuccess.gcash ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <img 
                          src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750802182/WhatsApp_Image_2025-06-24_at_23.56.09_jubdoi.jpg" 
                          alt="GCash QR Code" 
                          className="max-w-full h-auto max-h-[33.6rem] rounded-lg border border-blue-200"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleCopyToClipboard('09615844773', 'gcash')}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        Copy Number
                      </Button>
                      
                      <a
                        href="https://www.gcash.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6]"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Go to GCash
                        </Button>
                      </a>
                    </div>
                    
                    <Button
                      onClick={simulateSuccessfulPayment}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      I've Completed My Payment
                    </Button>
                  </div>
                )}

                {/* Rubles Payment */}
                {activeTab === 'rubles' && (
                  <div className="space-y-6">
                    {russianPaymentInstructionNote}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Оплата в рублях</h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Платежи в рублях на российский банковский счет, свяжитесь с Анной для получения реквизитов:
                      </p>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <span className="font-medium text-gray-800">+7 909 655-66-08</span>
                        <button 
                          onClick={() => handleCopyToClipboard('+7 909 655-66-08', 'rubles')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Copy WhatsApp number"
                        >
                          {copySuccess.rubles ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleCopyToClipboard('+7 909 655-66-08', 'rubles')}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        Скопировать номер
                      </Button>
                      
                      <a
                        href="https://wa.me/79096556608?text=Здравствуйте!%20Я%20хотел(а)%20бы%20получить%20реквизиты%20для%20оплаты%20в%20рублях."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E]"
                        >
                          <ExternalLink className="w-5 h-5" />
                          WhatsApp Анне
                        </Button>
                      </a>
                    </div>
                    
                    <Button
                      onClick={simulateSuccessfulPayment}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Я завершил(а) платеж
                    </Button>
                  </div>
                )}

                {/* Revolut Payment */}
                {activeTab === 'revolut' && (
                  <div className="space-y-6">
                    {paymentInstructionNote}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Pay with Revolut</h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Send your payment using Revolut:
                      </p>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <span className="font-medium text-gray-800">@cirillindo</span>
                        <button 
                          onClick={() => handleCopyToClipboard('@cirillindo', 'revolut')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Copy Revolut tag"
                        >
                          {copySuccess.revolut ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <p className="font-medium text-blue-800">Important:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-blue-700">
                          <li>You can send money via this link: <a href="https://revolut.me/cirillindo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://revolut.me/cirillindo</a></li>
                        </ul>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <img 
                          src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750802047/WhatsApp_Image_2025-06-24_at_23.52.39_l6xylt.jpg" 
                          alt="Revolut QR Code" 
                          className="max-w-full h-auto max-h-96 rounded-lg border border-blue-200"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleCopyToClipboard('@cirillindo', 'revolut')}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        Copy Revolut Tag
                      </Button>
                      
                      <a
                        href="https://revolut.me/cirillindo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6]"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Go to Revolut
                        </Button>
                      </a>
                    </div>
                    
                    <Button
                      onClick={simulateSuccessfulPayment}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      I've Completed My Payment
                    </Button>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                For any payment-related questions, please contact us at <a href="mailto:ilawilawvilla@gmail.com" className="text-amber-600 hover:underline">ilawilawvilla@gmail.com</a>
              </p>
              <div className="flex justify-center mt-4 space-x-4">
                <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/visa_logo_ixpfzz.png" alt="Visa" className="h-8" />
                <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/mastercard_logo_ixpfzz.png" alt="Mastercard" className="h-8" />
                <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1750677412/amex_logo_ixpfzz.png" alt="American Express" className="h-8" />
                <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751122800/paypal-logo_ixpfzz.png" alt="PayPal" className="h-8" />
                <img src="https://res.cloudinary.com/dq3fftsfa/image/upload/v1751122800/gcash-logo_ixpfzz.png" alt="GCash" className="h-8" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Confetti effect for successful payments */}
      <Confetti fire={showConfetti} />
    </>
  );
};

export default PaymentPage;