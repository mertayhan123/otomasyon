"use client";
import React from "react";
import { sensorData } from "../main/page";

function SensorCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {sensorData.map((item: any) => (
        <div
          key={item.id}
          className="bg-base-200 text-base-content shadow-md rounded-2xl p-5 flex flex-col justify-between 
          transition-all duration-300 hover:shadow-lg"
        >
          {/* Sensor Bilgileri */}
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-sm">{item.location}</p>
          </div>

          {/* Detaylar */}
          <div className="mt-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2 border-neutral-content">
              <span>ID</span>
              <span className="font-semibold">{item.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Type</span>
              <span className="font-semibold">{item.type}</span>
            </div>
          </div>

          {/* Buton */}
          <button
            className="mt-4 w-full py-2 bg-primary text-primary-content 
          hover:bg-primary-focus font-medium rounded-lg transition"
          >
            Aç / Kapat
          </button>
        </div>
      ))}
    </div>
  );
}

export default SensorCard;
