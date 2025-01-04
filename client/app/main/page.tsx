"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MotorTable from "@/app/components/motor-table";
import SensorTable from "@/app/components/sensor-table";
import StatusPanel from "@/app/components/StatusPanel";

// pages/index.tsx veya app/page.tsx


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

const sensorData: Sensor[] = [
  { id: 1, name: "Sensor 1", type: "Temperature", location: "Engine" },
  { id: 2, name: "Sensor 2", type: "Temperature", location: "Engine" },
  { id: 3, name: "Sensor 3", type: "Temperature", location: "Engine" },
  { id: 4, name: "Sensor 4", type: "Temperature", location: "Engine" },
  { id: 5, name: "Sensor 5", type: "Temperature", location: "Engine" },
  { id: 6, name: "Sensor 6", type: "Temperature", location: "Engine" },
  { id: 7, name: "Sensor 7", type: "Temperature", location: "Engine" },
];

const motorData: Motor[] = [
  { id: 1, name: "Motor 1", type: "Temperature", location: "Engine" },
  { id: 2, name: "Motor 2", type: "Temperature", location: "Engine" },
  { id: 3, name: "Motor 3", type: "Temperature", location: "Engine" },
  { id: 4, name: "Motor 4", type: "Temperature", location: "Engine" },
  { id: 5, name: "Motor 5", type: "Temperature", location: "Engine" },
];

const statusData = {
  waterPressure: "120 PSI",
  waterLevel: "75%",
  phValue: "7.4",
};

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Oturum durumu "loading" ise yükleniyor göstergesi
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  // Oturum açılmışsa sayfanın içeriğini render et
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol Bölüm: Motorlar ve Sensorler */}
        <div className="flex-1 space-y-6">
          {/* Motorlar Kartı */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Motorlar</h2>
                <button className="btn btn-primary btn-sm">Yeni Motor Ekle</button>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Sensorler</h2>
                <button className="btn btn-primary btn-sm">Yeni Sensör Ekle</button>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>İsim</th>
                      <th>Tip</th>
                      <th>Konum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SensorTable sensorData={sensorData} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Bölüm: Durum Paneli */}
        <div className="w-full lg:w-1/3">
          <StatusPanel statusData={statusData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
export { sensorData, motorData };