import SimpleCard from './SimpleCard';
import { useQueryClient } from '@tanstack/react-query';

export default function WhyBook() {

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['lodging']);
  console.log(data);

  const info = [
    {
      image: "/svg-icons/why-book-img1.svg",
      title: "Customize your Itineraries",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
    {
      image: "/svg-icons/why-book-img2.svg",
      title: "Allocate your Budget",
      description: "Free cancellation and payment to satisfy your budget and plans."

    },
    {
      image: "/svg-icons/why-book-img3.svg",
      title: "Guide Experience",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
  ]
  return (

    <div className='bg-[url("/images/why-book-us-bg.png")] bg-cover bg-center w-full h-full'>
      <section className="p-4   sm:p-[80px]   w-full  relative flex ">

        <div className=" max-w-[1440px] flex flex-col justify-center mx-auto">

          <h2 className=" font-bold sm:leading-[80px] text-2xl sm:text-[64px] max-sm:mt-4 sm:text-center  text-white">
            Why Book with Us?
          </h2>
          <p className='text-white sm:text-primary-gray mt-[16px] sm:text-center'>With innovative features like itineraries customizing and budget allocation, we offer a seamless booking experience for your dream trip. </p>
          <div className="flex justify-center items-center flex-wrap gap-8 self-stretch mt-8 sm:mt-[80px]">
            {info.map((item, i) => (
              <SimpleCard key={i} showButton={false} image={item.image} title={item.title} description={item.description} />

            ))}

          </div>
        </div>
      </section>
    </div>
  )
}
