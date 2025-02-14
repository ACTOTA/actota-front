
type GlassPanelProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({ children, className, ...rest }: GlassPanelProps) {

   

    return (
        <div className={`border-[0.5px] border-primary-gray !rounded-[40px] flex p-[40px] bg-black/40 backdrop-blur-[4px] 
            ${className}
            {...rest}`} >
            {children}
        </div>
    )
}
