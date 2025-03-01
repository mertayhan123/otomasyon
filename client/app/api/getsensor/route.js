import { NextResponse } from 'next/server';
import connectDB from "../../lib/mongodb";
import Sensor from "../../models/Sensor";

export async function GET() {
  try {
    // MongoDB bağlantısını sağlıyoruz.
    await connectDB();

    // Tüm sensörleri veritabanından alıyoruz.
    const sensors = await Sensor.find();

    return NextResponse.json({ success: true, sensors });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}