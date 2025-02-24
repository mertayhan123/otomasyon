"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface MotorCardProps {
  onRemove: () => void;
  cardId: number | string;
}

const DeviceControlPanel: React.FC<MotorCardProps> = ({ onRemove }) => {
  const { data: session } = useSession();
  console.log(session);
  // Varsayılan ayar değerleri
  const [voltage, setVoltage] = useState<number>(220); // Voltaj (V)
  const [temperature, setTemperature] = useState<number>(25); // Sıcaklık (°C)
  const [isDeviceOn, setIsDeviceOn] = useState<boolean>(false); // Cihazın açık/kapalı durumu
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Ayarları kaydetme simülasyonu ve API çağrısı
  const handleSaveSettings = async (): Promise<void> => {
    // Ayar verilerini API'ya gönderiyoruz.
    const settings = { voltage, temperature, isDeviceOn };
    try {
      const response = await fetch("/api/motorkayit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAlertMessage("Ayarlar başarıyla kaydedildi!");
        onRemove(); // İsteğe bağlı olarak bileşeni kaldırabilir ya da başka bir işlem tetikleyebilirsiniz.
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      } else {
        setAlertMessage("Bir hata oluştu: " + (data.message || "Bilinmeyen hata"));
      }
    } catch (error: any) {
      setAlertMessage("Bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Cihaz Kontrol Paneli
      </h2>

      {/* Voltaj Kontrolü */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Voltaj (V)</label>
        <input
          type="range"
          min="0"
          max="500"
          value={voltage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setVoltage(Number(e.target.value))
          }
          className="range range-primary"
        />
        <div className="text-center mt-2 text-lg font-semibold">{voltage} V</div>
      </div>

      {/* Sıcaklık Kontrolü */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Sıcaklık (°C)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={temperature}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTemperature(Number(e.target.value))
          }
          className="range range-secondary"
        />
        <div className="text-center mt-2 text-lg font-semibold">
          {temperature} °C
        </div>
      </div>

      {/* Cihaz Aç/Kapa Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-700 font-medium">Cihaz Durumu:</span>
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={isDeviceOn}
            onChange={() => setIsDeviceOn(!isDeviceOn)}
          />
          {/* Cihaz Açık İkonu */}
          <svg
            className="swap-on fill-current w-8 h-8 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {/* Cihaz Kapalı İkonu */}
          <svg
            className="swap-off fill-current w-8 h-8 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19 13l-4-4-4 4m0 0l4 4 4-4" />
          </svg>
        </label>
      </div>

      {/* Ayarları Kaydet Butonu */}
      <div className="flex justify-center">
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          Ayarları Kaydet
        </button>
      </div>

      {/* Uyarı Mesajı */}
      {alertMessage && (
        <div className="mt-6 alert alert-success text-center">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default DeviceControlPanel;
