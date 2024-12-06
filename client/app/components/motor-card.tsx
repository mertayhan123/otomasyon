"use client";

import React, { useState } from "react";
import Degerler from "./degerler";
import RangeOne from "./rangeone";
import Component from "./speed";

interface MotorCardProps {
  onRemove: () => void;
}

const MotorCard: React.FC<MotorCardProps> = ({ onRemove }) => {
  const [motorName, setMotorName] = useState("Motor Adı");
  const [rangeValue, setRangeValue] = useState<number>(40);
  const [voltage, setVoltage] = useState<number>(0);
  const [checked, setChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [firstcheck, setFirstCheck] = useState(true);
  const [secondcheck, setSecondCheck] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(event.target.value));
  };

  const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(Number(event.target.value));
  };

  const degis = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } else {
      setShowAlert(false);
    }
  };

  const handleSave = () => {
    setShowPopup(true);
  };

  const confirmSave = () => {
    setShowPopup(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const cancelSave = () => {
    setShowPopup(false);
  };

  const handleMotorNameClick = () => {
    const newName = prompt("Motorun yeni adını girin:", motorName);
    if (newName) {
      setMotorName(newName);
    }
  };

  return (
    <div className="flex flex-col p-3 bg-green-600 rounded-3xl shadow-xl">
      <div
        className="text-center text-xl font-bold mb-3 cursor-pointer"
        onClick={handleMotorNameClick}
      >
        {motorName}
      </div>

      {showAlert && (
        <div role="alert" className="alert alert-error mb-3">
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
          <span>
            DİKKAT! GELİŞTİRME MODU AKTİF EDİLDİ. RangeValue: {rangeValue},
            Voltage: {voltage}
          </span>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Değişiklikleri kaydetmek istediğinize emin misiniz?</p>
            <div className="flex justify-end space-x-3">
              <button className="btn btn-success" onClick={confirmSave}>
                Evet
              </button>
              <button className="btn btn-danger" onClick={cancelSave}>
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="toggle mb-5 mr-2"
            checked={checked}
            onChange={degis}
          />
          <span className="mb-5">Güç Değişikliği</span>
        </div>
        <div className="flex justify-between">
          <input
            type="checkbox"
            checked={firstcheck}
            onChange={() => setFirstCheck(!firstcheck)}
            className="checkbox mr-3 border-orange-400"
          />
          <input
            type="checkbox"
            checked={secondcheck}
            onChange={() => setSecondCheck(!secondcheck)}
            className="checkbox"
          />
        </div>
      </div>

      <Degerler rangeValue={rangeValue} voltageValue={voltage} />

      {firstcheck && (
        <RangeOne
          rangeValue={rangeValue}
          checked={checked}
          handleRangeChange={handleRangeChange}
        />
      )}
      <div className="h-2"></div>

      <RangeOne
        checked={true}
        rangeValue={voltage}
        handleRangeChange={handleVoltageChange}
      />

      {secondcheck && (
        <div className="flex justify-center">
          <Component
            rangevalue={rangeValue}
            setvalue={setRangeValue}
            checked={checked}
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button className="btn btn-primary" onClick={handleSave}>
          Kaydet
        </button>
        <button className="btn btn-danger" onClick={onRemove}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default MotorCard;
