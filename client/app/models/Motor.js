// models/Motor.js
import mongoose from 'mongoose';

const MotorSchema = new mongoose.Schema(
  {
    // Kullanıcı referansı: Hangi kullanıcıya ait motor bilgisi
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Motor ayarları ve verileri
    voltage: { 
      type: Number, 
      required: true 
    },
    temperature: { 
      type: Number, 
      required: true 
    },
    isDeviceOn: { 
      type: Boolean, 
      default: false 
    },
    // İleride eklenebilecek diğer alanlar örneğin performans, konum vs.
    // performance: { type: Number },
    // location: { type: String },
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme tarihlerini otomatik ekler
  }
);

const Motor = mongoose.models.Motor || mongoose.model('Motor', MotorSchema);

export default Motor;
