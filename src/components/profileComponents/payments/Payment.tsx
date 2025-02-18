"use client";
import React, { useState } from "react";
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

interface Card {
  id: number;
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
  const [activeTab, setActiveTab] = useState("bookingsHistory");
  const [search, setSearch] = useState("");
  const [savedCards, setSavedCards] = useState<Card[]>([
    {
      id: 1,
      cardType: "Visa",
      cardNumber: "1234567890123456",
      expiryDate: "01/25",
      cvv: "123",
      isDefault: true,
    },
    {
      id: 2,
      cardType: "MasterCard",
      cardNumber: "1234567890123456",
      expiryDate: "01/25",
      cvv: "123",
      isDefault: false,
    },
  ]);
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
  const [purchaseHistory, setPurchaseHistory] = useState([
    {
      id: 1,
      purchase: "Denver 6 Days Trip",
      transactionId: "09187-2344422092",
      transactionDate: "Jun 21, 2024",
      paymentDate: "Jun 21, 2024",
      amount: "$100",
      status: "paid",
    },
    {
      id: 2,
      purchase: "Denver 6 Days Trip",
      transactionId: "09187-2344422092",
      transactionDate: "Jun 21, 2024",
      paymentDate: "Jun 21, 2024",
      amount: "$100",
      status: "pending",
    },
    {
      id: 3,
      purchase: "Denver 6 Days Trip",
      transactionId: "09187-2344422092",
      transactionDate: "Jun 21, 2024",
      paymentDate: "Jun 21, 2024",
      amount: "$100",
      status: "paid",
    }
  ]);
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
  ];

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

  // Handle card number input with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  // Add new card
  const handleAddCard = () => {
    if (!validateCardForm()) {
      return;
    }

    const newCard: Card = {
      id: Date.now(),
      cardType: cardFormData.cardNumber.startsWith('4') ? 'Visa' : 'MasterCard',
      cardNumber: cardFormData.cardNumber,
      expiryDate: cardFormData.expiryDate,
      cvv: cardFormData.cvv,
      cardHolderName: cardFormData.cardHolderName,
      isDefault: cardFormData.setAsDefault
    };

    setSavedCards(prev => {
      let newCards = [...prev];
      if (cardFormData.setAsDefault) {
        newCards = newCards.map(card => ({ ...card, isDefault: false }));
      }
      return [...newCards, newCard];
    });

    setAddNewCard(false);
    setCardFormData({
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      setAsDefault: false
    });
  };

  // Delete card
  const handleDeleteCard = (cardId: number) => {
    router.push("?modal=deletePaymentCard");
    // setSavedCards(prev => {
    //   const deletedCard = prev.find(card => card.id === cardId);
    //   const remainingCards = prev.filter(card => card.id !== cardId);

    //   // If deleted card was default, set first remaining card as default
    //   if (deletedCard?.isDefault && remainingCards.length > 0) {
    //     remainingCards[0].isDefault = true;
    //   }

    //   return remainingCards;
    // });
  };

  // Set card as default
  const handleSetDefaultCard = (cardId: number) => {
    setSavedCards(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
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
                onClick={() => setActiveTab(tab.id)}
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
            <p className="font-bold text-2xl mb-8">Purchase History(23)</p>

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

            <table className="w-full  text-white text-sm ">
              <thead className="text-primary-gray font-normal text-left ">
                <tr>
                  <th className="py-5">Purchase </th>
                  <th className="py-5">Transaction Date</th>
                  <th className="py-5">Payment Date</th>
                  <th className="py-5">Amount</th>
                  <th className="py-5 text-center">Status</th>
                </tr>
              </thead>

              <tbody className="w-full ">
                {purchaseHistory.map((item) => (
                  <>
                    <tr className="w-full">
                      <td colSpan={5}>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent" />
                      </td>
                    </tr>
                    <tr key={item.id} className="w-full">
                      <td className="py-5">
                        <p className="text-white text-sm">{item.purchase}   </p>
                        <p className="text-primary-gray text-xs">{item.transactionId}</p>
                      </td>
                      <td className="py-5">{item.transactionDate} <span className="text-xs text-primary-gray">08.15</span></td>
                      <td className="py-5">{item.paymentDate} <span className="text-xs text-primary-gray">08.15</span></td>
                      <td className="py-5">{item.amount}</td>
                      <td className="py-5 text-center ">
                        <Button variant="primary" size="sm" className={`mx-auto ${item.status === "paid" ? "!bg-[#215CBA]" : "!bg-[#FFC107]"} text-white`}>{item.status === "paid" ? "Paid" : "Pending"}</Button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div> :
          <div>
            <p className="font-bold text-2xl mb-8">Saved Cards</p>

            {savedCards.map((item) => (
              <div key={item.id} className="">
                <div className="flex items-center justify-between bg-[#666666]/10 rounded-2xl border border-primary-gray p-4 mb-2">
                  <div className="text-white text-xl font-bold flex items-center gap-2">
                    <div className="flex items-center justify-center bg-black rounded-lg h-[50px] w-[80px]">
                      <Image src={item.cardType === "Visa" ? "/svg-icons/visa-logo.svg" : "/svg-icons/mastercard-logo.svg"} alt="card" height={24} width={38} />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold">{item.cardNumber}</span>
                      <span className="text-primary-gray text-sm"> Exp. Date  <span className="text-white"> {item.expiryDate}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
            ))}
            {!addNewCard && (
              <div className="flex justify-end w-full items-end mt-8">
                <Button variant="primary" size="md" onClick={() => setAddNewCard(true)}>Add New Card</Button>
              </div>
            )}
            {addNewCard && (
              <div className='flex gap-2 mt-8'>
                <div className='flex-1 flex flex-col gap-2'>
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
                  <div>
                    <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Number</p>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={cardFormData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="Card Number"
                      className={cardErrors.cardNumber ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
                    />
                    {cardErrors.cardNumber && (
                      <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                        {cardErrors.cardNumber}
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <div className='flex-1'>
                      <p className="text-primary-gray text-left mb-1 mt-[10px]">Expiry Date</p>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={cardFormData.expiryDate}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        className={cardErrors.expiryDate ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
                      />
                      {cardErrors.expiryDate && (
                        <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                          {cardErrors.expiryDate}
                        </div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className="text-primary-gray text-left mb-1 mt-[10px]">CVV</p>
                      <Input
                        type="text"
                        name="cvv"
                        value={cardFormData.cvv}
                        onChange={handleCardInputChange}
                        placeholder="***"
                        className={cardErrors.cvv ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
                      />
                      {cardErrors.cvv && (
                        <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                          {cardErrors.cvv}
                        </div>
                      )}
                    </div>
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
                  <div className="flex justify-end mt-[10px]">
                    <Button
                      variant="primary"
                      onClick={handleAddCard}
                    >
                      Save Card
                    </Button>
                  </div>
                </div>
                <div className="flex-1"/>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Payment;
