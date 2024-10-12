"use client";
import { useState } from "react";


export default function Home() {
    
  const [rangeValue, setrangeValue] = useState(40)
  const [checked, setchecked] = useState(false)

  const handleRangeChange = (event:any) => {
     
     //eğer range değeri 40'dan küçükse 40 yap daha büyükse range değerini setle
    if (event.target.value < 40) {
      setrangeValue(40)
    }
    else {
      setrangeValue(event.target.value)
    }

  }

  const degis = (event:any) => {
    setchecked(event.target.checked)
  }

  return (
    <div  data-theme="dark" className="flex flex-col items-center">
      <div className=" stats shadow w-3/5 mb-5" >
        <div className="stat place-items-center">
          <div className="stat-title">Volt</div>
          <div className="stat-value">{rangeValue}</div>
          <div className="stat-desc">Minimum</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Users</div>
          <div className="stat-value text-secondary">4,200</div>
          <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">New Registers</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <input type="range" min="0" max="100" value={rangeValue} disabled={!checked} onChange={handleRangeChange} className="range w-2/5" />
      <input type="checkbox" className="toggle" checked={checked} onChange={degis}  />

    </div>
  );
}
