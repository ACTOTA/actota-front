import React from 'react'
import { ButtonType } from './figma/PlusMinusButton'
import PlusMinusButton from './figma/PlusMinusButton'

const Counter = ({ count, setCount, max }: { count: number, setCount: (value: number) => void, max: number }) => {

    const updateCount = (value: ButtonType) => () => {
        if (value === ButtonType.plus) {
            setCount(count >= max ? max : count + 1);
        } else if (value === ButtonType.minus) {
            setCount(count === 0 ? 0 : count - 1);
        }
    };
  return (
    <div className="flex justify-around items-center gap-4">
      <PlusMinusButton buttonType={ButtonType.minus} onClick={updateCount(ButtonType.minus)} />
      <p className="w-4 text-center text-white font-bold text-xl">{count}</p>
      <PlusMinusButton buttonType={ButtonType.plus} onClick={updateCount(ButtonType.plus)} />
    </div>
  )
}

export default Counter