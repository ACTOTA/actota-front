"use client";
import React, { useEffect, useState } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { MdOutlineAddCard } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import TrashIcon from "@/public/svg-icons/trash.svg";
import { RiVisaLine } from "react-icons/ri";
import Dropdown from "../../figma/Dropdown";
import { useRouter } from "next/navigation";
import { usePaymentMethods } from "@/src/hooks/queries/account/usePaymentMethodsQuery";
import { useAttachPaymentMethod } from "@/src/hooks/mutations/payment.mutation";
import StripeCardElement from "../../stripe/StripeCardElement";
import { getClientSession } from "@/src/lib/session";


interface Card {
  id: string | number;
  cardType: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
  cardHolderName?: string;
}

interface CardFormData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  setAsDefault: boolean;
}

const Payment = () => {
  const router = useRouter();
  // Check URL for active tab parameter on component mount
  const getInitialActiveTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('activeTab') || "bookingsHistory";
    }
    return "bookingsHistory";
  };

  const user = getClientSession().user;
  const [activeTab, setActiveTab] = useState(getInitialActiveTab);
  const [search, setSearch] = useState("");

  const { data: paymentMethods } = usePaymentMethods();
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: attachPaymentMethod } = useAttachPaymentMethod();

  // Convert payment methods data to card format when data is available
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      const formattedCards: Card[] = paymentMethods.map((method: any, index: number) => ({
        id: method.id,
        cardType: method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1), // Capitalize brand name
        cardNumber: `**** **** **** ${method.card.last4}`,
        expiryDate: `${String(method.card.exp_month).padStart(2, '0')}/${String(method.card.exp_year).slice(-2)}`,
        cvv: "***",
        isDefault: index === 0, // Set first card as default
        cardHolderName: method.billing_details.name || 'Card Holder'
      }));

      setSavedCards(formattedCards);
    }
  }, [paymentMethods]);

  const [addNewCard, setAddNewCard] = useState(false);
  const [cardFormData, setCardFormData] = useState<CardFormData>({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    setAsDefault: false
  });
  const [cardErrors, setCardErrors] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Define types for charges and refunds
  interface ChargeItem {
    id: string;
    purchase: string;
    bookingId?: string;
    transactionDate: string;
    paymentDate: string;
    amount: string;
    status: string;
  }
  
  interface RefundItem {
    id: string;
    bookingId?: string;
    refundDate: string;
    originalAmount: string;
    refundAmount: string;
    reason: string;
    status: string;
  }
  
  const [purchaseHistory, setPurchaseHistory] = useState<ChargeItem[]>([]);
  const [refundsHistory, setRefundsHistory] = useState<RefundItem[]>([]);

  useEffect(() => {
    // Skip the fetch if user ID is not available
    if (!user?.user_id) return;

    const fetchTransactions = async () => {
      try {
        const userId = user.user_id;
        console.log("Fetching transactions for user ID:", userId);
        
        // Match the exact pattern of your working request
        // Use the API client from the same place used in the route handlers
        const apiClient = (await import("@/src/lib/apiClient")).default;
        const response = await apiClient.get(`/account/${userId}/transactions`, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        console.log("Raw response:", response.data);
        
        if (response.status < 200 || response.status >= 300) {
          console.error("Response not OK:", response.status, response.data);
          throw new Error(`HTTP error! Status: ${response.status}, Response: ${JSON.stringify(response.data)}`);
        }

        const data = response.data;
        console.log("Transactions data:", data);
        
        if (data && data.data) {
          // Handle Stripe charges data structure
          const stripeCharges = data.data;
          
          // Define types for charges and refunds
          interface ChargeItem {
            id: string;
            purchase: string;
            bookingId?: string;
            transactionDate: string;
            paymentDate: string;
            amount: string;
            status: string;
          }
          
          interface RefundItem {
            id: string;
            bookingId?: string;
            refundDate: string;
            originalAmount: string;
            refundAmount: string;
            reason: string;
            status: string;
          }
          
          // Separate charges and refunds with proper types
          const charges: ChargeItem[] = [];
          const refunds: RefundItem[] = [];
          
          stripeCharges.forEach((item: any) => {
            if (item.transaction_type === 'refund') {
              // This is a refund
              refunds.push({
                id: item.id,
                bookingId: item.booking_id || item.metadata?.booking_id || item.charge,
                refundDate: new Date(item.created * 1000).toLocaleDateString(),
                originalAmount: `$${((item.charge_details?.amount || item.amount) / 100).toFixed(2)}`,
                refundAmount: `$${(item.amount / 100).toFixed(2)}`,
                reason: item.reason === 'expired_uncaptured_charge' ? 'Expired Authorization' : item.reason || 'Cancellation',
                status: item.status
              });
            } else if (item.transaction_type === 'charge') {
              // This is a charge
              charges.push({
                id: item.id,
                purchase: item.description || "Vacation",
                bookingId: item.booking_id || item.metadata?.booking_id,
                transactionDate: new Date(item.created * 1000).toLocaleDateString(),
                paymentDate: new Date(item.created * 1000).toLocaleDateString(),
                amount: `$${(item.amount / 100).toFixed(2)}`,
                status: item.status === "succeeded" ? "paid" : item.status
              });
            }
          });
          
          console.log("Formatted transactions:", charges);
          console.log("Formatted refunds:", refunds);
          setPurchaseHistory(charges);
          setRefundsHistory(refunds);
        } else {
          console.error("Invalid data format received:", data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();

  }, [user?.user_id]);

  const tabs = [
    {
      id: "bookingsHistory",
      label: "Bookings History",
      component: <>121</>,
    },
    {
      id: "paymentMethods",
      label: "Payment Methods",
      component: <>Payment Methods</>,
    },
    {
      id: "refunds",
      label: "Refunds",
      component: <>Refunds</>,
    },
  ];

  // Helper function to get the appropriate card brand image
  const getCardBrandImage = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return "/svg-icons/visa-logo.svg";
      case 'mastercard':
        return "/svg-icons/mastercard-logo.svg";
      case 'amex':
        return "/svg-icons/amex-logo.svg"; // If you have this asset
      case 'discover':
        return "/svg-icons/discover-logo.svg"; // If you have this asset
      default:
        return "/svg-icons/credit-card.svg"; // Default fallback
    }
  };

  // Validation function for card details
  const validateCardForm = () => {
    let tempErrors = {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
    let isValid = true;

    if (!cardFormData.cardHolderName) {
      tempErrors.cardHolderName = 'Card holder name is required';
      isValid = false;
    }

    if (!cardFormData.cardNumber) {
      tempErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardFormData.cardNumber.replace(/\s/g, ''))) {
      tempErrors.cardNumber = 'Invalid card number';
      isValid = false;
    }

    if (!cardFormData.expiryDate) {
      tempErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardFormData.expiryDate)) {
      tempErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      isValid = false;
    }

    if (!cardFormData.cvv) {
      tempErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardFormData.cvv)) {
      tempErrors.cvv = 'Invalid CVV';
      isValid = false;
    }

    setCardErrors(tempErrors);
    return isValid;
  };

  // Handle input changes for card form
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCardFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const navigateToBooking = (id: string) => {
    console.log("ID: ", id);
    router.push(`/bookings/${id}`);
  }
  
  const handleDeleteCard = (cardId: string | number) => {
    // Preserve the current tab state when opening the modal
    const query = new URLSearchParams(window.location.search);
    query.set('modal', 'deletePaymentCard');
    query.set('paymentMethodId', cardId.toString());
    query.set('activeTab', 'paymentMethods'); // Set or preserve the active tab
    router.push(`?${query.toString()}`);
  };

  // Set card as default
  const handleSetDefaultCard = (cardId: string | number) => {
    setSavedCards(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    // In a real implementation, you would also make an API call to update the default payment method
  };

  // Function to format and mask card number for display
  const formatCardNumberForDisplay = (cardNumber: string) => {
    if (cardNumber.includes('****')) {
      return cardNumber; // Already masked
    }

    const last4 = cardNumber.replace(/\s+/g, '').slice(-4);
    return `**** **** **** ${last4}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl">Payments</div>
        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="outline"
                size="sm"
                className={
                  activeTab === tab.id
                    ? "!border-white !text-white"
                    : "!border-border-primary !text-border-primary"
                }
                onClick={() => {
                  setActiveTab(tab.id);
                  // Update URL to reflect tab change without full navigation
                  const query = new URLSearchParams(window.location.search);
                  query.set('activeTab', tab.id);
                  const newUrl = `${window.location.pathname}?${query.toString()}`;
                  window.history.pushState({ path: newUrl }, '', newUrl);
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* body section */}
      <div>
        {activeTab === "bookingsHistory" ?
          <div className="mb-4">
            <p className="font-bold text-2xl mb-8">Purchase History ({purchaseHistory.length})</p>

            <div className="mb-4 flex gap-2">
              <div className="w-full">
                <Input
                  placeholder="Select Your Bookings"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  icon={<FiSearch className="w-5 h-5" />}
                  className="px-3 py-2.5 "
                />
              </div>
              <div className="inline-flex">
                <Dropdown
                  options={["Newest", "Oldest"]}
                  onSelect={() => { }}
                  className="border-none !bg-[#141414]"
                  placeholder="Newest"
                />
              </div>
            </div>

            <table className="w-full overflow-auto text-white text-sm ">
              <thead className="text-primary-gray font-normal text-left ">
                <tr>
                  <th className="py-5">Purchase </th>
                  <th className="py-5">Transaction Date</th>
                  <th className="py-5">Amount</th>
                  <th className="py-5 text-center">Status</th>
                </tr>
              </thead>

              <tbody className="w-full ">
                {purchaseHistory.map((item: any, i) => (
                  <React.Fragment key={i}>
                    <tr className="w-full">
                      <td colSpan={5}>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent" />
                      </td>
                    </tr>
                    <tr key={i} className="w-full cursor-pointer" onClick={() => navigateToBooking(item.bookingId)}>
                      <td className="py-5">
                        <p className="text-white text-sm">{item.purchase}   </p>
                      </td>
                      <td className="py-5">{item.transactionDate}</td>
                      <td className="py-5">{item.amount}</td>
                      <td className="py-5 text-center ">
                        <Button variant="primary" size="sm" className={`mx-auto ${item.status === "paid" ? "!bg-[#215CBA]" : "!bg-[#FFC107]"} text-white`}>{item.status === "paid" ? "Paid" : "Pending"}</Button>
                      </td>
                    </tr>
                  </React.Fragment>

                ))}
              </tbody>
            </table>
          </div> : activeTab === "paymentMethods" ? (
          <div>
            <p className="font-bold text-2xl mb-8">Saved Cards {savedCards.length > 0 && `(${savedCards.length})`}</p>

            {savedCards.length > 0 ? (
              savedCards.map((item) => (
                <div key={item.id} className="">
                  <div className="flex items-center justify-between bg-[#666666]/10 rounded-2xl border max-sm:border-none border-primary-gray p-4 mb-2">
                    <div className="text-white text-xl font-bold flex items-center max-sm:flex-col max-sm:items-start justify-start gap-2">
                      <div className="flex items-center justify-center max-sm:justify-start sm:bg-black rounded-lg sm:h-[50px] w-[80px] max-sm:w-full">
                        <Image src={getCardBrandImage(item.cardType)} alt={item.cardType} height={24} width={38} />
                      </div>

                      <div className="gap-1">
                        <p className="text-white font-bold">{formatCardNumberForDisplay(item.cardNumber)}</p>
                        <p className="text-primary-gray text-sm"> Exp. Date <span className="text-white">{item.expiryDate}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center max-sm:flex-col max-sm:items-end gap-2">
                      {item.isDefault ?
                        <Button variant="primary" size="sm" className={`mx-auto !bg-[#215CBA] !text-white`}>Default</Button> :
                        <Button
                          variant="simple"
                          size="sm"
                          className={`!p-0 !text-[#BBD4FB] border-b border-[#BBD4FB] !rounded-none`}
                          onClick={() => handleSetDefaultCard(item.id)}
                        >
                          Set as default
                        </Button>
                      }
                      <button onClick={() => handleDeleteCard(item.id)}>
                        <TrashIcon className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-primary-gray">
                <p>No saved cards found.</p>
                <p className="mt-2">Add a new card to get started.</p>
              </div>
            )}

            {!addNewCard && (
              <div className="flex justify-end w-full items-end mt-8">
                <Button variant="primary" size="md" onClick={() => setAddNewCard(true)}>Add New Card</Button>
              </div>
            )}
            {addNewCard && (
              <div className='flex gap-2 mt-8 w-full'>
                <div className='sm:flex-1 flex flex-col gap-2 max-sm:w-full'>
                  <div className="flex items-center justify-between">
                    <p className='text-white text-xl font-bold flex items-center gap-2'>
                      <MdOutlineAddCard className="text-white size-6" /> Add a new card
                    </p>
                    <RxCross1
                      className="text-white size-5 cursor-pointer"
                      onClick={() => setAddNewCard(false)}
                    />
                  </div>
                  <div>
                    <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Holder Name</p>
                    <Input
                      type="text"
                      name="cardHolderName"
                      value={cardFormData.cardHolderName}
                      onChange={handleCardInputChange}
                      placeholder="Card Holder Name"
                      className={cardErrors.cardHolderName ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
                    />
                    {cardErrors.cardHolderName && (
                      <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                        {cardErrors.cardHolderName}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-[10px]">
                    <input
                      type="checkbox"
                      name="setAsDefault"
                      checked={cardFormData.setAsDefault}
                      onChange={handleCardInputChange}
                      className="w-5 h-5 rounded-[4px] outline-none ring-0 focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-primary-gray text-sm">Set as default</p>
                  </div>

                  {/* Stripe Card Element */}
                  <StripeCardElement
                    onSuccess={(paymentMethodId) => {
                      // Call the mutation to attach the payment method to customer
                      attachPaymentMethod({
                        paymentMethodId,
                        setAsDefault: cardFormData.setAsDefault
                      });
                      // Close the form
                      setAddNewCard(false);
                    }}
                    onError={(error) => {
                      console.error("Stripe error:", error);
                      // Handle error (could set an error state here)
                    }}
                    setAsDefault={cardFormData.setAsDefault}
                    cardHolderName={cardFormData.cardHolderName}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </div>
                <div className="flex-1 max-sm:hidden" />
              </div>
            )}
          </div>
          ) : activeTab === "refunds" ? (
          <div className="mb-4">
            <p className="font-bold text-2xl mb-8">Refund History ({refundsHistory.length})</p>

            <div className="mb-4 flex gap-2">
              <div className="w-full">
                <Input
                  placeholder="Search refunds"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  icon={<FiSearch className="w-5 h-5" />}
                  className="px-3 py-2.5 "
                />
              </div>
              <div className="inline-flex">
                <Dropdown
                  options={["Newest", "Oldest"]}
                  onSelect={() => { }}
                  className="border-none !bg-[#141414]"
                  placeholder="Newest"
                />
              </div>
            </div>

            {refundsHistory.length > 0 ? (
              <table className="w-full overflow-auto text-white text-sm ">
                <thead className="text-primary-gray font-normal text-left ">
                  <tr>
                    <th className="py-5">Booking ID</th>
                    <th className="py-5">Refund Date</th>
                    <th className="py-5">Original Amount</th>
                    <th className="py-5">Refund Amount</th>
                    <th className="py-5">Reason</th>
                    <th className="py-5 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="w-full ">
                  {refundsHistory.map((item: any, i) => (
                    <React.Fragment key={i}>
                      <tr className="w-full">
                        <td colSpan={6}>
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent" />
                        </td>
                      </tr>
                      <tr key={i} className="w-full cursor-pointer" onClick={() => item.bookingId && navigateToBooking(item.bookingId)}>
                        <td className="py-5">
                          <p className="text-white text-sm">{item.bookingId ? item.bookingId.slice(-8) : '-'}</p>
                        </td>
                        <td className="py-5">{item.refundDate}</td>
                        <td className="py-5">{item.originalAmount}</td>
                        <td className="py-5 text-green-400">{item.refundAmount}</td>
                        <td className="py-5">{item.reason}</td>
                        <td className="py-5 text-center ">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className={`mx-auto ${
                              item.status === "succeeded" ? "!bg-green-600" : 
                              item.status === "pending" ? "!bg-[#FFC107]" : 
                              item.status === "failed" ? "!bg-red-600" : 
                              "!bg-[#215CBA]"
                            } text-white`}
                          >
                            {item.status === "succeeded" ? "Refunded" : 
                             item.status === "pending" ? "Processing" : 
                             item.status === "failed" ? "Failed" : 
                             item.status}
                          </Button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-primary-gray">
                <p>No refunds found.</p>
                <p className="mt-2">Your refund history will appear here.</p>
              </div>
            )}
          </div>
          ) : (
          null
          )}
      </div>
    </div>
  );
};

export default Payment;
