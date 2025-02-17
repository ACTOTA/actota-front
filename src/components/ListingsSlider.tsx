import React, { useRef } from "react";
import Image from "next/image";
import GlassPanel from "./figma/GlassPanel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";

interface ListingsSliderProps {
  images: string[];
  currentIndex: number;
  onSlideClick: (index: number) => void;
}

const ListingsSlider = ({ images, currentIndex, onSlideClick }: ListingsSliderProps) => {
  const sliderRef = useRef<Slider>(null);

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

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image: string, i: number) => (
          <div key={i} className='w-full aspect-[926/640] relative'>
            <Image
              src={image}
              alt='Image of tour'
              fill
              priority
              className='rounded-lg object-cover'
              sizes='(max-width: 1536px) 71vw'
            />
          </div>
        ))}
      </Slider>

      <GlassPanel className='absolute bottom-36 left-0 right-0 w-fit m-auto rounded-full flex items-center gap-4 !p-3 z-10'>
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

      <div className='flex gap-4 mt-4'>
        {images.map((image, i) => (
          <div
            key={i}
            className={`rounded-[10px] cursor-pointer relative transition-transform duration-200 
              hover:scale-105 active:scale-95
              ${i === currentIndex ? 'ring-2 ring-white' : ''}`}
            onClick={() => handleThumbnailClick(i)}
          >
            <Image
              src={image}
              alt='Image of tour'
              height={100}
              width={100}
              className='rounded-lg aspect-square object-cover'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsSlider;