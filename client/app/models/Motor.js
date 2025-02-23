// models/Motor.js
import mongoose from "mongoose";

const MotorSchema = new mongoose.Schema({
  id : {
    type: String,
    required: true,
  },
  userId: {
    type: String, // veya ObjectId kullanabilirsiniz
    required: true,
  },
  güç: {
    type: Number,
    required: true,
  },
  verimlilik: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose modelini tanımla (aynı isimde model varsa tekrar tanımlama)
export default mongoose.models.Motor || mongoose.model("Motor", MotorSchema);
