import React from "react";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";

interface Alarm {
  id: number;
  message: string;
  timestamp: string;
  type: "warning" | "critical" | "info";
}

interface AlarmPanelProps {
  alarms: Alarm[];
}

const AlarmPanel: React.FC<AlarmPanelProps> = ({ alarms }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-xl">Alarm Bildirimleri</h2>
          <FaBell className="text-2xl text-red-500" />
        </div>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {alarms.length === 0 ? (
            <p className="text-gray-500">Şu anda aktif alarm bulunmamaktadır.</p>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 rounded-lg border ${
                  alarm.type === "critical"
                    ? "bg-red-100 border-red-400"
                    : alarm.type === "warning"
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-blue-100 border-blue-400"
                } flex items-start`}
              >
                <div className="mr-3 mt-1">
                  <FaExclamationTriangle
                    className={`text-xl ${
                      alarm.type === "critical"
                        ? "text-red-500"
                        : alarm.type === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold">{alarm.message}</p>
                  <p className="text-sm text-gray-600">{alarm.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmPanel;
