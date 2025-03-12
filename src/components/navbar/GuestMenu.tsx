import React, { useState, useEffect } from 'react';
import PlusMinusButton, { ButtonType } from '../figma/PlusMinusButton';

interface GuestMenuProps {
    updateSearchValue?: (value: string) => void;
    guestsValue?: string;
    className?: string;
}

export default function GuestMenu({ updateSearchValue, guestsValue, className }: GuestMenuProps) {
    const max = 10;

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
        <section className={`h-full w-full max-w-[400px] mx-auto text-white backdrop-blur-md border-2 border-border-primary rounded-3xl grid grid-rows-3 gap-3 text-lg z-20 p-4 ${className}`}>
            <div className="flex justify-between">
                <div>
                    <p>Adults</p>
                    <p className="text-sm text-neutral-04">Ages 13 and above</p>
                </div>
                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateAdults(ButtonType.minus)} />
                    <p className="w-4 text-center">{adults}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateAdults(ButtonType.plus)} />
                </div>
            </div>

            <div className="flex justify-between">
                <div>
                    <p>Children</p>
                    <p className="text-sm text-neutral-04">Ages 2-12</p>
                </div>
                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateChildren(ButtonType.minus)} />
                    <p className="w-4 text-center">{children}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateChildren(ButtonType.plus)} />
                </div>
            </div>

            <div className="flex justify-between">
                <div>
                    <p>Infants</p>
                    <p className="text-sm text-neutral-04">Ages 2 and below</p>
                </div>

                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateInfant(ButtonType.minus)} />
                    <p className="w-4 text-center">{infants}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateInfant(ButtonType.plus)} />
                </div>
            </div>
        </section>
    );
}
