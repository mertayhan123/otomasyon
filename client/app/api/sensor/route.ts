import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@//app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import Sensor from "../../models/Sensor";

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

    // Kullanıcıya ait sensörleri buluyoruz
    const sensors = await Sensor.find({ user: user._id });

    return NextResponse.json({ 
      success: true, 
      sensors,
      hasSensors: sensors.length > 0 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Sensör silme endpointi
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

    // URL'den sensör ID'sini alıyoruz
    const url = new URL(request.url);
    const sensorId = url.searchParams.get('id');
    
    if (!sensorId) {
      return NextResponse.json(
        { success: false, message: "Sensor ID is required" },
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

    // Kullanıcıya ait sensörü buluyoruz ve siliyoruz
    const sensor = await Sensor.findOne({ _id: sensorId, user: user._id });
    
    if (!sensor) {
      return NextResponse.json(
        { success: false, message: "Sensor not found or not authorized" },
        { status: 404 }
      );
    }
    
    await Sensor.deleteOne({ _id: sensorId });

    return NextResponse.json({ 
      success: true, 
      message: "Sensor deleted successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Sensör güncelleme endpointi
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
    const { id, name, type, location, value, unit, isActive } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Sensor ID is required" },
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

    // Kullanıcıya ait sensörü buluyoruz
    const sensor = await Sensor.findOne({ _id: id, user: user._id });
    
    if (!sensor) {
      return NextResponse.json(
        { success: false, message: "Sensor not found or not authorized" },
        { status: 404 }
      );
    }
    
    // Sensörü güncelliyoruz
    const updatedSensor = await Sensor.findByIdAndUpdate(
      id,
      { name, type, location, value, unit, isActive },
      { new: true } // Güncellenmiş veriyi döndür
    );

    return NextResponse.json({ 
      success: true, 
      sensor: updatedSensor,
      message: "Sensor updated successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 