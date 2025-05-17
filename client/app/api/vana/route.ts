import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import Vana from "@/app/models/Vana";
// ✅ GET - Kullanıcının vanalarını getir
export async function GET(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const vanas = await Vana.find({ user: user._id });
    return NextResponse.json({ success: true, vanas });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Vana sil
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const vanaId = url.searchParams.get("id");

    if (!vanaId) {
      return NextResponse.json({ success: false, message: "Vana ID gereklidir." }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const vana = await Vana.findOne({ _id: vanaId, user: user._id });
    if (!vana) {
      return NextResponse.json({ success: false, message: "Yetkisiz işlem veya vana yok" }, { status: 404 });
    }

    await Vana.deleteOne({ _id: vanaId });

    return NextResponse.json({ success: true, message: "Vana başarıyla silindi" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ PUT - Vana güncelle
export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, name, location, openness } = await request.json();
    if (!id || !name || !location || openness === undefined) {
      return NextResponse.json({ success: false, message: "Eksik alanlar var" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const vana = await Vana.findOne({ _id: id, user: user._id });
    if (!vana) {
      return NextResponse.json({ success: false, message: "Vana bulunamadı veya erişim yok" }, { status: 404 });
    }

    const updatedVana = await Vana.findByIdAndUpdate(
      id,
      { name, location, openness },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Vana güncellendi", vana: updatedVana });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
