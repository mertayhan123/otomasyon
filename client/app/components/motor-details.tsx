"use client";
import React, { useState } from 'react';

interface MotorProps {
  motors: {
    _id: string;
    voltage: number;
    temperature: number;
    isDeviceOn: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { voltage: number; temperature: number; isDeviceOn: boolean }) => Promise<void>;
}

const MotorDetails: React.FC<MotorProps> = ({ motors, onDelete, onUpdate }) => {
  const [editingMotor, setEditingMotor] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    voltage: 0,
    temperature: 0,
    isDeviceOn: false
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = (motor: any) => {
    setEditingMotor(motor._id);
    setFormData({
      voltage: motor.voltage,
      temperature: motor.temperature,
      isDeviceOn: motor.isDeviceOn
    });
  };

  const handleCancelEdit = () => {
    setEditingMotor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : Number(value)
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);
      await onUpdate(id, formData);
      setEditingMotor(null);
    } catch (error) {
      console.error("Motor güncelleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu motoru silmek istediğinizden emin misiniz?")) {
      try {
        setLoading(true);
        await onDelete(id);
      } catch (error) {
        console.error("Motor silme hatası:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {motors.map((motor) => (
        <div key={motor._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          {editingMotor === motor._id ? (
            // Düzenleme formu
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Motor Düzenle</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  onClick={handleCancelEdit} 
                  className="btn btn-outline"
                  disabled={loading}
                >
                  İptal
                </button>
                <button 
                  onClick={() => handleUpdate(motor._id)} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Güncelleniyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          ) : (
            // Motor bilgileri görünümü
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Motor #{motor._id.slice(-4)}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  motor.isDeviceOn ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {motor.isDeviceOn ? 'Açık' : 'Kapalı'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Voltaj</p>
                  <p className="font-medium text-gray-900 dark:text-white">{motor.voltage} V</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sıcaklık</p>
                  <p className="font-medium text-gray-900 dark:text-white">{motor.temperature} °C</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Son Güncelleme</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(motor.updatedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oluşturulma</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(motor.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => handleEdit(motor)} 
                  className="btn btn-sm btn-outline btn-info"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(motor._id)} 
                  className="btn btn-sm btn-outline btn-error"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Sil
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MotorDetails; 