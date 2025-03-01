"use client";
import React from "react";

interface Sensor {
  _id: string;
  name: string;
  location: string;
  type: string;
}

function SensorCard({
  sensor,
  onDelete,
}: {
  sensor: Sensor;
  onDelete: (id: string) => void;
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete-sensor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sensor._id }),
      });
      const data = await response.json();
      if (data.success) {
        onDelete(sensor._id);
      } else {
        console.error("Sensor silinemedi:", data.message);
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div
      key={sensor._id}
      className="bg-base-200 text-base-content shadow-md rounded-2xl p-5 flex flex-col justify-between 
      transition-all duration-300 hover:shadow-lg"
    >
      {/* Sensor Bilgileri */}
      <div>
        <h3 className="text-xl font-semibold">{sensor.name}</h3>
        <p className="text-sm">{sensor.location}</p>
      </div>
      {/* Detaylar */}
      <div className="mt-4">
        <div className="flex justify-between items-center border-b pb-2 mb-2 border-neutral-content">
          <span>ID</span>
          <span className="font-semibold">{sensor._id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Type</span>
          <span className="font-semibold">{sensor.type}</span>
        </div>
      </div>
      {/* Buton */}
      <div className="flex flex-col ">
        <button
          className="mt-4 w-full py-2 bg-primary text-primary-content 
        hover:bg-primary-focus font-medium rounded-lg transition"
        >
          Aç / Kapat
        </button>{" "}
        <button
          onClick={handleDelete}
          className="mt-4 w-full py-2 bg-red-600 text-white 
        hover:bg-red-700 font-medium rounded-lg transition"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default SensorCard;
