// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Profil ayarları
  profile: {
    avatar: { type: String, default: '' },
    title: { type: String, default: '' },
    department: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  // Uygulama ayarları
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, enum: ['tr', 'en'], default: 'tr' },
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true }
  }
}, {
  timestamps: true // Oluşturulma ve güncellenme tarihlerini otomatik ekler
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
