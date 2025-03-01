"use client";
import React, { useState } from 'react';

interface SensorProps {
  sensors: {
    _id: string;
    name: string;
    type: string;
    location: string;
    value: number;
    unit: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { 
    name: string; 
    type: string; 
    location: string; 
    value: number; 
    unit: string; 
    isActive: boolean 
  }) => Promise<void>;
}

const SensorDetails: React.FC<SensorProps> = ({ sensors, onDelete, onUpdate }) => {
  const [editingSensor, setEditingSensor] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    value: 0,
    unit: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = (sensor: any) => {
    setEditingSensor(sensor._id);
    setFormData({
      name: sensor.name,
      type: sensor.type,
      location: sensor.location,
      value: sensor.value,
      unit: sensor.unit,
      isActive: sensor.isActive
    });
  };

  const handleCancelEdit = () => {
    setEditingSensor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              type === "number" ? Number(value) : value
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);
      await onUpdate(id, formData);
      setEditingSensor(null);
    } catch (error) {
      console.error("Sensör güncelleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu sensörü silmek istediğinizden emin misiniz?")) {
      try {
        setLoading(true);
        await onDelete(id);
      } catch (error) {
        console.error("Sensör silme hatası:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {sensors.map((sensor) => (
        <div key={sensor._id} className="card p-6">
          {editingSensor === sensor._id ? (
            // Düzenleme formu
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4">Sensör Düzenle</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Sensör Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Sensör Tipi
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Konum
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Değer
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Birim
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                
                <div className="form-control flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-input rounded mr-2"
                    />
                    <span className="text-sm text-foreground">Aktif</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  onClick={handleCancelEdit} 
                  className="px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-secondary transition-colors"
                  disabled={loading}
                >
                  İptal
                </button>
                <button 
                  onClick={() => handleUpdate(sensor._id)} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Güncelleniyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          ) : (
            // Sensör bilgileri görünümü
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">{sensor.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sensor.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {sensor.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Tip</p>
                  <p className="font-medium text-foreground">{sensor.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Konum</p>
                  <p className="font-medium text-foreground">{sensor.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Değer</p>
                  <p className="font-medium text-foreground">
                    {sensor.value} {sensor.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Son Güncelleme</p>
                  <p className="font-medium text-foreground">
                    {new Date(sensor.updatedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => handleEdit(sensor)} 
                  className="inline-flex items-center px-3 py-1.5 border border-input rounded-md bg-background text-foreground hover:bg-secondary transition-colors text-sm"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(sensor._id)} 
                  className="inline-flex items-center px-3 py-1.5 border border-destructive rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
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

export default SensorDetails; 