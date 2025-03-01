import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@//app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";

// Profil bilgilerini getirme
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

    // Oturumdaki email ile kullanıcıyı veritabanında arıyoruz.
    const user = await User.findOne({ email: session.user.email }).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      profile: user.profile || {},
      settings: user.settings || {}
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Profil bilgilerini güncelleme
export async function PUT(request: Request) {
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
    const { profile, settings } = await request.json();

    // Oturumdaki email ile kullanıcıyı veritabanında arıyoruz.
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Profil ve ayarları güncelliyoruz
    if (profile) {
      user.profile = {
        ...user.profile || {},
        ...profile
      };
    }

    if (settings) {
      user.settings = {
        ...user.settings || {},
        ...settings
      };
    }

    // Kullanıcıyı kaydediyoruz
    await user.save();

    return NextResponse.json({ 
      success: true, 
      profile: user.profile,
      settings: user.settings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 