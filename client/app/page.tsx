import React from "react";
import SensorTable from "./components/sensor-table";
import MotorTable from "./components/motor-table";

//burada motorlar ve sensorlerin listeleneceği icin verileri burada cekip tabloya yazdıracağım
//verileri cekmek icin bir api kullan

const sensorData = [
  {
    id: 1,
    name: "Sensor 1",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 2,
    name: "Sensor 2",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 3,
    name: "Sensor 3",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 4,
    name: "Sensor 4",
    type: "Temperature",
    location: "Engine",
  },
];

const motorData = [
  {
    id: 1,
    name: "Motor 1",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 2,
    name: "Motor 2",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 3,
    name: "Motor 3",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 4,
    name: "Motor 4",
    type: "Temperature",
    location: "Engine",
  },
  {
    id: 5,
    name: "Motor 5",
    type: "Temperature",
    location: "Engine",
  },
];

function Home() {
  return (
    <>
      <div className="card bg-base-100  shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Motorlar</h2>
          <div className="overflow-x-auto">
            <table className="table ">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
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
      <div className="card bg-base-100  shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sensorler</h2>
          <div className="overflow-x-auto">
            <table className="table ">
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
//how can i export sensorData and motorData to use in other components
export default Home;
export { sensorData, motorData };
