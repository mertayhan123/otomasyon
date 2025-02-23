"use client";
import React, { useState } from "react";
import SensorCard from "../components/sensor-card";
import SensorForm from "../components/sensor-form";

export default function Sensorler() {
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    <div className="px-4">
      <div className="w-full flex justify-end px-4">
        <button
          className="btn btn-success text-white"
          onClick={() => setFormVisible(true)}
        >
          Sensör Ekle
        </button>
      </div>
      <SensorCard />
      {isFormVisible && <SensorForm onClose={() => setFormVisible(false)} />}
    </div>
  );
}
