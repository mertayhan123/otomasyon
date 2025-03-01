"use client";
import React, { useState, useEffect } from "react";
import SensorCard from "../components/sensor-card";
import SensorForm from "../components/sensor-form";

export default function Sensorler() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [sensors, setSensors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch("/api/getsensor");
        const data = await response.json();
        if (data.success) {
          setSensors(data.sensors);
        } else {
          console.error("Sensörler alınamadı:", data.message);
        }
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    fetchSensors();
  }, []);

  const handleSensorSubmit = async (sensor: any) => {
    try {
      const response = await fetch("/api/sensorkayit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensor),
      });
      const data = await response.json();
      if (data.success) {
        setSensors([...sensors, data.sensor]);
        setFormVisible(false);
      } else {
        console.error("Sensor kaydedilemedi:", data.message);
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const handleSensorDelete = (id: string) => {
    setSensors(sensors.filter((sensor) => sensor._id !== id));
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor._id}
            sensor={sensor}
            onDelete={handleSensorDelete}
          />
        ))}
      </div>
      {isFormVisible && (
        <SensorForm
          onClose={() => setFormVisible(false)}
          onSubmit={handleSensorSubmit}
        />
      )}
    </div>
  );
}
