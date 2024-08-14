type GlassPanelProps = {
    children: React.ReactNode;
    imageProps?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GlassPanel() {
    return (
        <div className="w-[584px] h-[824px] rounded-[48px] border-[1px] flex padding-[40px] gap-[32px] glass-corner stroke-glass1" >
            
        </div>
    )
}