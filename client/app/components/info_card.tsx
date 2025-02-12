"use client";
import React, { useState } from 'react';

const EnvironmentCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pressure, setPressure] = useState(50); // Başlangıç basınç değeri

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="card w-full max-w-md bg-base-100 shadow-2xl transition-transform transform hover:scale-105">
        <div className="card-body">
          <h2 className="card-title text-2xl text-center mb-4 border-b pb-2">Çevre Bilgileri</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Isı:</span>
              <span className="text-lg">24°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Derinlik:</span>
              <span className="text-lg">15m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Suyun Temizliği:</span>
              <span className="text-lg">Temiz</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Nem Oranı:</span>
              <span className="text-lg">%60</span>
            </div>
          </div>
          <div className="card-actions justify-between mt-6">
            <button className="btn btn-primary flex-1 mr-2" onClick={toggleModal}>
              Detaylar
            </button>
            <button className="btn btn-outline flex-1">Paylaş</button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Basınç Ayarları</h3>
            <div className="py-4">
              <label htmlFor="pressureRange" className="block text-sm font-medium text-gray-700 mb-2">
                Basınç Değeri: {pressure}
              </label>
              <input
                id="pressureRange"
                type="range"
                min="0"
                max="100"
                value={pressure}
                onChange={(e) => setPressure(Number(e.target.value))}
                className="range range-primary"
              />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={toggleModal}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnvironmentCard;
