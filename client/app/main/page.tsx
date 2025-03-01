"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MotorTable from "../components/motor-table";
import SensorTable from "../components/sensor-table";
import StatusPanel from "../components/StatusPanel";
import AlarmPanel from "../components/AlarmPanel";
import MotorDetails from "../components/motor-details";
import Link from "next/link";

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

interface Motor {
  _id: string;
  name: string;
  type: string;
  location: string;
  voltage: number;
  temperature: number;
  isActive: boolean;
  isDeviceOn: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Alarm {
  id: number;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "info";
}

export const alarmData: Alarm[] = [
  {
    id: 1,
    message: "Su basıncı kritik seviyede düşüş gösterdi!",
    timestamp: "2025-02-24 14:35",
    type: "critical",
  },
  {
    id: 2,
    message: "pH değeri beklenen aralık dışında.",
    timestamp: "2025-02-24 13:20",
    type: "warning",
  },
  {
    id: 3,
    message: "Motor 3 düzenli çalışmıyor.",
    timestamp: "2025-02-24 12:05",
    type: "info",
  },
];

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userMotors, setUserMotors] = useState<Motor[]>([]);
  const [userSensors, setUserSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusData, setStatusData] = useState({
    waterPressure: "0 PSI",
    waterLevel: "0%",
    phValue: "0.0",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Kullanıcının motorlarını getiren fonksiyon
  const fetchUserMotors = async () => {
    try {
      const response = await fetch("/api/motor");
      const data = await response.json();
      
      if (data.success) {
        setUserMotors(data.motors);
      } else {
        console.error("Motor verisi getirilemedi:", data.message);
      }
    } catch (err) {
      console.error("Motor getirme hatası:", err);
    }
  };

  // Kullanıcının sensörlerini getiren fonksiyon
  const fetchUserSensors = async () => {
    try {
      const response = await fetch("/api/sensor");
      const data = await response.json();
      
      if (data.success) {
        setUserSensors(data.sensors);
      } else {
        console.error("Sensör verisi getirilemedi:", data.message);
      }
    } catch (err) {
      console.error("Sensör getirme hatası:", err);
    }
  };

  // Sistem durumunu getiren fonksiyon
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/status");
      const data = await response.json();
      
      if (data.success) {
        setStatusData({
          waterPressure: data.status.waterPressure || "0 PSI",
          waterLevel: data.status.waterLevel || "0%",
          phValue: data.status.phValue || "0.0",
        });
      } else {
        console.error("Durum verisi getirilemedi:", data.message);
      }
    } catch (err) {
      console.error("Durum getirme hatası:", err);
    }
  };

  // Tüm verileri getiren fonksiyon
  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    
    try {
      await Promise.all([
        fetchUserMotors(),
        fetchUserSensors(),
        fetchSystemStatus()
      ]);
    } catch (err) {
      setError("Veriler getirilirken bir hata oluştu");
      console.error("Veri getirme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAllData();
    }
  }, [status]);

  // Motor silme işlemi
  const handleDeleteMotor = async (id: string) => {
    try {
      const response = await fetch(`/api/motor?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserMotors(prevMotors => prevMotors.filter(motor => motor._id !== id));
      } else {
        setError(data.message || "Motor silinirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motor silinirken bir hata oluştu");
      console.error("Motor silme hatası:", err);
    }
  };

  // Motor güncelleme işlemi
  const handleUpdateMotor = async (id: string, motorData: Partial<Motor>) => {
    try {
      const response = await fetch(`/api/motor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...motorData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserMotors(prevMotors => 
          prevMotors.map(motor => 
            motor._id === id ? { ...motor, ...motorData } : motor
          )
        );
      } else {
        setError(data.message || "Motor güncellenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Motor güncellenirken bir hata oluştu");
      console.error("Motor güncelleme hatası:", err);
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
    <div className="min-h-screen p-6 bg-gradient-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Gerçek zamanlı Motor, Sensör ve Durum Bilgileri
          </p>
        </header>
        
        {error && (
          <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-destructive" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Motorlar Kartı */}
            <div className="card p-6">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Motorlar
                </h2>
                <Link href="/motorlar" className="btn btn-primary btn-sm gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Motorları Yönet
                </Link>
              </div>
              
              {userMotors.length > 0 ? (
                <MotorDetails 
                  motors={userMotors} 
                  onDelete={handleDeleteMotor}
                  onUpdate={handleUpdateMotor}
                />
              ) : (
                <div className="text-center p-8 bg-secondary rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-muted-foreground">Henüz motor eklenmemiş</p>
                  <Link href="/motorlar" className="btn btn-primary mt-4">
                    Motor Ekle
                  </Link>
                </div>
              )}
            </div>

            {/* Sensorler Kartı */}
            <div className="card p-6">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Sensörler
                </h2>
                <Link href="/sensorler" className="btn btn-primary btn-sm gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Sensörleri Yönet
                </Link>
              </div>
              
              {userSensors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">İsim</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tip</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Konum</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Değer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userSensors.map((sensor, index) => (
                        <tr 
                          key={sensor._id} 
                          className={`${index % 2 === 0 ? 'bg-background' : 'bg-secondary/20'} hover:bg-secondary/50 transition-colors`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                            {sensor._id.substring(0, 8)}...
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                            {sensor.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              {sensor.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                            {sensor.location}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                            {sensor.value} {sensor.unit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sensor.isActive 
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}>
                              {sensor.isActive ? "Aktif" : "Pasif"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 bg-secondary rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <p className="text-muted-foreground">Henüz sensör eklenmemiş</p>
                  <Link href="/sensorler" className="btn btn-primary mt-4">
                    Sensör Ekle
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Durum Paneli */}
          <div className="flex flex-col space-y-8">
            <StatusPanel statusData={statusData} />
            <AlarmPanel alarms={alarmData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
