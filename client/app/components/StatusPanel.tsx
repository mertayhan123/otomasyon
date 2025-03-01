"use client";
import React from "react";

interface StatusPanelProps {
  statusData: {
    waterPressure: string;
    waterLevel: string;
    phValue: string;
  };
}

const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Sistem Durumu
        </h2>
        
        <div className="space-y-6">
          {/* Su Basıncı */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Su Basıncı</h3>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{statusData.waterPressure}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
          </div>
          
          {/* Su Seviyesi */}
          <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300">Su Seviyesi</h3>
              <span className="text-xl font-bold text-teal-700 dark:text-teal-300">{statusData.waterLevel}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          
          {/* pH Değeri */}
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">pH Değeri</h3>
              <span className="text-xl font-bold text-purple-700 dark:text-purple-300">{statusData.phValue}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
