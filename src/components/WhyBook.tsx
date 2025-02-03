import Image from 'next/image'
import GlassPanel from '../components/figma/GlassPanel';
import { Theme } from '../components/enums/theme';

export default function WhyBook() {

  const info = [
    {
      theme: Theme.Activity,
      image: "/svg-icons/why-book-img1.svg",
      title: "Customize your Itineraries",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
    {
      theme: Theme.Transportation,
      image: "/svg-icons/why-book-img2.svg",
      title: "Allocate your Budget",
      description: "Free cancellation and payment to satisfy your budget and plans."

    },
    {
      theme: Theme.Lodging,
      image: "/svg-icons/why-book-img3.svg",
      title: "Guide Experience",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
  ]
  return (

    <div className='bg-[#00122D] w-full h-full'>
      <section className="  p-[80px]  w-full  relative flex bg-gradient-to-b from-[rgba(9,14,21,0.50)] to-[#090E15]">

        <div className=" max-w-[1440px] flex flex-col justify-center mx-auto">

          <h2 className=" font-bold leading-[80px] sm:text-[64px] text-center text-white">
            Why Book with Us?
          </h2>
          <p className='text-primary-gray mt-[16px] text-center'>With innovative features like itineraries customizing and budget allocation, we offer a seamless booking experience for your dream trip. </p>
          <div className="flex justify-center items-center flex-wrap gap-8 self-stretch mt-[80px]">
            {info.map((item, i) => (
              <div className='flex-1 max-w-[400px]  bg-gradient-to-br  from-[#CFCFCF]/50 to-[#6B6B6B]/30   rounded-lg'>

                <div key={i} className="h-[380px] w-[400px] text-white 
                flex flex-col p-2   bg-black/60   rounded-lg">
                  <div className=" flex justify-center   items-center rounded-2xl">
                    <Image src={item.image} alt="route icon" objectFit="cover" height={240} width={390}
                    />
                  </div>
                  <div className=" mt-5 ">
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className='text-primary-gray mt-2'>{item.description}</p>
                  </div>
                </div>
              </div>

            ))}

          </div>
        </div>
      </section>
    </div>
  )
}
