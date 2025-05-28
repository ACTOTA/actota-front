
import React from 'react';

type GlassPanelProps = {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'light' | 'dark';
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
} & React.HTMLAttributes<HTMLDivElement>;

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(({ 
    children, 
    className, 
    variant = 'light',
    blur = 'xl',
    padding = 'md',
    rounded = '3xl',
    ...rest 
}, ref) => {

    const variants = {
        light: 'bg-white/10 border-white/20 text-white',
        default: 'bg-black/40 border-primary-gray text-white',
        dark: 'bg-black/60 border-gray-600 text-white'
    };

    const blurLevels = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl'
    };

    const paddingLevels = {
        none: '',
        sm: 'p-4',
        md: 'p-6 lg:p-8',
        lg: 'p-8 lg:p-10 max-md:p-6'
    };

    const roundedLevels = {
        none: '',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full'
    };

    return (
        <div 
            ref={ref}
            className={`
                border 
                ${variants[variant]}
                ${blurLevels[blur]}
                ${paddingLevels[padding]}
                ${roundedLevels[rounded]}
                shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                transition-all duration-300
                ${className || ''}
            `}
            {...rest}
        >
            {children}
        </div>
    )
});

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
