import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import Vana from "@/app/models/Vana";


export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, location, openness } = await request.json();

    if (!name || !location || openness === undefined) {
      return NextResponse.json(
        { success: false, message: "Tüm alanlar gereklidir." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const newVana = await Vana.create({
      user: user._id,
      name,
      location,
      openness,
    });

    return NextResponse.json({ success: true, vana: newVana });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
