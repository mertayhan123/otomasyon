"use client";
import React, { useState } from 'react';

interface SensorFormProps {
  onClose: () => void;
  onSensorAdded: () => void;
}

const SensorForm: React.FC<SensorFormProps> = ({ onClose, onSensorAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    value: 0,
    unit: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sensorkayit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSensorAdded();
        onClose();
      } else {
        setError(data.message || 'Sensör eklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Sensör eklenirken bir hata oluştu');
      console.error('Sensör ekleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Yeni Sensör Ekle</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                type="button"
                onClick={onClose} 
                className="px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-secondary transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ekleniyor...
                  </div>
                ) : 'Sensör Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SensorForm; 