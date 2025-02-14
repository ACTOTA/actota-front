import SimpleCard from './SimpleCard';

export default function WhyBook() {

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

    <div className='bg-[#00122D] w-full h-full'>
      <section className="  p-[80px]  w-full  relative flex bg-gradient-to-b from-[rgba(9,14,21,0.50)] to-[#090E15]">

        <div className=" max-w-[1440px] flex flex-col justify-center mx-auto">

          <h2 className=" font-bold leading-[80px] sm:text-[64px] text-center text-white">
            Why Book with Us?
          </h2>
          <p className='text-primary-gray mt-[16px] text-center'>With innovative features like itineraries customizing and budget allocation, we offer a seamless booking experience for your dream trip. </p>
          <div className="flex justify-center items-center flex-wrap gap-8 self-stretch mt-[80px]">
            {info.map((item, i) => (
              <SimpleCard showButton={false} image={item.image} title={item.title} description={item.description} />

            ))}

          </div>
        </div>
      </section>
    </div>
  )
}
