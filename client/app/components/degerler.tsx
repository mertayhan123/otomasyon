import React from 'react'

interface DegerlerProps {
  rangeValue: number;
  voltageValue: number;
}

const Degerler: React.FC<DegerlerProps> = ({ rangeValue,voltageValue }) => {
  return (
    <div className="stats shadow mb-5">
      <div className="stat place-items-center">
        <div className="stat-title">Güç</div>
        <div className="stat-value">%{rangeValue}</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Volt</div>
        <div className="stat-value text-secondary">({(rangeValue*0.6).toFixed(2)})</div>
        <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Verimlilik</div>
        <div className="stat-value">{voltageValue}</div>
        <div className="stat-desc">↘︎ 90 (14%)</div>
      </div>
    </div>
  )
}

export default Degerler
