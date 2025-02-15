"use client"
import React, { useState } from 'react'
import Button from './figma/Button'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Input from './figma/Input'
import ActivityCard from '@/src/components/ActivityCard';
import { BiSolidMap } from 'react-icons/bi'
import { MdOutlineExplore } from 'react-icons/md'
import FeedbackCard from './FeedbackCard'
import { FaCheck } from 'react-icons/fa6'

const FeedbackDrawer = ({ setIsDrawerOpen, activityCompleted = false }: { setIsDrawerOpen: (isDrawerOpen: boolean) => void, activityCompleted?: boolean }) => {

  const [feedbackSent, setFeedbackSent] = useState(false)
  const [activeTab, setActiveTab] = useState("veryLikely");
  const [activeTab2, setActiveTab2] = useState("yes");

  const tabs = [
    {
      id: "veryLikely",
      label: "Very Likely",
    },
    {
      id: "likely",
      label: "Likely",
    },
    {
      id: "unlikely",
      label: "Unlikely",
    },
    {
      id: "veryUnlikely",
      label: "Very Unlikely",
    }
  ];

  const tabs2 = [
    {
      id: "yes",
      label: "Yes",
    },
    {
      id: "maybe",
      label: "Maybe",
    },
    {
      id: "no",
      label: "No",
    },


  ];
  return (
    <div className='flex flex-1 flex-col w-[600px] p-8'>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-bold text-white">Submit Feedback</h2>
        <Button
          variant='simple'
          className='!p-0'
          onClick={() => setIsDrawerOpen(false)}
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </Button>
      </div>
      {/* Header */}
      {feedbackSent ? (
        <div className='flex flex-col items-center justify-center h-full'>
          <div className='flex justify-center items-center bg-gradient-to-br from-[#0252D0]  to-[#012A6A] rounded-full h-[64px] w-[64px] mb-6'>
            <FaCheck className='text-white size-6' />
          </div>
          <h2 className='text-2xl font-bold text-white'>Thank You for Submitting your Feedback.</h2>
          <p className='text-white text-center mt-2'>We appreciate your honest feedback and will use it for future improvements.</p>
          {!activityCompleted &&
            <p className='text-white flex justify-center items-center mt-2'>You’ve earned extra <Image src="/svg-icons/booking-points.svg" className='mx-2' alt="points" width={20} height={20} /> <span className='font-bold text-sm'> 20 Points!</span> </p>
          }
        </div>
      ) : (
        <>



          <FeedbackCard activity={{ name: "Yellowstone Adventure", type: "sightseeing", time: "08:00:00", date: "2024-06-15", location: { name: "Old Faithful", coordinates: [44.4605, -110.8281] }, image: "/images/hero-bg.jpg" }} />
          <div className='flex justify-between items-center mt-4'>
            <p className='text-white'>Overall Rating</p>

            <Ratings />

          </div>
          {activityCompleted ? (
            <>
              <p className='text-white mb-2 mt-4'>What did you enjoy the most?</p>
              <Input placeholder='Write  here' />

              <p className='text-white mb-2 mt-4'>What did you find unsatisfactory?</p>
              <Input placeholder='Write  here' />

              <p className='text-white text-xl font-bold mt-4'>How would you rate the following aspects of the activity?</p>
              <div className='flex justify-between items-center mt-1'>
                <p className='text-white'>Guide/Instructor</p>

                <Ratings />

              </div>
              <div className='flex justify-between items-center '>
                <p className='text-white'>Safety Measures</p>

                <Ratings />

              </div>
              <div className='flex justify-between items-center'>
                <p className='text-white'>Value for Money</p>

                <Ratings />

              </div>
              <p className='text-white mb-2 mt-4'>Suggestion(s) for Improvements</p>
              <Input placeholder='Write  here' />
            </>


          )


            :
            <div className='h-full'>
              <p className='text-white text-xl font-bold'>Arrival Experience</p>
              <p className='text-white  mt-2'>How satisfied were you with the arrival arrangements (e.g., airport pickup, welcome, etc.)?</p>
              <Ratings />
              <p className='text-white mb-2 mt-4'>Comments on arrival experience</p>
              <Input placeholder='Write  here' />
              <p className='text-white text-xl font-bold mt-4'>Activity </p>
              <p className='text-white  mt-4'>How satisfied were you with the activities?</p>
              <Ratings />
              <p className='text-white  '>Rate the safety measures provided</p>
              <Ratings />
              <p className='text-white  '>Value for money</p>
              <Ratings />
              <p className='text-white mb-2 '>Which activity did you enjoy the most?</p>
              <Input placeholder='Write  here' />
              <p className='text-white mb-2 mt-4'>Which activity did you enjoy the least?</p>
              <Input placeholder='Write  here' />
              <p className='text-white mb-2 mt-4'>Comments on activities</p>
              <Input placeholder='Write  here' />


              <p className='text-white text-xl font-bold mt-6'>Accommodation </p>
              <p className='text-white  mt-4'>How satisfied were you with the accommodations provided?</p>
              <Ratings />
              <p className='text-white  '>Cleanliness and comfort</p>
              <Ratings />
              <p className='text-white  '>Value for money</p>
              <Ratings />
              <p className='text-white mb-2 '>Comments on accommodations</p>
              <Input placeholder='Write  here' />



              <p className='text-white text-xl font-bold mt-6'>Transportation </p>
              <p className='text-white  mt-4'>How satisfied were you with the transportations provided?</p>
              <Ratings />
              <p className='text-white  '>Cleanliness and comfort</p>
              <Ratings />
              <p className='text-white  '>Punctuality</p>
              <Ratings />
              <p className='text-white  '>Value for money</p>
              <Ratings />
              <p className='text-white mb-2 '>Comments on transportations</p>
              <Input placeholder='Write  here' />



              <p className='text-white text-xl font-bold mt-6'>Spots & Attractions Visited </p>
              <p className='text-white  mt-4'>How satisfied were you with the spots/attractions visited?</p>
              <Ratings />

              <p className='text-white mb-2 '>Which spot did you enjoy the most?</p>
              <Input placeholder='Write  here' />

              <p className='text-white text-xl font-bold mt-6'>Suggestions </p>
              <p className='text-white mb-2 mt-4'>How likely are you to recommend this trip to others?</p>
              <div className="flex gap-2">
                {tabs.map(tab => (
                  <Button
                    key={tab.id}
                    variant="outline"
                    size="sm"
                    className={
                      activeTab === tab.id
                        ? "!border-white !text-white flex-1"
                        : "!border-border-primary !text-border-primary flex-1"
                    }
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <p className='text-white mb-2 mt-4'>Would you travel with us again in the future?</p>

              <div className="flex gap-2">
                {tabs2.map(tab => (
                  <Button
                    key={tab.id}
                    variant="outline"
                    size="sm"
                    className={
                      activeTab2 === tab.id
                        ? "!border-white !text-white flex-1"
                        : "!border-border-primary !text-border-primary flex-1"
                    }
                    onClick={() => setActiveTab2(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <p className='text-white mb-2 mt-4'>Suggestion(s) for improvements</p>
              <Input placeholder='Write  here' />

              <p className='text-white mb-2 mt-4'>Additional comments</p>
              <Input placeholder='Write  here' />

            </div>
          }
        </>
      )}
      <Button variant='primary' className='w-full mt-4' onClick={() => {
        if (feedbackSent) {
          setIsDrawerOpen(false);
        } else {
          setFeedbackSent(true);
        }
      }}>{feedbackSent ? "Close" : "Submit Feedback"}</Button>
    </div>
  );
};

export default FeedbackDrawer;

const Ratings = () => {
  const [rating, setRating] = useState(4);
  const [hover, setHover] = useState(0); // For hover effect

  const handleRating = (newRating: number) => {
    setRating(newRating);
  };
  return (
    <div className='flex items-center gap-2 rounded-md p-2 text-nowrap'>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Image
            key={star}
            src={star <= (hover || rating) ? "/svg-icons/yellow-star.svg" : "/svg-icons/white-star.svg"}
            alt="rating"
            width={20}
            height={20}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>
      <p className='text-white'>{rating}/5</p>
    </div>
  )
}
