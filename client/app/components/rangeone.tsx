import React from 'react'


//interface oluşitur
interface DegerlerProps {
  rangeValue: number;
  checked: boolean;  
  //handle range change
  handleRangeChange: (event: any) => void;

}

const RangeOne = (
    {rangeValue, checked, handleRangeChange}: DegerlerProps
) => {
  return (
    <input
    disabled={!checked}
      type="range"
      min="0"
      max="100"
      value={rangeValue}
      onChange={handleRangeChange}
      className="range w-2/5"
    />
  )
}

export default RangeOne