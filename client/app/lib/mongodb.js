// mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MongoDB bağlantısı başlatılıyor...");
    console.log("Bağlantı durumu:", mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB URI:", process.env.MONGODB_URI);
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB bağlantısı başarılı");
    } else {
      console.log("MongoDB zaten bağlı");
    }
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    throw error; // Hatayı yukarı fırlat
  }
};

export { connectDB };
