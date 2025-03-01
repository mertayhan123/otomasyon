"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MotorTable from "../components/motor-table";
import SensorTable from "../components/sensor-table";
import StatusPanel from "../components/StatusPanel";
import AlarmPanel from "../components/AlarmPanel";
import SensorForm from "../components/sensor-form";

interface Sensor {
  id: number;
  name: string;
  type: string;
  location: string;
}

interface Motor {
  id: number;
  name: string;
  type: string;
  location: string;
}
interface Alarm {
  id: number;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "info";
}

export const alarmData: Alarm[] = [
  {
    id: 1,
    message: "Su basıncı kritik seviyede düşüş gösterdi!",
    timestamp: "2025-02-24 14:35",
    type: "critical",
  },
  {
    id: 2,
    message: "pH değeri beklenen aralık dışında.",
    timestamp: "2025-02-24 13:20",
    type: "warning",
  },
  {
    id: 3,
    message: "Motor 3 düzenli çalışmıyor.",
    timestamp: "2025-02-24 12:05",
    type: "info",
  },
];

export const motorData: Motor[] = [
  { id: 1, name: "Motor 1", type: "Electric", location: "Engine" },
  { id: 2, name: "Motor 2", type: "Hydraulic", location: "Engine" },
  { id: 3, name: "Motor 3", type: "Pneumatic", location: "Engine" },
  { id: 4, name: "Motor 4", type: "Electric", location: "Engine" },
  { id: 5, name: "Motor 5", type: "Hydraulic", location: "Engine" },
];

const statusData = {
  waterPressure: "120 PSI",
  waterLevel: "75%",
  phValue: "7.4",
};

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  const handleSensor = () => {
    setFormVisible(true);
  };
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
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-2xl p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Gerçek zamanlı Motor, Sensör ve Durum Bilgileri
          </p>
        </header>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Motorlar Kartı */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="card-title text-xl">Motorlar</h2>
                  <button className="btn btn-outline btn-primary btn-sm">
                    Yeni Motor Ekle
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>İsim</th>
                        <th>Tip</th>
                        <th>Konum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <MotorTable motorData={motorData} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sensorler Kartı */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="card-title text-xl">Sensorler</h2>
                  <button
                    onClick={handleSensor}
                    className="btn btn-outline btn-secondary btn-sm"
                  >
                    Yeni Sensör Ekle
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>İsim</th>
                        <th>Tip</th>
                        <th>Konum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <SensorTable sensorData={sensors} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Durum Paneli */}
          <div className="flex flex-col space-y-8">
            <StatusPanel statusData={statusData} />
            <AlarmPanel alarms={alarmData} />
          </div>
        </div>
      </div>
      {isFormVisible && (
        <SensorForm
          onClose={() => setFormVisible(false)}
          onSubmit={handleSensorSubmit}
        />
      )}
    </div>
  );
};

export default Home;
