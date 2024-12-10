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
                theme == Theme.Dark ? "glass-bg-dark stroke-glass-1 glass-corner" : "stroke-glass1 glass-bg-default glass-corner";

    return (
        <div className={`rounded-[40px] border-[1px] flex padding-[40px] gap-[32px]
            ${style}
            ${className}
            {...rest}`} >
            {children}
        </div>
    )
}
