"use client";
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
        <tr key={sensor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            #{sensor.id}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            {sensor.name}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              {sensor.type}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            {sensor.location}
          </td>
        </tr>
      ))}
    </>
  );
};

export default SensorTable;
