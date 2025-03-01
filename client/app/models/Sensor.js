import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema(
  {
    // Kullanıcı referansı: Hangi kullanıcıya ait sensör bilgisi
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Sensör bilgileri
    name: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    value: { 
      type: Number, 
      default: 0 
    },
    unit: { 
      type: String, 
      default: '' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    // İleride eklenebilecek diğer alanlar
    // threshold: { type: Number },
    // alertEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme tarihlerini otomatik ekler
  }
);

const Sensor = mongoose.models.Sensor || mongoose.model('Sensor', SensorSchema);

export default Sensor; 