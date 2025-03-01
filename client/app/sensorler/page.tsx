"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SensorForm from "../components/sensor-form";
import SensorDetails from "../components/sensor-details";

interface Sensor {
  _id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Sensorler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFormVisible, setFormVisible] = useState(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sensor");
      const data = await response.json();
      
      if (data.success) {
        setSensors(data.sensors);
      } else {
        setError(data.message || "Sensörler getirilirken bir hata oluştu");
      }
    } catch (err) {
      setError("Sensörler getirilirken bir hata oluştu");
      console.error("Sensör getirme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSensors();
    }
  }, [status]);

  // Sensör silme işlevi
  const handleDeleteSensor = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sensor?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        // Sensörleri yeniden getir
        fetchSensors();
      } else {
        setError(data.message || "Sensör silinirken bir hata oluştu");
      }
    } catch (err) {
      setError("Sensör silinirken bir hata oluştu");
      console.error("Sensör silme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sensör güncelleme işlevi
  const handleUpdateSensor = async (id: string, sensorData: { 
    name: string; 
    type: string; 
    location: string; 
    value: number; 
    unit: string; 
    isActive: boolean 
  }) => {
    try {
      setLoading(true);
      const response = await fetch("/api/sensor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...sensorData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Sensörleri yeniden getir
        fetchSensors();
      } else {
        setError(data.message || "Sensör güncellenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Sensör güncellenirken bir hata oluştu");
      console.error("Sensör güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sensörler</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sensör bilgilerinizi görüntüleyin ve yönetin
          </p>
        </header>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            className="btn btn-primary"
            onClick={() => setFormVisible(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Sensör Ekle
          </button>
        </div>

        {sensors.length > 0 ? (
          <SensorDetails 
            sensors={sensors} 
            onDelete={handleDeleteSensor}
            onUpdate={handleUpdateSensor}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Henüz sensör eklenmemiş</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Yeni bir sensör eklemek için "Sensör Ekle" butonuna tıklayın.</p>
            <button
              className="mt-6 btn btn-primary"
              onClick={() => setFormVisible(true)}
            >
              Sensör Ekle
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/main" className="btn btn-outline btn-secondary">
            Dashboard'a Dön
          </a>
        </div>
      </div>

      {isFormVisible && (
        <SensorForm 
          onClose={() => setFormVisible(false)} 
          onSensorAdded={fetchSensors}
        />
      )}
    </div>
  );
}
