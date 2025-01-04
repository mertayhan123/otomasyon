// components/SensorTable.tsx

import React from "react";

// Sensör verisinin yapısını tanımlayan arayüz
interface Sensor {
  id: number;
  name: string;
  type: string;
  location: string;
}

// Bileşenin prop'larının tipini tanımlayan arayüz
interface SensorTableProps {
  sensorData: Sensor[];
}

const SensorTable: React.FC<SensorTableProps> = ({ sensorData }) => {
  return (
    <>
      {sensorData.map((sensor) => (
        <tr key={sensor.id}>
          <th>{sensor.id}</th>
          <td>{sensor.name}</td>
          <td>{sensor.type}</td>
          <td>{sensor.location}</td>
        </tr>
      ))}
    </>
  );
};

export default SensorTable;