
type GlassPanelProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({ children, className, ...rest }: GlassPanelProps) {



    return (
        <div className={`border-[0.5px] border-primary-gray rounded-[24px] flex p-[40px] max-md:p-[24px] bg-black/40 backdrop-blur-[4px] 
            ${className}
          `} >
            {children}
        </div>
    )
}
