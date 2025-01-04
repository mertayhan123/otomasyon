// components/MotorTable.tsx

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
        <tr key={motor.id}>
          <th>{motor.id}</th>
          <td>{motor.name}</td>
          <td>{motor.type}</td>
          <td>{motor.location}</td>
        </tr>
      ))}
    </>
  );
};

export default MotorTable;