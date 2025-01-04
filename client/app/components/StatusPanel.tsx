// components/StatusPanel.tsx

import React from "react";

interface StatusData {
  waterPressure: string;
  waterLevel: string;
  phValue: string;
}

interface StatusPanelProps {
  statusData: StatusData;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Durum Paneli</h2>
        <div className="space-y-4">
          {/* Su Basıncı */}
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Su Basıncı:</span>
            <span className="badge badge-primary">{statusData.waterPressure}</span>
          </div>
          {/* Su Yüksekliği */}
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Su Yüksekliği:</span>
            <span className="badge badge-secondary">{statusData.waterLevel}</span>
          </div>
          {/* pH Değeri */}
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">pH Değeri:</span>
            <span className="badge badge-accent">{statusData.phValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;