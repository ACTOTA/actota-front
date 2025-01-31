import Image from 'next/image'
import GlassPanel from '../components/figma/GlassPanel';
import { Theme } from '../components/enums/theme';

export default function WhyBook() {

  const info = [
    {
      theme: Theme.Activity,
      image: <Image src="/images/route-icon.svg" alt="route icon" width={32} height={32}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />,
      title: "Flexibility",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
    {
      theme: Theme.Transportation,
      image: <Image src="/images/route-icon.svg" alt="route icon" width={32} height={32}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />,
      title: "Flexibility",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
    {
      theme: Theme.Lodging,
      image: <Image src="/images/route-icon.svg" alt="route icon" width={32} height={32}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />,
      title: "Flexibility",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
  ]
  return (
    <section className="h-[100vh] w-full neutral-01 relative flex">
      <div className="w-full h-96 absolute">
        <Image src="/images/actota-backdrop.png" alt="actota backdrop" layout="fill" objectFit="contain" />
      </div>
      <div className="z-10 w-full h-full">
        <div className="h-3/4 w-full flex flex-col justify-center">

          <h1 className="text-white text-5xl m-auto text-center w-full">Why Book with Us?</h1>
          <div className="flex justify-center items-center gap-8 self-stretch">
            {info.map((item, i) => (
              <GlassPanel key={i} theme={item.theme} className="h-[400px] w-[400px] text-white
                flex flex-col p-8 relative">
                <GlassPanel className="w-16 h-16 rounded-2xl relative">
                  {item.image}
                </GlassPanel>
                <span className="text-left absolute bottom-8">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p>{item.description}</p>
                </span>
              </GlassPanel>
            ))}

          </div>
        </div>
      </div>
    </section>
  )
}
