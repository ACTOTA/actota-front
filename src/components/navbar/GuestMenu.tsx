import React, { useState, useEffect } from 'react';
import PlusMinusButton, { ButtonType } from '../figma/PlusMinusButton';
import GlassPanel from '../figma/GlassPanel';
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from './constants';

interface GuestMenuProps {
    updateSearchValue?: (value: string) => void;
    guestsValue?: string;
    className?: string;
    onConfirm?: () => void;
}

export default function GuestMenu({ updateSearchValue, guestsValue, className, onConfirm }: GuestMenuProps) {
    const max = 10;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parse existing guest values if available
    const parseExistingValues = () => {
        if (!guestsValue) return { adults: 0, children: 0, infants: 0 };

        const parts = guestsValue.split(', ');
        const adults = parseInt(parts[0]?.split(' ')[0] || '0', 10);
        const children = parts.length > 1 ? parseInt(parts[1]?.split(' ')[0] || '0', 10) : 0;
        const infants = parts.length > 2 ? parseInt(parts[2]?.split(' ')[0] || '0', 10) : 0;

        return { adults, children, infants };
    };

    const initialValues = parseExistingValues();
    const [adults, setAdults] = useState(initialValues.adults);
    const [children, setChildren] = useState(initialValues.children);
    const [infants, setInfants] = useState(initialValues.infants);

    useEffect(() => {
        updateGuestSummary();
    }, [adults, children, infants]);

    const updateGuestSummary = () => {
        let summary = '';

        if (adults > 0) {
            summary += `${adults} adult${adults !== 1 ? 's' : ''}`;
        }

        if (children > 0) {
            summary += summary ? `, ${children} child${children !== 1 ? 'ren' : ''}` : `${children} child${children !== 1 ? 'ren' : ''}`;
        }

        if (infants > 0) {
            summary += summary ? `, ${infants} infant${infants !== 1 ? 's' : ''}` : `${infants} infant${infants !== 1 ? 's' : ''}`;
        }

        if (!summary) {
            summary = ''; // Keep empty if no guests selected
        }

        updateSearchValue?.(summary);
    };

    const updateInfant = (value: ButtonType) => () => {
        if (value === ButtonType.plus) {
            setInfants(infants >= max ? max : infants + 1);
        } else if (value === ButtonType.minus) {
            setInfants(infants === 0 ? 0 : infants - 1);
        }
    };

    const updateAdults = (value: ButtonType) => () => {
        if (value === ButtonType.plus) {
            setAdults(adults >= max ? max : adults + 1);
        } else if (value === ButtonType.minus) {
            setAdults(adults === 0 ? 0 : adults - 1);
        }
    };

    const updateChildren = (value: ButtonType) => () => {
        if (value === ButtonType.plus) {
            setChildren(children >= max ? max : children + 1);
        } else if (value === ButtonType.minus) {
            setChildren(children === 0 ? 0 : children - 1);
        }
    };

    return (
        <GlassPanel
            {...getMobileGlassPanelProps(isMobile)}
            className={`h-full w-full max-w-[450px] mx-auto z-20 ${isMobile ? MOBILE_GLASS_PANEL_STYLES : ''} ${className}`}
        >
            <div className="mb-6">
                <h2 className="text-left text-white text-xl font-semibold">Who's coming?</h2>
                <p className="text-sm text-gray-400 mt-1">Add guests to your trip</p>
            </div>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div>
                        <p className="font-medium">Adults</p>
                        <p className="text-sm text-gray-400">Ages 13 and above</p>
                    </div>
                    <div className="flex justify-around items-center gap-4">
                        <PlusMinusButton buttonType={ButtonType.minus} onClick={updateAdults(ButtonType.minus)} />
                        <p className="w-8 text-center font-medium text-lg">{adults}</p>
                        <PlusMinusButton buttonType={ButtonType.plus} onClick={updateAdults(ButtonType.plus)} />
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div>
                        <p className="font-medium">Children</p>
                        <p className="text-sm text-gray-400">Ages 2-12</p>
                    </div>
                    <div className="flex justify-around items-center gap-4">
                        <PlusMinusButton buttonType={ButtonType.minus} onClick={updateChildren(ButtonType.minus)} />
                        <p className="w-8 text-center font-medium text-lg">{children}</p>
                        <PlusMinusButton buttonType={ButtonType.plus} onClick={updateChildren(ButtonType.plus)} />
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div>
                        <p className="font-medium">Infants</p>
                        <p className="text-sm text-gray-400">Ages 2 and below</p>
                    </div>
                    <div className="flex justify-around items-center gap-4">
                        <PlusMinusButton buttonType={ButtonType.minus} onClick={updateInfant(ButtonType.minus)} />
                        <p className="w-8 text-center font-medium text-lg">{infants}</p>
                        <PlusMinusButton buttonType={ButtonType.plus} onClick={updateInfant(ButtonType.plus)} />
                    </div>
                </div>
            </div>
            
            {/* Confirm Button */}
            <div className="mt-6">
                <button
                    onClick={() => {
                        updateGuestSummary();
                        onConfirm?.();
                    }}
                    disabled={adults === 0 && children === 0 && infants === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                        (adults > 0 || children > 0 || infants > 0)
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Confirm Guests
                </button>
            </div>
        </GlassPanel>
    );
}
