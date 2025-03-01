import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@//app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import Motor from "../../models/Motor";

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
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Kullanıcıya ait motorları buluyoruz
    const motors = await Motor.find({ user: user._id });

    return NextResponse.json({ 
      success: true, 
      motors,
      hasMotors: motors.length > 0 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Motor silme endpointi
export async function DELETE(request: Request) {
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

    // URL'den motor ID'sini alıyoruz
    const url = new URL(request.url);
    const motorId = url.searchParams.get('id');
    
    if (!motorId) {
      return NextResponse.json(
        { success: false, message: "Motor ID is required" },
        { status: 400 }
      );
    }

    // Oturumdaki email ile kullanıcıyı veritabanında arıyoruz.
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Kullanıcıya ait motoru buluyoruz ve siliyoruz
    const motor = await Motor.findOne({ _id: motorId, user: user._id });
    
    if (!motor) {
      return NextResponse.json(
        { success: false, message: "Motor not found or not authorized" },
        { status: 404 }
      );
    }
    
    await Motor.deleteOne({ _id: motorId });

    return NextResponse.json({ 
      success: true, 
      message: "Motor deleted successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Motor güncelleme endpointi
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
    const { id, voltage, temperature, isDeviceOn } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Motor ID is required" },
        { status: 400 }
      );
    }

    // Oturumdaki email ile kullanıcıyı veritabanında arıyoruz.
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Kullanıcıya ait motoru buluyoruz
    const motor = await Motor.findOne({ _id: id, user: user._id });
    
    if (!motor) {
      return NextResponse.json(
        { success: false, message: "Motor not found or not authorized" },
        { status: 404 }
      );
    }
    
    // Motoru güncelliyoruz
    const updatedMotor = await Motor.findByIdAndUpdate(
      id,
      { voltage, temperature, isDeviceOn },
      { new: true } // Güncellenmiş veriyi döndür
    );

    return NextResponse.json({ 
      success: true, 
      motor: updatedMotor,
      message: "Motor updated successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 