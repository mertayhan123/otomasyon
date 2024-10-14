"use client";
import { useState } from "react";
import Component from "./components/speed";
import Degerler from "./components/degerler";
import RangeOne from "./components/rangeone";

export default function Home() {
  const [rangeValue, setrangeValue] = useState(40);
  const [checked, setchecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [firstcheck, setfirstcheck] = useState(true);
  const [secondcheck, setsecondcheck] = useState(true);

  const handleRangeChange = (event: any) => {
    //eğer range değeri 40'dan küçükse 40 yap daha büyükse range değerini setle

    setrangeValue(Number(event.target.value));
  };

  const degis = (event: any) => {
    setchecked(event.target.checked);
    if (event.target.checked) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } else {
      setShowAlert(false);
    }
  };

  return (
    <div className="flex justify-center h-5/6 ">
      <div
        data-theme
        className="flex flex-col items-center justify-between w-8/12  "
      >
        <input
          type="checkbox"
          className="toggle mb-5"
          checked={checked}
          onChange={degis}
        />
        {showAlert && ( // Alert sadece showAlert true olduğunda gösterilecek
          <div role="alert" className="alert alert-error ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>DİKKAT! GELİŞTİRME MODU AKTİF EDİLDİ</span>
          </div>
        )}
        <div>
          <input
            type="checkbox"
            checked={firstcheck}
            onChange={() => setfirstcheck(!firstcheck)}
            className="checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800"
          />
          <input
            type="checkbox"
            defaultChecked
            checked={secondcheck}
            onChange={() => setsecondcheck(!secondcheck)}
            className="checkbox [--chkbg:oklch(var(--a))] [--chkfg:oklch(var(--p))]"
          />
        </div>
        <Degerler rangeValue={rangeValue}></Degerler>
        {firstcheck && (
          <RangeOne
            rangeValue={rangeValue}
            checked={checked}
            handleRangeChange={handleRangeChange}
          ></RangeOne>
        )}

        {secondcheck && (
          <Component
            rangevalue={rangeValue}
            setvalue={setrangeValue}
            checked={checked}
          />
        )}
      </div>
    </div>
  );
}
