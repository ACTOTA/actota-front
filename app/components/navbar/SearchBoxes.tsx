import React from 'react';
import { STEPS } from '../../types/steps';
import { useRef } from 'react';

type SearchBoxesProps = {
    step: STEPS;
    reference: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SearchBoxes({ step, reference, ...rest } : SearchBoxesProps) {


    return (
        <div className="w-[584px] h-[596px] m-auto mt-4 glass-dark glass-corner backdrop-filter backdrop-blur-md  stroke-glass-01
        before:rounded-3xl rounded-3xl" ref={reference} {...rest} >
        </div>
    )
}
