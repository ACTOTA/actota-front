'use client';

import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { IconType } from "react-icons";

interface ButtonProps {
    label: string;
    onClick: (e: React.MouseEvent <HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;

}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon,
}) => {
    return (  
        <button
            onClick={onClick}
            disabled={disabled}
            className='{
                relative
                disabled:oacity-70
                disabled: cursor-not-allowed
                rounded-lg
                hover:opacity-80
                transition
                w-full
                // ${outline ? "bg-white" : "bg-logo-blue"}
                // ${outline ? "border-black" : "border-logo-blue"}
                // ${outline ? "text-black" : "text-white"}
                // ${small ? "py-1" : "py-3"}
                // ${small ? text-sm : "text-md}
                // ${small ? "fontlight" : "font-semibold"}
                // ${small ? "border-[1px]" : "border-2"}
            }'
        >
            {label}
        </button>

    );
}
 
export default Button;