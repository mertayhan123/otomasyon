"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

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

  // Animasyon varyantları
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const sliderVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

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
    <motion.div 
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <motion.h2 
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Cihaz Kontrol Paneli
      </motion.h2>

      {/* Voltaj Kontrolü */}
      <motion.div 
        className="mb-6"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-gray-700 mb-2">Voltaj (V)</label>
        <motion.div whileHover="hover" variants={sliderVariants}>
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
        </motion.div>
        <motion.div 
          className="text-center mt-2 text-lg font-semibold"
          animate={{ color: voltage > 400 ? "#ef4444" : voltage > 300 ? "#f59e0b" : "#3b82f6" }}
        >
          {voltage} V
        </motion.div>
      </motion.div>

      {/* Sıcaklık Kontrolü */}
      <motion.div 
        className="mb-6"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-gray-700 mb-2">Sıcaklık (°C)</label>
        <motion.div whileHover="hover" variants={sliderVariants}>
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
        </motion.div>
        <motion.div 
          className="text-center mt-2 text-lg font-semibold"
          animate={{ color: temperature > 80 ? "#ef4444" : temperature > 50 ? "#f59e0b" : "#10b981" }}
        >
          {temperature} °C
        </motion.div>
      </motion.div>

      {/* Cihaz Aç/Kapa Toggle */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-gray-700 font-medium">Cihaz Durumu:</span>
        <motion.label 
          className="swap swap-rotate"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <input
            type="checkbox"
            checked={isDeviceOn}
            onChange={() => setIsDeviceOn(!isDeviceOn)}
          />
          {/* Cihaz Açık İkonu */}
          <motion.svg
            className="swap-on fill-current w-8 h-8 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            animate={{ rotate: isDeviceOn ? 0 : 180 }}
            transition={{ duration: 0.5 }}
          >
            <path d="M5 13l4 4L19 7" />
          </motion.svg>
          {/* Cihaz Kapalı İkonu */}
          <motion.svg
            className="swap-off fill-current w-8 h-8 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            animate={{ rotate: isDeviceOn ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <path d="M19 13l-4-4-4 4m0 0l4 4 4-4" />
          </motion.svg>
        </motion.label>
      </motion.div>

      {/* Ayarları Kaydet Butonu */}
      <motion.div 
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button 
          className="btn btn-primary"
          onClick={handleSaveSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ayarları Kaydet
        </motion.button>
      </motion.div>

      {/* Uyarı Mesajı */}
      {alertMessage && (
        <motion.div 
          className="mt-6 alert alert-success text-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {alertMessage}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeviceControlPanel;
