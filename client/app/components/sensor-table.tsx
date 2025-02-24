import React from "react";

interface Sensor {
  id: number;
  name: string;
  type: string;
  location: string;
}

interface SensorTableProps {
  sensorData: Sensor[];
}

const SensorTable: React.FC<SensorTableProps> = ({ sensorData }) => {
  return (
    <>
      {sensorData.map((sensor) => (
        <tr key={sensor.id} className="hover:bg-gray-100 transition-colors">
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
