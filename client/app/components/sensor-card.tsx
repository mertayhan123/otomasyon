import React from "react";
import { sensorData } from "../page";

function sensorCard() {
  return sensorData.map((item: any) => (
    <div className="stats bg-primary text-primary-content m-2 d-flex">
      <div className="stat">
        <div className="stat-title">ID</div>
        <div className="stat-value">{item.id}</div>
        <div className="stat-title">Type</div>
        <div className="stat-value">{item.type}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Name</div>
        <div className="stat-value">{item.name}</div>
        <div className="stat-title">Location</div>
        <div className="stat-value">{item.location}</div>
        <div className="stat-actions">
          <button className="btn btn-sm btn-success">AC/kapat</button>
        </div>
      </div>
    </div>
  ));
}

export default sensorCard;
