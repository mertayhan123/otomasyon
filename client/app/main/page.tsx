
"use client";
import React from "react";
import { useSession } from "next-auth/react"; // next-auth'dan useSession'i içe aktar
import MotorTable from "@/app/components/motor-table";
import SensorTable from "@/app/components/sensor-table";

const sensorData = [
  { id: 1, name: "Sensor 1", type: "Temperature", location: "Engine" },
  { id: 2, name: "Sensor 2", type: "Temperature", location: "Engine" },
  { id: 3, name: "Sensor 3", type: "Temperature", location: "Engine" },
  { id: 4, name: "Sensor 4", type: "Temperature", location: "Engine" },
  { id: 5, name: "Sensor 5", type: "Temperature", location: "Engine" },
  { id: 6, name: "Sensor 6", type: "Temperature", location: "Engine" },
  { id: 7, name: "Sensor 7", type: "Temperature", location: "Engine" },
];

const motorData = [
  { id: 1, name: "Motor 1", type: "Temperature", location: "Engine" },
  { id: 2, name: "Motor 2", type: "Temperature", location: "Engine" },
  { id: 3, name: "Motor 3", type: "Temperature", location: "Engine" },
  { id: 4, name: "Motor 4", type: "Temperature", location: "Engine" },
  { id: 5, name: "Motor 5", type: "Temperature", location: "Engine" },
];

function Home() {
  const { data: session } = useSession();
console.log(session);  
  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Motorlar</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>{session?.user?.name}</th>
                  <th>Job</th>
                  <th>Favorite Color</th>
                </tr>
              </thead>
              <tbody>
                <MotorTable motorData={motorData} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sensorler</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Favorite Color</th>
                </tr>
              </thead>
              <tbody>
                <SensorTable sensorData={sensorData} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// Home bileşenini koruma altına al ve dışa aktar
export default (Home);
export { sensorData, motorData };
