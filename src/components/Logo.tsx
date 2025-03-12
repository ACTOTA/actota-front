import Image from "next/image";

interface LogoProps {
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
}

function Logo({ onClick, className, width = 150, height = 40 }: LogoProps) {
  return (
    <div
      onClick={onClick}
      className={`${className} relative`}
      style={{ width: width, height: height }}
    >
      <Image
        src="/images/actota-logo.svg"
        alt="Actota Logo"
        fill
        className="object-contain"
      />
    </div>
  )
}

export default Logo;
