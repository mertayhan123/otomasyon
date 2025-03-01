"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MotorDetails from "../components/motor-details";

interface Motor {
  _id: string;
  voltage: number;
  temperature: number;
  isDeviceOn: boolean;
  createdAt: string;
  updatedAt: string;
}

const MotorlarPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    voltage: 220,
    temperature: 25,
    isDeviceOn: false
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchMotors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/motor");
      const data = await response.json();
      
      if (data.success) {
        setMotors(data.motors);
      } else {
        setError(data.message || "Motorlar getirilirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motorlar getirilirken bir hata oluştu");
      console.error("Motor getirme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchMotors();
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : Number(value)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/motorkayit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Form verilerini sıfırla
        setFormData({
          voltage: 220,
          temperature: 25,
          isDeviceOn: false
        });
        // Motorları yeniden getir
        fetchMotors();
      } else {
        setError(data.message || "Motor eklenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motor eklenirken bir hata oluştu");
      console.error("Motor ekleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Motor silme işlevi
  const handleDeleteMotor = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/motor?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        // Motorları yeniden getir
        fetchMotors();
      } else {
        setError(data.message || "Motor silinirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motor silinirken bir hata oluştu");
      console.error("Motor silme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Motor güncelleme işlevi
  const handleUpdateMotor = async (id: string, motorData: { voltage: number; temperature: number; isDeviceOn: boolean }) => {
    try {
      setLoading(true);
      const response = await fetch("/api/motor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...motorData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Motorları yeniden getir
        fetchMotors();
      } else {
        setError(data.message || "Motor güncellenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motor güncellenirken bir hata oluştu");
      console.error("Motor güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Motorlar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Motor bilgilerinizi görüntüleyin ve yönetin
          </p>
        </header>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Motor Ekleme Formu */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Yeni Motor Ekle</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Voltaj (V)</span>
                  </label>
                  <input
                    type="number"
                    name="voltage"
                    value={formData.voltage}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sıcaklık (°C)</span>
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Cihaz Açık</span>
                    <input
                      type="checkbox"
                      name="isDeviceOn"
                      checked={formData.isDeviceOn}
                      onChange={handleInputChange}
                      className="toggle toggle-primary"
                    />
                  </label>
                </div>
                
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary w-full">
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Ekleniyor...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Motor Ekle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Mevcut Motorlar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Mevcut Motorlar</h2>
              
              {motors.length > 0 ? (
                <MotorDetails 
                  motors={motors} 
                  onDelete={handleDeleteMotor}
                  onUpdate={handleUpdateMotor}
                />
              ) : (
                <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">Henüz motor eklenmemiş. Yeni bir motor ekleyin.</p>
                </div>
              )}
              
              <div className="mt-6">
                <a href="/main" className="btn btn-outline btn-secondary w-full">
                  Dashboard'a Dön
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorlarPage;
