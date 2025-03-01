"use client";
import React, { useState } from "react";

interface SensorFormProps {
  onClose: () => void;
  onSensorAdded: () => void;
}

function SensorForm({ onClose, onSensorAdded }: SensorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    value: 0,
    unit: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              type === "number" ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/sensorkayit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        onSensorAdded();
        onClose();
      } else {
        setError(data.message || "Sensör eklenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Sensör eklenirken bir hata oluştu");
      console.error("Sensör ekleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sensör Ekle</h2>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sensör Adı</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sensör Tipi</span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Konum</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Değer</span>
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Birim</span>
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Aktif</span>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Ekleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SensorForm;
