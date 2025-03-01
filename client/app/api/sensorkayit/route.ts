import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@//app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import Sensor from "../../models/Sensor";

export async function POST(request: Request) {
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

    // İstek gövdesini JSON olarak parse ediyoruz.
    const { name, type, location, value, unit, isActive } = await request.json();

    // Oturumdaki email ile kullanıcıyı veritabanında arıyoruz.
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Yeni bir Sensor belgesi oluşturuyoruz.
    const sensor = await Sensor.create({
      user: user._id,
      name,
      type,
      location,
      value: value || 0,
      unit: unit || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, sensor });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 