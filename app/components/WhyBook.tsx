import Image from 'next/image'


export default function WhyBook() {


  return (
    <section className="h-[100vh] w-full neutral-01 relative flex">
      <div className="w-full h-96 absolute">
        <Image src="/images/actota-backdrop.png" alt="actota backdrop" layout="fill" objectFit="contain" />
      </div>
      <div className="z-10 w-full h-full">
        <h1 className="text-white text-5xl m-auto text-center w-full">Why Book with Us?</h1>
      </div>
    </section>
  )
}
