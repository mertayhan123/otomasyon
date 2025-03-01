import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@//app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";

// Sistem durumunu getirme
export async function GET(request: Request) {
  try {
    // MongoDB bağlantısını sağlıyoruz.
    await connectDB();

    // Oturum bilgisini alıyoruz.
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Gerçek bir sistemde bu veriler sensörlerden veya başka bir kaynaktan gelecektir
    // Şimdilik örnek veriler döndürüyoruz
    const statusData = {
      waterPressure: "120 PSI",
      waterLevel: "75%",
      phValue: "7.4",
      systemTemperature: "24°C",
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      status: statusData
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 