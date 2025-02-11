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
const Payment = () => {
  const [activeTab, setActiveTab] = useState("bookingsHistory");
  const [search, setSearch] = useState("");
  const [savedCards, setSavedCards] = useState([
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
                    {item.isDefault ? <Button variant="primary" size="sm" className={`mx-auto !bg-[#215CBA] !text-white`}> Default</Button> :
                      <Button variant="simple" size="sm" className={`px-0 py-0  !text-[#BBD4FB] border-b border-[#BBD4FB] !rounded-none`}> Set as default</Button>}
                    <TrashIcon className="text-white " />
                  </div>
                </div>
              </div>
            ))}

            {addNewCard ?
              <div className='flex gap-2 mt-8'>
                <div className='flex-1 flex flex-col gap-2'>
                  <div className="flex items-center justify-between">

                    <p className='text-white text-xl font-bold  flex items-center gap-2'><MdOutlineAddCard className="text-white size-6" /> Add a new card</p>
                    <RxCross1 className="text-white size-5" />
                  </div>
                  <div>
                    <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Holder Name</p>
                    <Input type="text" name="fullName" placeholder="Card Holder Name" />
                  </div>
                  <div>
                    <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Number</p>
                    <Input type="text" name="fullName" placeholder="Card Number" />
                  </div>
                  <div className='flex gap-2'>
                    <div className='flex-1'>
                      <p className="text-primary-gray text-left mb-1 mt-[10px]">Expiry Date</p>
                      <Input type="text" name="fullName" placeholder="MM/YY" />
                    </div>
                    <div className='flex-1'>
                      <p className="text-primary-gray  text-left mb-1 mt-[10px]">CVV</p>
                      <Input type="text" name="fullName" placeholder="***" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-[10px]">
                    <input type="checkbox" className="w-5 h-5 rounded-[4px] outline-none ring-0 focus:ring-0 focus:ring-offset-0" />
                    <p className="text-primary-gray text-sm">Set as default</p>
                  </div>
                  <div className="flex justify-end mt-[10px]">
                    <Button variant="primary" className={``} onClick={() => setAddNewCard(false)}>Save Card</Button>
                  </div>

                </div>
                <div className='flex-1 flex flex-col gap-2 '>

                </div>
              </div> :
              <div className="flex justify-end">
                <Button variant="primary" className={`mt-8`} onClick={() => setAddNewCard(true)}>Add a new card</Button>

              </div>
            }

          </div>
        }
      </div>
    </div>
  );
};

export default Payment;
