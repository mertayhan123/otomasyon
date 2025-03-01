// components/MotorTable.tsx

"use client";
import React from "react";

// Motor verisinin yapısını tanımlayan arayüz
interface Motor {
  id: number;
  name: string;
  type: string;
  location: string;
}

// Bileşenin prop'larının tipini tanımlayan arayüz
interface MotorTableProps {
  motorData: Motor[];
}

const MotorTable: React.FC<MotorTableProps> = ({ motorData }) => {
  return (
    <>
      {motorData.map((motor) => (
        <tr key={motor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            #{motor.id}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            {motor.name}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {motor.type}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            {motor.location}
          </td>
        </tr>
      ))}
    </>
  );
};

export default MotorTable;