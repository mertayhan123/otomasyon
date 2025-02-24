import React from "react";
import { FaTint, FaWater, FaVial } from "react-icons/fa";

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
    <div className="card bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">Durum Paneli</h2>
        <div className="space-y-6 mt-4">
          {/* Su Basıncı */}
          <div className="flex items-center">
            <FaTint className="text-2xl mr-3" />
            <div>
              <p className="font-semibold">Su Basıncı</p>
              <p className="text-lg">{statusData.waterPressure}</p>
            </div>
          </div>
          {/* Su Yüksekliği */}
          <div className="flex items-center">
            <FaWater className="text-2xl mr-3" />
            <div>
              <p className="font-semibold">Su Yüksekliği</p>
              <p className="text-lg">{statusData.waterLevel}</p>
            </div>
          </div>
          {/* pH Değeri */}
          <div className="flex items-center">
            <FaVial className="text-2xl mr-3" />
            <div>
              <p className="font-semibold">pH Değeri</p>
              <p className="text-lg">{statusData.phValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
