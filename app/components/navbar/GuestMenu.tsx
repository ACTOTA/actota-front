import React, { useState } from 'react';
import PlusMinusButton, { ButtonType } from '../figma/PlusMinusButton';

export default function GuestMenu() {

    const max = 10;

    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);
    const [infants, setInfants] = React.useState(0);


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
        <section className="h-full w-full grid grid-rows-3 gap-3 text-lg z-30 py-4">
            <div className="flex justify-between">
                <div>
                    <p>Adults</p>
                    <p className="text-sm text-neutral-04">Ages 13 and above</p>
                </div>
                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateAdults(ButtonType.minus)}/>
                    <p className="w-4 text-center">{adults}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateAdults(ButtonType.plus)}/>
                </div>
            </div>
                    
            <div className="flex justify-between">
                <div>
                    <p>Children</p>
                    <p className="text-sm text-neutral-04">Ages 2-12</p>
                </div>
                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateChildren(ButtonType.minus)}/>
                    <p className="w-4 text-center">{children}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateChildren(ButtonType.plus)}/>
                </div>
            </div>
                 
            <div className="flex justify-between">
                <div>
                    <p>Infants</p>
                    <p className="text-sm text-neutral-04">Ages 2 and below</p>
                </div>
                
                <div className="flex justify-around items-center gap-4">
                    <PlusMinusButton buttonType={ButtonType.minus} onClick={updateInfant(ButtonType.minus)}/>
                    <p className="w-4 text-center">{infants}</p>
                    <PlusMinusButton buttonType={ButtonType.plus} onClick={updateInfant(ButtonType.plus)}/>
                </div>
            </div>
        </section>
    )
}
