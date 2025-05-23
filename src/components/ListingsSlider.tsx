import React, { useRef } from "react";
import Image from "next/image";
import GlassPanel from "./figma/GlassPanel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import { ItineraryData } from "../types/itineraries";

interface ListingsSliderProps {
  listing: ItineraryData;
  currentIndex: number;
  onSlideClick: (index: number) => void;
}

const ListingsSlider = ({ listing, currentIndex, onSlideClick }: ListingsSliderProps) => {
  const sliderRef = useRef<Slider>(null);
  const images = listing.images || [];

  const handlePrevClick = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextClick = () => {
    sliderRef.current?.slickNext();
  };

  const handleThumbnailClick = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current: number, next: number) => onSlideClick(next)
  };

  if (!images.length) {
    return (
      <div className="w-full aspect-[926/640] relative bg-gray-200 rounded-lg flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image: string, i: number) => (
          <div key={i} className='w-full aspect-[926/640] relative'>
            <Image
              src={image}
              alt={`${listing.trip_name} - Image ${i + 1}`}
              fill
              priority
              className='rounded-lg object-cover'
              sizes='(max-width: 1536px) 71vw'
            />
          </div>
        ))}
      </Slider>

      {images.length > 1 && (
        <GlassPanel className='absolute bottom-36 max-sm:bottom-6 left-0 right-0 w-fit m-auto rounded-full flex items-center gap-4 !p-3 z-10'>
          <ChevronLeftIcon
            className='h-6 w-6 cursor-pointer hover:scale-110 transition-transform'
            onClick={handlePrevClick}
          />
          <div>{currentIndex + 1} of {images.length}</div>
          <ChevronRightIcon
            className='h-6 w-6 cursor-pointer hover:scale-110 transition-transform'
            onClick={handleNextClick}
          />
        </GlassPanel>
      )}

      {images.length > 1 && (
        <div className='flex gap-4 mt-2 p-1 max-sm:hidden overflow-x-auto '>
          {images.map((image, i) => (
            <div
              key={i}
              className={`rounded-[10px] cursor-pointer relative transition-transform duration-200 
               
                ${i === currentIndex ? 'ring-1 ring-white' : ''}`}
              onClick={() => handleThumbnailClick(i)}
            >
              <Image
                src={image}
                alt={`${listing.trip_name} - Thumbnail ${i + 1}`}
                height={100}
                width={100}
                className='rounded-lg aspect-square object-cover'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsSlider;
