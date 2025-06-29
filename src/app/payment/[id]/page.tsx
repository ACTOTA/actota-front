'use client'
import Button from '@/src/components/figma/Button'
import Input from '@/src/components/figma/Input'
import ListingCard from '@/src/components/ListingCard'
import PaymentInsuranceCard from '@/src/components/PaymentInsuranceCard'
import PaymentPageCard from '@/src/components/PaymentPageCard'
import SplitPaymentCard from '@/src/components/SplitPaymentCard'
import DateMenuCalendar from '@/src/components/figma/DateMenuCalendar'
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import { FaStar } from 'react-icons/fa6'
import { GoArrowRight } from 'react-icons/go'
import { HiOutlineMail } from 'react-icons/hi'
import { LuRoute, LuUser } from 'react-icons/lu'
import { usePathname, useRouter } from 'next/navigation';
import { IoAlertCircleOutline } from 'react-icons/io5'
import { useItineraryById } from '@/src/hooks/queries/itinerarieById/useItineraryByIdQuery'
import { usePaymentMethods } from '@/src/hooks/queries/account/usePaymentMethodsQuery'
import { useAttachPaymentMethod, useBookingWithPayment } from '@/src/hooks/mutations/payment.mutation'
import StripeCardElement from '@/src/components/stripe/StripeCardElement'
import { getClientSession } from '@/src/lib/session'
import { loadStripe } from '@stripe/stripe-js';
import { setLocalStorageItem } from '@/src/utils/browserStorage'
import toast from 'react-hot-toast'
import { ItineraryData } from '@/src/types/itineraries'
import { PaymentIntent } from '@stripe/stripe-js'

// Type definitions
interface BookingCreateParams {
  user: any;
  itineraryId: string;
  arrivalDatetime: string;
  departureDatetime: string;
  paymentIntentId?: string;
  router: any;
}

interface UserInfo {
  user_id: string;
  customer_id?: string;
  token?: string;
}

interface PaymentMethodOption {
  id: number;
  name: string;
  image: string;
  selected: boolean;
}

interface InsuranceOption {
  id: number;
  name: string;
  price: number;
  image: string;
  selected: boolean;
}

interface CardDetails {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  image: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Helper function to handle error modals
const handlePaymentError = (router: any, error: Error | string, modalType = 'paymentError') => {
  const errorMessage = typeof error === 'string' ? error : error.message || 'An unknown error occurred';
  console.error('Payment error:', errorMessage);

  // Use window.location for more reliable navigation during errors
  window.location.href = `${window.location.pathname}?modal=${modalType}&message=${encodeURIComponent(errorMessage)}`;
};

// Helper function to get the appropriate card brand image
const getCardBrandImage = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return "/svg-icons/visa-logo.svg";
    case 'mastercard':
      return "/svg-icons/mastercard-logo.svg";
    default:
      return "/svg-icons/credit-card.svg"; // Default fallback
  }
};

const Payment = () => {
  const pathname = usePathname() as string;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const { data: apiResponse, isLoading, error } = useItineraryById(objectId);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [showPaymentReview, setShowPaymentReview] = useState(false);
  const user = getClientSession();
  const paymentMethodRef = useRef<HTMLParagraphElement>(null);

  // Add state for arrival and departure dates - these are now read-only from localStorage
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  // Payment method options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption[]>([
    {
      id: 1,
      name: "Card",
      image: "/svg-icons/credit-card.svg",
      selected: true
    },
    {
      id: 2,
      name: "Apple Pay",
      image: "/svg-icons/apple.svg",
      selected: false
    },
    {
      id: 3,
      name: "Google Pay",
      image: "/svg-icons/google.svg",
      selected: false
    },
    {
      id: 4,
      name: "PayPal",
      image: "/svg-icons/paypal.svg",
      selected: false
    }
  ]);

  // State for saved payment methods
  const [savedCards, setSavedCards] = useState<CardDetails[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardHolderName, setCardHolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Insurance options
  const [paymentInsurance, setPaymentInsurance] = useState<InsuranceOption[]>([
    {
      id: 1,
      name: "Travel Insurance",
      price: 59,
      image: "/svg-icons/insurance-shield.svg",
      selected: true
    },
    {
      id: 2,
      name: "Delay Insurance",
      price: 59,
      image: "/svg-icons/insurance-shield2.svg",
      selected: false
    },
    {
      id: 3,
      name: "Free Reschedule Guarantee",
      price: 19,
      image: "/svg-icons/insurance-shield3.svg",
      selected: false
    },
    {
      id: 4,
      name: "100% Refund Guarantee",
      price: 19,
      image: "/svg-icons/insurance-shield4.svg",
      selected: false
    }
  ]);


  // Initialize the mutations
  const { mutate: attachPaymentMethod, isLoading: isPaymentMethodLoading } = useAttachPaymentMethod();
  const { mutate: processBookingWithPayment, isLoading: isBookingWithPaymentLoading } = useBookingWithPayment();

  const cardAddSuccess = (paymentMethodId: string) => {
    console.log('Card added successfully:', paymentMethodId);
    // Immediately select the new card
    setSelectedCard(paymentMethodId);
    // Call the mutation to attach the payment method to the customer
    attachPaymentMethod({
      paymentMethodId,
      setAsDefault: true
    }, {
      onSuccess: () => {
        console.log('Payment method attached successfully');
        // Reset form state
        setCardHolderName('');
        toast.success('Card added successfully!');
      },
      onError: (error) => {
        console.error('Error attaching payment method:', error);
        toast.error('Failed to save card. Please try again.');
      }
    });
  }

  const cardAddError = (error: any) => {
    console.error('Error adding card:', error);
    // You could add a toast notification here
  }

  // Handle card holder name change
  const handleCardHolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardHolderName(e.target.value);
  }

  // Dates are loaded from localStorage and are read-only on this page


  const handleInsuranceToggle = (id: number) => {
    setPaymentInsurance(prevInsurance =>
      prevInsurance.map(insurance =>
        insurance.id === id
          ? { ...insurance, selected: !insurance.selected }
          : insurance
      )
    );
  };


  // Helper function to get trip dates
  const getTripDates = (): { arrival_datetime: string, departure_datetime: string } | null => {
    // First try to use dates from state
    if (arrivalDate && departureDate) {
      return {
        arrival_datetime: arrivalDate.toISOString(),
        departure_datetime: departureDate.toISOString()
      };
    }

    // If not available, try to get from localStorage
    const savedTripDates = localStorage.getItem('tripDates');
    if (savedTripDates) {
      try {
        const parsedDates = JSON.parse(savedTripDates);
        return {
          arrival_datetime: new Date(parsedDates.arrival_datetime).toISOString(),
          departure_datetime: new Date(parsedDates.departure_datetime).toISOString()
        };
      } catch (e) {
        console.error('Error parsing saved dates:', e);
      }
    }

    return null;
  };

  // Helper function to get user information
  const getUserInfo = (): UserInfo => {
    // Check if the user is logged in via session
    const session = getClientSession();
    let userInfo;

    if (session.isLoggedIn && session.user) {
      userInfo = session.user;
      console.log('Using user from session:', JSON.stringify(userInfo, null, 2));
    } else {
      // Fall back to localStorage for compatibility
      userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Using user from localStorage:', JSON.stringify(userInfo, null, 2));
    }

    return userInfo;
  };

  // Main booking confirmation function
  const confirmBooking = async () => {
    try {
      // Add a backup timeout that will clear any stuck processing UI after 30 seconds
      const timeoutId = setTimeout(() => {
        if (window.location.href.includes('modal=processingPayment') ||
            window.location.href.includes('modal=guestCheckoutLoading')) {
          console.error('Payment processing timeout triggered');
          handlePaymentError(router, 'The payment process timed out. Please try again later.', 'bookingFailure');
        }
      }, 30000);

      // Validation checks
      // 1. Payment method selected
      const cardMethodSelected = paymentMethod.some(method => method.selected && method.name === "Card");
      const otherMethodSelected = paymentMethod.some(method => method.selected && method.name !== "Card");
      
      // If Card is selected but no card is chosen, try to create a new payment method first
      if (cardMethodSelected && !selectedCard && !otherMethodSelected) {
        if (!cardHolderName.trim()) {
          toast.error("Please enter a card holder name");
          clearTimeout(timeoutId);
          if (paymentMethodRef.current) {
            paymentMethodRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
        
        // Try to create a payment method first before proceeding
        toast.loading("Creating payment method...");
        // The StripeCardElement should handle this, but we need to trigger it
        // For now, show an error asking user to add card first
        toast.error("Please add your card details first by filling out the card form above");
        clearTimeout(timeoutId);
        if (paymentMethodRef.current) {
          paymentMethodRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      if (!selectedCard && !otherMethodSelected) {
        toast.error("Please add or select a payment method to continue");
        clearTimeout(timeoutId);
        if (paymentMethodRef.current) {
          paymentMethodRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // 2. Date validation
      if (!arrivalDate || !departureDate) {
        toast.error("Please select both arrival and departure dates");
        clearTimeout(timeoutId);
        return;
      }

      // 3. Departure after arrival
      if (departureDate <= arrivalDate) {
        toast.error("Departure date must be after arrival date");
        clearTimeout(timeoutId);
        return;
      }

      // Show loading indicator
      router.push("?modal=guestCheckoutLoading");

      // Save itinerary data to localStorage for reference in modal
      // (This should be replaced with Modal Context in the future)
      localStorage.setItem('itineraryData', JSON.stringify(itineraryData));

      // Get user information
      let userInfo = getUserInfo();

      // If we don't have a customer_id, fetch it now
      if (!userInfo.customer_id && userInfo.user_id) {
        try {
          console.log('No customer_id found, fetching from API...');
          const customerResponse = await fetch(`/account/${userInfo.user_id}/customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({})
          });

          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            if (customerData.customer_id) {
              console.log('Fetched customer_id:', customerData.customer_id);
              userInfo.customer_id = customerData.customer_id;
              localStorage.setItem('user', JSON.stringify(userInfo));
            }
          }
        } catch (error) {
          console.error('Error fetching customer ID:', error);
        }
      }

      if (!userInfo.customer_id) {
        console.warn('No customer_id available, payment may fail');
      }

      // Create a payment intent
      const paymentData = {
        itinerary_id: objectId,
        amount: totalAmount * 100, // Convert to cents
        payment_method_id: selectedCard,
        customer_id: userInfo.customer_id || "TEST",
        user_id: userInfo.user_id,
        description: itineraryData?.trip_name
      };

      console.log('Frontend payment data being sent:', JSON.stringify(paymentData, null, 2));
      console.log('Payment validation details:', {
        totalAmount,
        amountInCents: totalAmount * 100,
        selectedCard,
        customerId: userInfo.customer_id,
        userId: userInfo.user_id,
        tripName: itineraryData?.trip_name
      });

      const response = await fetch('/api/stripe/payment/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      console.log('Payment intent response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent error response:', errorData);
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const paymentIntentData = await response.json();
      const clientSecret = paymentIntentData.client_secret;

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCard!,
      });

      if (confirmError) {
        console.error('Confirm error:', confirmError);
        router.push(`?modal=paymentError&message=${encodeURIComponent(confirmError.message ?? "Unknown error")}`);
        return;
      }

      // Get trip dates
      const tripDates = getTripDates();
      if (!tripDates) {
        throw new Error('Unable to determine trip dates');
      }

      if (paymentIntent.status === 'requires_capture') {
        // Show processing payment modal
        router.replace(pathname);
        router.push("?modal=processingPayment");

        // Store booking attempt data for potential retry
        const bookingAttemptData = {
          itineraryId: objectId,
          paymentIntentId: paymentIntent.id,
          customerId: userInfo.customer_id || "TEST",
          arrivalDatetime: tripDates.arrival_datetime,
          departureDatetime: tripDates.departure_datetime
        };
        localStorage.setItem('lastBookingAttempt', JSON.stringify(bookingAttemptData));

        // Use the new combined booking with payment endpoint
        processBookingWithPayment(bookingAttemptData, {
          onSuccess: (result) => {
            if (result.success) {
              console.log('Booking with payment successful:', result);
              // Store the booking ID for the confirmation modal
              if (result.booking_id) {
                localStorage.setItem('bookingId', JSON.stringify(result.booking_id));
              }
              router.push("?modal=bookingConfirmed");
            } else {
              console.error('Booking with payment failed:', result.error);
              router.push(`?modal=paymentError&message=${encodeURIComponent(result.error || 'Unknown error')}`);
            }
          },
          onError: (error: any) => {
            console.error('Error processing booking with payment:', error);

            // If the error is a 404, show a special message
            if (error.message && error.message.includes('404')) {
              router.push(`?modal=bookingFailure&message=${encodeURIComponent('The booking API endpoint is unavailable (404). Please contact support.')}`);
            } else {
              const errorMessage = error.message || 'An unknown error occurred during payment processing';
              router.push(`?modal=paymentError&message=${encodeURIComponent(errorMessage)}`);
            }
          }
        });
      } else if (paymentIntent.status === 'succeeded') {
        // Payment already succeeded (rare case) - still use the combined endpoint for consistency
        console.log('Payment already succeeded! Creating booking...');

        // Store booking attempt data for potential retry
        const bookingAttemptData2 = {
          itineraryId: objectId,
          paymentIntentId: paymentIntent.id,
          customerId: userInfo.customer_id || "TEST",
          arrivalDatetime: tripDates.arrival_datetime,
          departureDatetime: tripDates.departure_datetime
        };
        localStorage.setItem('lastBookingAttempt', JSON.stringify(bookingAttemptData2));

        processBookingWithPayment(bookingAttemptData2, {
          onSuccess: (result) => {
            if (result.success) {
              console.log('Booking created for already succeeded payment:', result);
              // Store the booking ID for the confirmation modal
              if (result.booking_id) {
                localStorage.setItem('bookingId', JSON.stringify(result.booking_id));
              }
              router.push("?modal=bookingConfirmed");
            } else {
              console.error('Booking creation failed for already succeeded payment:', result.error);
              router.push(`?modal=bookingFailure&message=${encodeURIComponent(result.error || 'Failed to create booking')}`);
            }
          },
          onError: (error: any) => {
            console.error('Error creating booking for already succeeded payment:', error);
            router.push(`?modal=bookingFailure&message=${encodeURIComponent(error.message || 'Failed to create booking')}`);
          }
        });
      } else {
        throw new Error(`Unexpected payment intent status: ${paymentIntent.status}`);
      }
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      handlePaymentError(router, error, 'paymentError');
    }
  };

  // Fetch saved payment methods
  const { data: paymentMethods } = usePaymentMethods();

  useEffect(() => {
    if (apiResponse) {
      console.log('Setting itinerary data:', apiResponse);
      setItineraryData(apiResponse);

      // Load saved trip dates from localStorage
      try {
        const savedTripDates = localStorage.getItem('tripDates');
        console.log('Raw savedTripDates from localStorage:', savedTripDates);
        
        if (savedTripDates) {
          const dateData = JSON.parse(savedTripDates);
          console.log('Parsed date data:', dateData);
          
          const { arrival_datetime, departure_datetime } = dateData;
          
          if (arrival_datetime) {
            const arrivalDate = new Date(arrival_datetime);
            console.log('Parsed arrival date:', arrivalDate, 'isValid:', !isNaN(arrivalDate.getTime()));
            if (!isNaN(arrivalDate.getTime())) {
              setArrivalDate(arrivalDate);
            } else {
              console.error('Invalid arrival date:', arrival_datetime);
            }
          }
          
          if (departure_datetime) {
            const departureDate = new Date(departure_datetime);
            console.log('Parsed departure date:', departureDate, 'isValid:', !isNaN(departureDate.getTime()));
            if (!isNaN(departureDate.getTime())) {
              setDepartureDate(departureDate);
            } else {
              console.error('Invalid departure date:', departure_datetime);
            }
          }
        }
      } catch (e) {
        console.error('Error loading saved trip dates:', e);
      }
    }
  }, [apiResponse]);

  // Helper function to get the appropriate card brand image
  const getCardBrandImage = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return "/svg-icons/visa-logo.svg";
      case 'mastercard':
        return "/svg-icons/mastercard-logo.svg";
      default:
        return "/svg-icons/credit-card.svg"; // Default fallback
    }
  };

  // Helper function to format payment methods
  const formatPaymentMethods = (methods: any[]): CardDetails[] => {
    return methods.map(method => ({
      id: method.id,
      brand: method.card.brand,
      last4: method.card.last4,
      expiryMonth: String(method.card.exp_month).padStart(2, '0'),
      expiryYear: String(method.card.exp_year).slice(-2),
      cardholderName: method.billing_details.name || 'Card Holder',
      image: getCardBrandImage(method.card.brand)
    }));
  };

  // Process payment methods when data is available
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      const formattedCards = formatPaymentMethods(paymentMethods);
      setSavedCards(formattedCards);

      // Select the first card by default
      if (formattedCards.length > 0 && !selectedCard) {
        setSelectedCard(formattedCards[0].id);
      }
    }
  }, [paymentMethods, selectedCard]);

  // Handle selecting a saved card
  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId);
    // Also set paymentMethod to "Card" when a saved card is selected
    setPaymentMethod(paymentMethod.map(method => ({
      ...method,
      selected: method.name === "Card"
    })));
  };

  const basePrice = itineraryData?.person_cost ? itineraryData.person_cost * (itineraryData?.min_group || 1) : 0;
  const selectedInsurance = paymentInsurance
    .filter(insurance => insurance.selected)
    .reduce((total, insurance) => total + insurance.price, 0);
  const totalAmount = basePrice + selectedInsurance;


  if (isLoading) {
    return <div className='text-white flex justify-center items-center h-screen'>Loading...</div>;

  }

  if (error) {
    console.error('Error details:', error);
    return <div className='text-white flex justify-center items-center h-screen'>{user ? 'Error: ' + error.message : 'Please login to view itinerary details'}</div>;
  }

  if (!itineraryData) {
    return <div className='text-white flex justify-center items-center h-screen'>Loading itinerary data...</div>;
  }

  return (
    <section className='min-h-screen bg-[#0A0A0A] text-white'>
      <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-0'>

        {/* left side - main content */}
        <div className={`lg:col-span-2 flex flex-col gap-6 p-6 lg:p-12 pt-20 lg:pt-28 ${showPaymentReview ? 'max-lg:hidden' : ''}`}>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2'>
            <ArrowLeftIcon onClick={() => router.back()} className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <p className='text-gray-400 text-sm'>Itineraries / {itineraryData.trip_name} / <span className='text-white'>Confirm Reservation</span></p>
          </div>
          
          {/* Page Title */}
          <h1 className='text-3xl lg:text-4xl font-bold'>Confirm your Reservation</h1>
          
          {/* Trip Summary Card */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-gray-800 p-6'>
            <PaymentPageCard itineraryData={itineraryData} />
          </div>

          {/* Date Selection Section - Read Only */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Trip Dates</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Arrival Date - Read Only */}
              <div className='relative'>
                <label className='text-gray-400 text-sm block mb-2'>Arrival Date</label>
                <div className='w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 flex items-center gap-3'>
                  <CalendarIcon className='h-5 w-5 text-gray-400' />
                  <span className='text-white'>
                    {arrivalDate ? arrivalDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'No date selected'}
                  </span>
                </div>
              </div>

              {/* Departure Date - Read Only */}
              <div className='relative'>
                <label className='text-gray-400 text-sm block mb-2'>Departure Date</label>
                <div className='w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 flex items-center gap-3'>
                  <CalendarIcon className='h-5 w-5 text-gray-400' />
                  <span className='text-white'>
                    {departureDate ? departureDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'No date selected'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Display trip duration if both dates are selected */}
            {arrivalDate && departureDate && (
              <div className='bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3'>
                <CalendarIcon className='h-5 w-5 text-blue-400' />
                <span className='text-sm text-blue-300'>
                  Trip Duration: {Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            )}
          </div>

          {/* Insurance Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Insurance Options</h2>
            <div className="space-y-3">
              {paymentInsurance.map((insurance) => (
                <div
                  key={insurance.id}
                  className={`bg-[#1A1A1A] rounded-xl border ${insurance.selected ? 'border-[#BBD4FB]' : 'border-gray-800'} transition-all duration-200`}
                >
                  <PaymentInsuranceCard
                    insurance={insurance}
                    onToggleSelect={handleInsuranceToggle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Trip Members Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Trip Members</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Guest 1 */}
              <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <LuUser className='text-gray-400 h-5 w-5' />
                    <p className='font-medium'>Guest 1</p>
                  </div>
                  <span className='bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full'>Trip Leader</span>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                    <Input type="text" name="fullName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Email Address</label>
                    <Input type="email" name="email" icon={<HiOutlineMail className="text-gray-400 h-5 w-5" />} placeholder="Enter email address" />
                  </div>
                </div>
              </div>
              
              {/* Guest 2 */}
              <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6 space-y-4'>
                <div className='flex items-center gap-2'>
                  <LuUser className='text-gray-400 h-5 w-5' />
                  <p className='font-medium'>Guest 2</p>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                    <Input type="text" name="fullName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Email Address</label>
                    <Input type="email" name="email" icon={<HiOutlineMail className="text-gray-400 h-5 w-5" />} placeholder="Enter email address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Payment Method Section */}
          <div className='space-y-4' ref={paymentMethodRef}>
            <h2 className='text-2xl font-bold'>Payment Method</h2>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
              {paymentMethod.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPaymentMethod(paymentMethod.map(method => ({ ...method, selected: method.id === item.id })))}
                  className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:border-gray-600 ${
                    item.selected 
                      ? 'bg-[#1A1A1A] border-[#BBD4FB] shadow-[0_0_20px_rgba(187,212,251,0.2)]' 
                      : 'bg-[#1A1A1A] border-gray-800'
                  }`}
                >
                  <Image src={item.image} alt={item.name} width={24} height={24} className='opacity-80' />
                  <p className='text-sm font-medium'>{item.name}</p>
                  {item.selected && (
                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#BBD4FB] rounded-full' />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Payment Cards Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Add New Card */}
            <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6'>
              <h3 className='text-lg font-semibold flex items-center gap-2 mb-4'>
                <Image src={"/svg-icons/atm-card.svg"} alt="add card" width={20} height={20} className='opacity-80' />
                Add a new card
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Card Holder Name</label>
                  <Input
                    type="text"
                    name="cardHolderName"
                    value={cardHolderName}
                    onChange={handleCardHolderNameChange}
                    placeholder="Enter cardholder name"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Card Details</label>
                  <StripeCardElement
                    onSuccess={cardAddSuccess}
                    onError={cardAddError}
                    setAsDefault={true}
                    cardHolderName={cardHolderName}
                    isSubmitting={isPaymentMethodLoading}
                    setIsSubmitting={setIsSubmitting}
                  />
                </div>
              </div>
            </div>
            
            {/* Saved Cards */}
            <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6'>
              <h3 className='text-lg font-semibold flex items-center gap-2 mb-4'>
                <Image src={"/svg-icons/atm-card.svg"} alt="saved cards" width={20} height={20} className='opacity-80' />
                My Saved Cards
              </h3>
              {savedCards.length > 0 ? (
                <div className='space-y-3'>
                  {savedCards.map((card) => (
                    <label
                      key={card.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedCard === card.id
                          ? 'bg-[#262626] border-[#BBD4FB]'
                          : 'bg-[#0A0A0A] border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <Image src={card.image} alt={card.brand} width={40} height={24} className='opacity-90' />
                        <div>
                          <p className='font-medium'>•••• •••• •••• {card.last4}</p>
                          <p className='text-gray-400 text-sm'>Expires {card.expiryMonth}/{card.expiryYear}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="savedCard"
                        className='h-4 w-4 accent-[#BBD4FB]'
                        checked={selectedCard === card.id}
                        onChange={() => handleSelectCard(card.id)}
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 text-center py-8'>No saved cards yet</p>
              )}
            </div>
          </div>
          {/* Split Payment Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Split Payment</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-[#1A1A1A] rounded-xl border border-gray-800'>
                <SplitPaymentCard name="Payment Split 1" />
              </div>
              <div className='bg-[#1A1A1A] rounded-xl border border-gray-800'>
                <SplitPaymentCard name="Payment Split 2" />
              </div>
            </div>
          </div>
          {/* Billing Details Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Billing Details</h2>
            <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                    <Input type="text" name="billingName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Billing Address</label>
                    <Input type="text" name="billingAddress" placeholder="Street address" />
                  </div>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">City</label>
                    <Input type="text" name="billingCity" placeholder="Enter city" />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">State</label>
                      <Input type="text" name="billingState" placeholder="State" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">Zip Code</label>
                      <Input type="text" name="billingZip" placeholder="Zip" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Message Guide Section */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold'>Message your Guide</h2>
              <span className='text-gray-400 text-sm'>Optional</span>
            </div>
            <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6'>
              <div className='flex gap-4'>
                <Image 
                  src={"/images/logo.png"} 
                  alt="guide" 
                  className='rounded-full border border-gray-700 h-12 w-12' 
                  width={48} 
                  height={48} 
                />
                <div className='flex-1 space-y-3'>
                  <div>
                    <p className='font-semibold'>Jennie L.</p>
                    <p className='text-gray-400 text-sm flex items-center gap-2'>
                      7 years guiding
                      <span className='flex items-center gap-1'>
                        <FaStar className='text-yellow-500' />
                        4.5 (100)
                      </span>
                    </p>
                  </div>
                  <textarea 
                    placeholder='Send a message to your guide...' 
                    className='w-full bg-[#0A0A0A] text-white h-24 border border-gray-800 rounded-xl p-4 resize-none focus:border-gray-600 focus:outline-none transition-colors' 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Cancellation Policy</h2>
            <div className='bg-[#1A1A1A] rounded-xl border border-gray-800 p-6 space-y-3'>
              <p className='text-gray-300'>Free cancellation for the first 72 hours after payment is confirmed.</p>
              <p className='text-gray-300'>Cancel before August 20 for a partial refund.</p>
              <p className='text-gray-300'>Your reservation won&apos;t be confirmed until an Agent or Guide accepts your request (typically within 24 hours).</p>
              <button className="flex items-center gap-1 text-[#BBD4FB] hover:text-white transition-colors">
                <span>Learn more</span>
                <CgArrowTopRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>

          </div>

          <div>

          </div>

        </div>

        {/* right side - payment sidebar */}
        <div className={`lg:col-span-1 bg-[#1A1A1A] border-l border-gray-800 ${showPaymentReview ? '' : 'max-lg:hidden'}`}>
          <div className='sticky top-20 p-6 lg:p-8 space-y-6'>
            {/* Mobile back button */}
            <button 
              onClick={() => setShowPaymentReview(false)} 
              className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors lg:hidden'
            >
              <ArrowLeftIcon className='h-4 w-4' />
              <span className='text-sm'>Back to details</span>
            </button>
            
            {/* Total Amount */}
            <div className='text-center space-y-2'>
              <p className='text-gray-400 text-sm'>Total amount</p>
              <p className='text-5xl font-bold'>
                <span className='text-gray-400 text-3xl'>$</span>{totalAmount}
              </p>
            </div>

            {/* Promo Code */}
            <div className='space-y-2'>
              <label className='text-gray-400 text-sm'>Promo Code</label>
              <Input 
                placeholder='Enter promo code' 
                icon={<Image src={"/svg-icons/promo-code.svg"} alt='promo' width={16} height={16} className='opacity-60' />} 
              />
              <p className='text-[#BBD4FB] text-sm'>You saved $45 on this booking!</p>
            </div>
            {/* Payment Details */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Payment Details</h3>
              
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Base Cost (${itineraryData.person_cost} × {itineraryData.min_group} guests)</span>
                  <span>${basePrice}</span>
                </div>
                {itineraryData.activity_cost > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Activity Cost</span>
                    <span>${itineraryData.activity_cost}</span>
                  </div>
                )}
                {itineraryData.lodging_cost > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Lodging Cost</span>
                    <span>${itineraryData.lodging_cost}</span>
                  </div>
                )}
                {itineraryData.transport_cost > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Transport Cost</span>
                    <span>${itineraryData.transport_cost}</span>
                  </div>
                )}
                {itineraryData.service_fee > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Service Fee</span>
                    <span>${itineraryData.service_fee}</span>
                  </div>
                )}
                {paymentInsurance.filter(insurance => insurance.selected).map(insurance => (
                  <div key={insurance.id} className='flex justify-between'>
                    <span className='text-gray-400'>{insurance.name}</span>
                    <span>${insurance.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="h-px bg-gray-800" />
              
              <div className='flex justify-between text-base font-semibold'>
                <span>Total Amount</span>
                <span className='text-xl'>${totalAmount}</span>
              </div>
            </div>

            {/* Payment Button */}
            {user ? (
              <Button 
                onClick={() => confirmBooking()} 
                variant="primary" 
                className="w-full gap-2"
              >
                Pay ${totalAmount}
                <GoArrowRight className='h-5 w-5' />
              </Button>
            ) : (
              <Button 
                onClick={() => router.push("?modal=guestCheckout")} 
                variant="outline" 
                className="w-full gap-2"
              >
                Checkout as Guest
                <GoArrowRight className='h-5 w-5' />
              </Button>
            )}






            {!user && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="h-px bg-gray-800 flex-1" />
                  <span className='text-gray-400 text-sm'>or</span>
                  <div className="h-px bg-gray-800 flex-1" />
                </div>
                
                {/* Sign In Section */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Sign in or Create Account</h3>
                  
                  <div className='bg-[#262626] border border-[#BBD4FB]/30 rounded-xl p-4 space-y-2'>
                    <div className='flex gap-3'>
                      <Image src={"/svg-icons/gift-box.svg"} alt="benefits" width={24} height={24} className='opacity-80' />
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>Log in for seamless booking</p>
                        <p className='text-gray-400 text-xs'>Earn points and save up to 50%!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-2'>
                    <label className="text-gray-400 text-sm">Email Address</label>
                    <Input 
                      type="email" 
                      name="email" 
                      icon={<HiOutlineMail className="text-gray-400 h-5 w-5" />} 
                      placeholder="Enter your email" 
                    />
                  </div>
                  
                  <Button 
                    onClick={() => router.push("?modal=signin")} 
                    variant="primary" 
                    className="w-full"
                  >
                    Continue
                  </Button>
                  
                  {/* Social Login */}
                  <div className='space-y-3'>
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gray-800 flex-1" />
                      <span className='text-gray-400 text-xs'>or continue with</span>
                      <div className="h-px bg-gray-800 flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button className='bg-[#262626] hover:bg-[#363636] rounded-lg py-3 flex justify-center items-center transition-colors'>
                        <Image src="/svg-icons/google.svg" alt="google" width={20} height={20} />
                      </button>
                      <button className='bg-[#262626] hover:bg-[#363636] rounded-lg py-3 flex justify-center items-center transition-colors'>
                        <Image src="/svg-icons/apple.svg" alt="apple" width={20} height={20} />
                      </button>
                      <button className='bg-[#262626] hover:bg-[#363636] rounded-lg py-3 flex justify-center items-center transition-colors'>
                        <Image src="/svg-icons/facebook.svg" alt="facebook" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm">
                    <Link href="/auth/signup" className="text-[#BBD4FB] hover:text-white transition-colors">
                      Trouble signing in?
                    </Link>
                  </p>
                </div>
              </>
            )}




            {/* Terms */}
            <p className="text-gray-400 text-xs text-center">
              By confirming your reservation, you agree to ACTOTA&apos;s{' '}
              <Link href="/terms" className="text-[#BBD4FB] hover:text-white transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#BBD4FB] hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        {/* Mobile Bottom Bar */}
        {!showPaymentReview && (
          <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-800 z-10 px-6 py-4'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-gray-400 text-sm flex items-center gap-1'>
                  Total <IoAlertCircleOutline className='h-4 w-4' />
                </p>
                <p className='text-2xl font-bold'>${totalAmount}</p>
              </div>
              <Button 
                onClick={() => setShowPaymentReview(true)} 
                variant='primary' 
                size='md'
                className='gap-2'
              >
                Review
                <ArrowRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Payment
