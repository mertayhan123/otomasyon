"use client"
import React from "react";
import { sensorData } from "../main/page";
import styles from "../styles/sensorcard.module.css";

function sensorCard() {
  return sensorData.map((item: any) => (
    <div className="stats bg-primary text-primary-content m-2 ">
      <div className="stat">
        <div className="stat-title text-lg">ID</div>
        <div className="stat-value text-2xl">{item.id}</div>
        <div className="stat-title text-lg">Type</div>
        <div className="stat-value text-2xl">{item.type}</div>
      </div>
      <div className={`${styles.stats} stat`}>
        <div className="stat-title text-lg">Name</div>
        <div className="stat-value text-2xl">{item.name}</div>
        <div className="stat-title text-lg">Location</div>
        <div className="stat-value text-2xl">{item.location}</div>
        <div className="stat-actions">
          <button className="btn btn-sm btn-success">Ac/Kapat</button>
        </div>
      </div>
    </div>
  ));
}

export default sensorCard;
