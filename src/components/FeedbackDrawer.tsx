"use client"
import React, { useState } from 'react'
import Button from './figma/Button'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Input from './figma/Input'
import ActivityCard from '@/src/components/listings/ActivityCard';
import { BiSolidMap } from 'react-icons/bi'
import { MdOutlineExplore } from 'react-icons/md'

const FeedbackDrawer = ({ setIsDrawerOpen }: { setIsDrawerOpen: (isDrawerOpen: boolean) => void }) => {

    const [listing, setListings] = useState<any>({
        trip_name: "Yellowstone Adventure",
        fareharbor_id: 12345,
        person_cost: 599.99,
        min_age: 12,
        min_guests: 2,
        max_guests: 12,
        length_days: 3,
        length_hours: 72,
        start_location: {
          city: "Bozeman",
          state: "Montana",
          coordinates: [45.6770, -111.0429]
        },
        end_location: {
          city: "West Yellowstone",
          state: "Montana",
          coordinates: [44.6622, -111.1044]
        },
        description: "Experience the wonders of Yellowstone National Park on this 3-day adventure...",
        days: {
          "day1": [
            {
              time: "08:00:00",
              location: {
                name: "Old Faithful",
                coordinates: [44.4605, -110.8281]
              },
              name: "Geyser Watching",
              type: "sightseeing"
            },
            {
              time: "14:00:00",
              location: {
                name: "Grand Prismatic Spring",
                coordinates: [44.5251, -110.8390]
              },
              name: "Hot Spring Visit",
              type: "hiking"
            }
          ],
          "day2": [
            {
              time: "09:00:00",
              location: {
                name: "Lamar Valley",
                coordinates: [44.8520, -110.2147]
              },
              name: "Wildlife Viewing",
              type: "safari"
            }
          ]
        },
        activities: [
          {
            label: "Hiking",
            description: "Moderate difficulty trails with spectacular views",
            tags: ["outdoor", "active", "nature"]
          },
          {
            label: "Wildlife Watching",
            description: "Observe bison, elk, and possibly bears in their natural habitat",
            tags: ["wildlife", "photography", "nature"]
          }
        ],
        images: [
          "/images/hero-bg.jpg",
          "/images/hero-bg.jpg",
          "/images/hero-bg.jpg"
        ],
        start_date: new Date("2024-06-15"),
        end_date: new Date("2024-06-17"),
        created_at: new Date(),
        updated_at: new Date()
      });


      const formatTime = (time: string) => {
		const [hours] = time.split(':');
		const parsedHours = parseInt(hours);
		return `${parsedHours}:00${parsedHours >= 12 ? 'PM' : 'AM'}`;
	};

	// Format date helper
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(new Date(date));
	};


	// Get icon for activity type
	const getActivityIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'hiking':
				return <MdOutlineExplore className="w-5 h-5 text-white" />;
			case 'sightseeing':
				return <BiSolidMap className="w-5 h-5 text-white" />;
			case 'safari':
				return <MdOutlineExplore className="w-5 h-5 text-white" />;
			default:
				return <BiSolidMap className="w-5 h-5 text-white" />;
		}
	};

    return (
        <div className='flex flex-1 flex-col w-[600px] p-8'>
            {/* Header */}
           
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
            <ActivityCard 
                activity={listing.days[`day${2}`][0]}
                formatTime={formatTime}
                getActivityIcon={getActivityIcon}
            />
            {/* Rating Section */}
            <div className='flex justify-between items-center mt-4'>
                <p className='text-white'>Overall Rating</p>

                <Ratings />

            </div>
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
            <Button variant='primary' className='w-full mt-4'>Submit Feedback</Button>
        </div>
    );
};

export default FeedbackDrawer;

const Ratings = () => {
    const [rating, setRating] = useState(0);
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
