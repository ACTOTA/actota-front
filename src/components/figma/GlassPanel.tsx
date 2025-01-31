import { Theme } from "../enums/theme";

type GlassPanelProps = {
    children: React.ReactNode;
    className?: string;
    theme?: Theme;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({ children, className, theme, ...rest }: GlassPanelProps) {

    const style = theme === Theme.Activity ? "glass-bg-blue stroke-glass-blue" :
        theme === Theme.Transportation ? "glass-bg-red stroke-glass-red" :
            theme === Theme.Lodging ? "glass-bg-yellow stroke-glass-yellow" :
                theme == Theme.Dark ? "glass-bg-dark stroke-glass-1 glass-corner" : "glass-bg-dark stroke-glass-1 glass-corner";

    return (
        <div className={`border-[0.5px] border-primary-gray !rounded-[40px] flex p-[40px] bg-black/40 backdrop-blur-[4px] 
            ${style}
            ${className}
            {...rest}`} >
            {children}
        </div>
    )
}
