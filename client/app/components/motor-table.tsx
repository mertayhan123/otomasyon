import React from "react";

function motorTable({ motorData }: any) {
  return motorData.map((item: any) => (
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

export default motorTable;
