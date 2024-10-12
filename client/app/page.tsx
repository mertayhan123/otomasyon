"use client";
import { useState } from "react";
import Component from "./components/speed";

export default function Home() {
  const [rangeValue, setrangeValue] = useState(40);
  const [checked, setchecked] = useState(false);

  const handleRangeChange = (event: any) => {
    //eğer range değeri 40'dan küçükse 40 yap daha büyükse range değerini setle
    
      setrangeValue(event.target.value);
   
  };

  const degis = (event: any) => {
    setchecked(event.target.checked);
  };

  return (
    <div data-theme className="flex flex-col items-center">
      <div className=" stats shadow w-3/5 mb-5">
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
      <input
        type="range"
        min="0"
        max="100"
        value={rangeValue}
        onChange={handleRangeChange}
        className="range w-2/5"
      />
      <input
        type="checkbox"
        className="toggle"
        checked={checked}
        onChange={degis}
      />
      <input
        type="checkbox"
        value="cyberpunk"
        className="toggle theme-controller"
      />
      <div className="stats stats-vertical shadow">
        <div className="stat">
          <div className="stat-title">Downloads</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat">
          <div className="stat-title">New Users</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-title">New Registers</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <div className="btm-nav">
  <button className="bg-pink-200 text-pink-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
    <span className="btm-nav-label">Home</span>
  </button>
  <button className="active border-blue-600 bg-blue-200 text-blue-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="btm-nav-label">Warnings</span>
  </button>
  <button className="bg-teal-200 text-teal-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <span className="btm-nav-label">Statics</span>
  </button>
</div>
   <Component rangevalue={rangeValue} setvalue={setrangeValue} checked={checked} />
    </div>
  );
}
