import React from "react";

function sensorTable({ sensorData }: any) {
  return sensorData.map((item: any) => (
    <>
      <tr className="hover">
        <th>{item.id}</th>
        <td>{item.name}</td>
        <td>{item.type}</td>
        <td>{item.location}</td>
      </tr>
    </>
  ));
}

export default sensorTable;
